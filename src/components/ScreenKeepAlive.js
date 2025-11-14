import KeepAwake from 'react-native-keep-awake';

/**
 * Enable KeepAwake when tracking starts
 */
export const startKeepAwakeScreen = () => {
    try {
        KeepAwake.activate();
        console.log("📍 KeepAwake Activated (tracking started)");
    } catch (error) {
        console.log("❌ Error activating KeepAwake:", error);
    }
};

/**
 * Disable KeepAwake when tracking stops
 */
export const stopKeepAwakeScreen = () => {
    try {
        KeepAwake.deactivate();
        console.log("📍 KeepAwake Deactivated (tracking stopped)");
    } catch (error) {
        console.log("❌ Error deactivating KeepAwake:", error);
    }
};
