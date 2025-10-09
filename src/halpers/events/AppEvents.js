import analytics from '@react-native-firebase/analytics';
import { Alert } from 'react-native';

export const AppEvents = async ({
    eventName = '',
    payload = {}
}) => {
    try {
        await analytics().logEvent(eventName, payload)
        console.log('Event capture done');

    } catch (error) {
        console.log('Event not capture', error)
        // Alert.alert('Event not capture')
    }


}