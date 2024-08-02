import {Notifier, NotifierComponents} from 'react-native-notifier';

export function useToast(message, type) {

      const types = ['error','success','info','warn']

  Notifier.showNotification({
    title: '',
    description: message,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: types[type] ,
    },
  });
}
