import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import { rootStore } from '../stores/rootStore';

class AppStateManager {
    constructor() {
        this.appState = AppState.currentState;
        this.backgroundTime = null;
        this.activeTimers = new Set();
        this.isAppInBackground = false;

        this.init();
    }

    init() {
        AppState.addEventListener('change', this.handleAppStateChange);

        // Clear any existing timers on app start
        this.clearAllTimers();
    }

    handleAppStateChange = async (nextAppState) => {
        console.log('App State Changed:', this.appState, '->', nextAppState);

        if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
            // App has come to the foreground
            await this.handleAppForeground();
        } else if (nextAppState.match(/inactive|background/)) {
            // App has gone to background
            await this.handleAppBackground();
        }

        this.appState = nextAppState;
    };

    handleAppForeground = async () => {
        console.log('App came to foreground');
        this.isAppInBackground = false;

        try {
            // Get background time and restore state
            const backgroundTimeStr = await AsyncStorage.getItem('app_background_time');
            const savedAppState = await AsyncStorage.getItem('app_state');

            if (backgroundTimeStr) {
                const backgroundTime = new Date(backgroundTimeStr);
                const currentTime = new Date();
                const timeDiff = currentTime - backgroundTime;

                console.log('App was in background for:', timeDiff / 1000, 'seconds');

                // If app was in background for more than 30 seconds, consider it a "fresh start"
                if (timeDiff > 30000) {
                    console.log('App was in background too long, treating as fresh start');
                    await this.resetAppState();
                } else {
                    // Restore previous state
                    if (savedAppState) {
                        const state = JSON.parse(savedAppState);
                        await this.restoreAppState(state);
                    }
                }
            }

            // Clear background data
            await AsyncStorage.multiRemove(['app_background_time', 'app_state']);

        } catch (error) {
            console.error('Error handling app foreground:', error);
        }
    };

    handleAppBackground = async () => {
        console.log('App went to background');
        this.isAppInBackground = true;

        try {
            // Save current time and app state
            await AsyncStorage.setItem('app_background_time', new Date().toISOString());

            // Save critical app state
            const currentState = {
                user: rootStore.commonStore.user,
                token: rootStore.commonStore.token,
                currentLocation: rootStore.commonStore.currentLocation,
                // Add other critical state here
            };

            await AsyncStorage.setItem('app_state', JSON.stringify(currentState));

            // Pause heavy operations
            this.pauseHeavyOperations();

        } catch (error) {
            console.error('Error handling app background:', error);
        }
    };

    pauseHeavyOperations = () => {
        // Clear all background timers to prevent memory leaks
        this.clearAllTimers();

        // Pause socket connections if needed
        // socketServices.pause();

        console.log('Heavy operations paused');
    };

    resumeHeavyOperations = () => {
        // Resume operations when app comes back
        console.log('Heavy operations resumed');

        // Reconnect sockets if needed
        // socketServices.resume();
    };

    // Better timer management
    createTimer = (callback, interval, isBackground = false) => {
        const timerId = isBackground
            ? BackgroundTimer.setInterval(callback, interval)
            : setInterval(callback, interval);

        this.activeTimers.add(timerId);

        return {
            id: timerId,
            clear: () => {
                if (isBackground) {
                    BackgroundTimer.clearInterval(timerId);
                } else {
                    clearInterval(timerId);
                }
                this.activeTimers.delete(timerId);
            }
        };
    };

    clearAllTimers = () => {
        this.activeTimers.forEach(timerId => {
            try {
                clearInterval(timerId);
                BackgroundTimer.clearInterval(timerId);
            } catch (error) {
                console.log('Error clearing timer:', error);
            }
        });
        this.activeTimers.clear();
    };

    resetAppState = async () => {
        try {
            // Reset to initial state
            await rootStore.commonStore.resetToInitialState();
            console.log('App state reset to initial');
        } catch (error) {
            console.error('Error resetting app state:', error);
        }
    };

    restoreAppState = async (savedState) => {
        try {
            // Restore critical state
            if (savedState.user) {
                rootStore.commonStore.setUser(savedState.user);
            }
            if (savedState.token) {
                rootStore.commonStore.setToken(savedState.token);
            }
            if (savedState.currentLocation) {
                rootStore.commonStore.setCurrentLocation(savedState.currentLocation);
            }

            console.log('App state restored');
        } catch (error) {
            console.error('Error restoring app state:', error);
        }
    };

    // Memory management
    cleanupMemory = () => {
        // Force garbage collection if possible
        if (global.gc) {
            global.gc();
        }

        // Clear unnecessary caches
        this.clearImageCache();
    };

    clearImageCache = () => {
        // Clear image caches to free memory
        // This depends on your image library
        console.log('Image cache cleared');
    };

    destroy = () => {
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.clearAllTimers();
    };
}

// Create singleton instance
const appStateManager = new AppStateManager();

export default appStateManager;
