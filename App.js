import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import Root from './src/navigation/Root';
import {PaperProvider} from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {setBarColor, setStatusBar} from './src/halpers/SetStatusBarColor'
import { colors } from './src/theme/colors';
import { NotifierWrapper } from 'react-native-notifier';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from './src/components/NoInternet';
import { rootStore } from './src/stores/rootStore';


let focusRoute = '';

function App() {
  const [currentScreen, setcurrentScreen] = useState('splash');
  const [isInternet, setIsInternet] = useState(true);
  const navigationRef = React.createRef();

  useEffect(()=>{
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
  },[])

  const getonTab = (screen) => {
    if(screen == "tab1" || screen == "tab2" ||screen == "tab3"||screen == "tab4"){
      return false
    }else{
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
      <NotifierWrapper >
        <NavigationContainer
          ref={navigationRef}
          onStateChange={() => {
            focusRoute = navigationRef.current.getCurrentRoute().name;
            setcurrentScreen(navigationRef.current.getCurrentRoute().name);
          }}>
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
                  : colors.white
            }}>
            <StatusBar
              animated={true}
              backgroundColor={setBarColor(currentScreen)}
              barStyle={
                setStatusBar(currentScreen)
              }
            />
               {!isInternet && getonTab(currentScreen) && <NoInternet currentScreen={currentScreen} onAppJs={true} />}
            <Root />
          </SafeAreaView>
        </NavigationContainer>
      </NotifierWrapper>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

export default App;
