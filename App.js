import React, { createRef, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  DeviceEventEmitter,
  AppState,
} from 'react-native';
import Root from './src/navigation/Root';
import { PaperProvider } from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { setBarColor, setStatusBar } from './src/halpers/SetStatusBarColor'
import { colors } from './src/theme/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from './src/components/NoInternet';
import { rootStore } from './src/stores/rootStore';
import Toast from 'react-native-toast-message';
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import socketServices from './src/socketIo/SocketServices';
import FastImage from 'react-native-fast-image';
import notifee from '@notifee/react-native';
import { Notifications } from 'react-native-notifications';
import { startBackgroundTask, stopBackgroundTask } from './src/halpers/BackgroundServices/BackgroundServices';


let focusRoute = '';

function App() {
  const [currentScreen, setcurrentScreen] = useState('splash');
  const [isInternet, setIsInternet] = useState(true);
  const navigationRef = createRef();
  const appState = useRef(AppState.currentState);

  const hideIfAndroid15 = () => {
    if (Platform.OS === 'android' && Platform.Version >= 35) {
      hideNavigationBar();
    }
  };

  // Clear all notifications from the notification drawer
  const onRemoveNotificationDrawer = async () => {
    Notifications.removeAllDeliveredNotifications();
    await notifee.cancelAllNotifications();
  }


  useEffect(() => {
    onRemoveNotificationDrawer()
    startBackgroundTask()
    const subscription = AppState.addEventListener("change", nextAppState => {
      // Prevent unnecessary calls if state hasn't changed
      if (appState.current === nextAppState) return;

      if (nextAppState === "background" || nextAppState === "inactive") {
        console.log("App went to background: stopping services");
        socketServices.removeAllListeners();
        socketServices.disconnectSocket();
        FastImage.clearMemoryCache();
        // // Start background task with delay
        // setTimeout(async () => {
        //   try {
        //     await startBackgroundTask();
        //     console.log("✅ Background task started successfully");
        //   } catch (error) {
        //     console.log("❌ Error starting background task:", error);
        //   }
        // }, 2000);

      }

      if (nextAppState === "active" && !socketServices.isSocketConnected()) {
        console.log("App became active: restarting services");
        socketServices.initailizeSocket();
        // // Stop background task with delay
        // setTimeout(async () => {
        //   try {
        //     await stopBackgroundTask();
        //     console.log("✅ Background task stopped successfully");
        //   } catch (error) {
        //     console.log("❌ Error stopping background task:", error);
        //   }
        // }, 2000);

        // restart any background tasks if needed
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      // Ensure cleanup
      stopBackgroundTask()
      socketServices.removeAllListeners();
      socketServices.disconnectSocket();
      // 
    };
  }, []);

  useEffect(() => {
    hideIfAndroid15();
    async function setAppStoarge() {
      await rootStore.commonStore.setAppUserFromStorage();
      await rootStore.commonStore.setTokenFromStorage();
    }

    setAppStoarge()

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state);
      console.log("Is connected?", state.isConnected);
      if (state.isInternetReachable != null) {
        setIsInternet(state.isInternetReachable);
        let action = state.isInternetReachable ? 'internet' : 'noInternet';
        DeviceEventEmitter.emit(focusRoute, action);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [])

  const getonTab = (screen) => {
    if (screen == "tab1" || screen == "tab2" || screen == "tab3" || screen == "tab4") {
      return false
    } else {
      return true
    }
  }


  return (
    <PaperProvider
      settings={{
        icon: props => <AwesomeIcon {...props} />,
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={() => {
            focusRoute = navigationRef.current.getCurrentRoute().name;
            setcurrentScreen(navigationRef.current.getCurrentRoute().name);
          }}
        >
          {/* <SafeAreaView
              style={{
                flex: 0,
                backgroundColor: setBarColor(currentScreen),
                opacity: 1,
              }}
            /> */}
          {/* <SafeAreaView
            style={{
              flex: 1,
              backgroundColor:
                currentScreen == 'splash'
                  ? colors.bottomBarColor
                  : colors.white
            }}>
            <StatusBar
              animated={true}
              backgroundColor={setBarColor(currentScreen)}
              barStyle={
                setStatusBar(currentScreen)
              }
            /> */}
          {/* <SafeAreaInsetsHandler currentScreen={currentScreen}> */}
          {!isInternet && getonTab(currentScreen) && <NoInternet currentScreen={currentScreen} onAppJs={true} />}
          <Root />
          {/* </SafeAreaInsetsHandler> */}
          {/* </SafeAreaView> */}
        </NavigationContainer>
        <Toast />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

// Helper component to handle safe area insets
function SafeAreaInsetsHandler({ children, currentScreen }) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: setBarColor(currentScreen),
          opacity: 1,
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            currentScreen == 'splash'
              ? colors.bottomBarColor
              // : colors.appBackground,
              : Platform.OS == 'ios' ? colors.white :
                (Platform.OS === 'android' && Platform.Version >= 35) ?
                  colors.appBackground : colors.white,
          paddingTop: insets.top,
          paddingBottom: insets.bottom
        }}>
        <StatusBar
          animated={true}
          translucent={true}
          backgroundColor={setBarColor(currentScreen)}
          barStyle={setStatusBar(currentScreen)}
        />
        {children}
      </SafeAreaView>
    </>
  );
}


export default App;
