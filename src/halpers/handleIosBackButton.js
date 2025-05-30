// import { useFocusEffect } from '@react-navigation/native';
// import { Alert, AppState } from 'react-native';
// import RNRestart from 'react-native-restart';
// import { useCallback } from 'react';

// function handleIosBackButton(navigation, tab) {
//     const { addParcelInfo, setAddParcelInfo } = rootStore.parcelStore;
//     const { updateOrderStatus } = rootStore.orderStore;

//     const deleteIncompleteOrder = async (data) => {
//         const parcelId = data?._id;
//         if (data?.status === 'pending') {
//             await updateOrderStatus(
//                 parcelId,
//                 'deleted',
//                 handleDeleteLoading,
//                 onDeleteSuccess,
//                 false,
//             );
//         }
//     };

//     const handleDeleteLoading = () => {
//         console.log('Deleting order...');
//     };

//     const onDeleteSuccess = () => {
//         console.log('onDeleteSuccess...');
//         setAddParcelInfo({});
//         setTimeout(() => {
//             RNRestart.restart(); // Relaunch the app
//         }, 200);
//     };

//     useFocusEffect(
//         useCallback(() => {
//             const unsubscribe = AppState.addEventListener('change', state => {
//                 if (state === 'active') {
//                     console.log('App is in foreground');
//                     if (tab && tab !== "All Orders") {
//                         navigation.navigate('tab4');
//                         return;
//                     }
//                     else if (navigation) {
//                         navigation.goBack();
//                     }
//                 }
//                 else if (state === 'background') {
//                     console.log('App is in background');
//                 }
//                 else if (state === 'inactive') {
//                     console.log('App is inactive');
//                     if (addParcelInfo?._id?.length > 0) {
//                         deleteIncompleteOrder(addParcelInfo);
//                     }
//                 }
//             });
//             return () => unsubscribe.remove();

//         }, [navigation, tab, addParcelInfo])
//     );
// }

// export default handleIosBackButton;





import { useFocusEffect } from '@react-navigation/native';
import { AppState } from 'react-native';
import { useCallback, useRef } from 'react';
import RNRestart from 'react-native-restart';
import { rootStore } from './path-to-root-store'; // adjust path

function handleIosBackButton(navigation, tab) {
  const appState = useRef(AppState.currentState);
  const { addParcelInfo, setAddParcelInfo } = rootStore.parcelStore;
  const { updateOrderStatus } = rootStore.orderStore;

  const deleteIncompleteOrder = async (data) => {
    const parcelId = data?._id;
    if (data?.status === 'pending') {
      await updateOrderStatus(
        parcelId,
        'deleted',
        () => console.log('Deleting order...'),
        () => {
          console.log('onDeleteSuccess...');
          setAddParcelInfo({});
          setTimeout(() => RNRestart.restart(), 200);
        },
        false
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
          if (tab && tab !== "All Orders") {
            navigation.navigate('tab4');
          } else if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }

        if (nextAppState === 'inactive') {
          console.log('App is inactive');
          if (addParcelInfo?._id?.length > 0) {
            deleteIncompleteOrder(addParcelInfo);
          }
        }

        appState.current = nextAppState;
      });

      return () => subscription.remove();
    }, [navigation, tab, addParcelInfo?._id])
  );
}

export default handleIosBackButton;
