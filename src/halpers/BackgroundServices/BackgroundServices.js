// import BackgroundService from 'react-native-background-actions';

// const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

// const veryIntensiveTask = async (taskDataArguments) => {
//     const { delay } = taskDataArguments;
//     while (BackgroundService.isRunning()) {
//         console.log('Background service running...');
//         const newDesc = `Tracking update at ${new Date().toLocaleTimeString()}`;
//         await BackgroundService.updateNotification({ taskDesc: newDesc });
//         // 👉 Your background code here, e.g. hit an API or track location
//         await sleep(delay);
//     }
// };

// const options = {
//     taskName: 'DuuItt Tracking',
//     taskTitle: 'DuuItt is tracking your location',
//     taskDesc: 'Live tracking is active in background.',
//     // taskIcon: {
//     //     name: 'ic_launcher',
//     //     type: 'mipmap',
//     // },
//     color: '#ff00ff',
//     linkingURI: 'yourapp://home',
//     parameters: {
//         delay: 60000, // 1 minute
//     },
// };

// export const startBackgroundTask = async () => {
//     await BackgroundService.start(veryIntensiveTask, options);
// };

// export const stopBackgroundTask = async () => {
//     await BackgroundService.stop();
// };



import BackgroundService from 'react-native-background-actions';
import { Platform } from 'react-native';
import { colors } from '../../theme/colors';


const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    try {
        while (BackgroundService.isRunning()) {
            try {
                console.log('Background service running...');
                // const newDesc = `Tracking update at ${new Date().toLocaleTimeString()}`;
                // await BackgroundService.updateNotification({ taskDesc: newDesc });
                // 👉 Your background code here, e.g. hit an API or track location
            } catch (updateError) {
                console.log('⚠️ Error updating notification:', updateError);
                // Continue running even if notification update fails
            }
            await sleep(delay);
        }
    } catch (error) {
        console.log('❌ Background task error:', error);
    }
};

// Create options with drawable icon (ic_stat_notification exists in drawable folder)
const createOptions = (useIcon = true) => {
    const options = {
        taskName: 'DuuItt Tracking',
        taskTitle: 'DuuItt is tracking your location',
        taskDesc: 'Live tracking is active in background.',
        color: colors.green,
        linkingURI: 'duuittapp // open',
        parameters: {
            delay: 60000, // 1 minute
        },
    };

    // Use drawable icon if requested (ic_notification.png exists)
    if (useIcon) {
        options.taskIcon = {
            // name: 'ic_notification',
            // type: 'drawable', // Use drawable instead of mipmap
            name: 'ic_launcher',
            type: 'mipmap', // Use drawable instead of mipmap
        };
    }

    return options;
};

export const startBackgroundTask = async () => {
    try {
        // Check if platform supports background actions
        if (Platform.OS !== 'android') {
            console.log('⚠️ Background service only supported on Android');
            return;
        }

        // Wait a bit to ensure app is fully initialized
        await sleep(1000);

        const isRunning = await BackgroundService.isRunning();
        if (isRunning) {
            console.log('⚠️ Background task already running');
            return;
        }

        // Try with drawable icon first (ic_stat_notification exists)
        let options = createOptions(true);
        try {
            await BackgroundService.start(veryIntensiveTask, options);
            console.log('✅ Background task started successfully');
        } catch (iconError) {
            // If icon error, try without icon
            if (iconError.message && (iconError.message.includes('icon') || iconError.message.includes('Icon'))) {
                console.log('⚠️ Icon error detected, trying without icon...');
                options = createOptions(false);
                try {
                    await BackgroundService.start(veryIntensiveTask, options);
                    console.log('✅ Background task started successfully (without icon)');
                } catch (retryError) {
                    console.log('❌ Error starting background task (retry):', retryError.message || retryError);
                    console.log('⚠️ Background service will not be available');
                }
            } else {
                console.log('❌ Error starting background task:', iconError.message || iconError);
                console.log('⚠️ Background service will not be available');
            }
        }
    } catch (error) {
        console.log('❌ Error starting background task:', error.message || error);
        // Don't throw - just log the error so app doesn't crash
        console.log('⚠️ Background service will not be available');
    }
};

export const stopBackgroundTask = async () => {
    try {
        if (Platform.OS !== 'android') {
            return;
        }

        const isRunning = await BackgroundService.isRunning();
        if (isRunning) {
            await BackgroundService.stop();
            console.log('✅ Background task stopped successfully');
        } else {
            console.log('⚠️ Background task was not running');
        }
    } catch (error) {
        console.log('❌ Error stopping background task:', error.message || error);
        // Don't throw - just log the error so app doesn't crash
    }
};
