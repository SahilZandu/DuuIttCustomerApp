import AsyncStorage from '@react-native-async-storage/async-storage'
import {action, computed, decorate, observable, runInAction,makeAutoObservable} from 'mobx';

export default class CommonStore {
  constructor() {
    this.setTokenFromStorage();
    this.setAppUserFromStorage();
  }

  get token() {
    if (!this.internalToken) this.setTokenFromStorage();
    return this.internalToken;
  }

  get appUser() {
    if (!this.internalAppUser) this.setAppUserFromStorage();
    return this.internalAppUser;
  }

  setAppUserFromStorage() {
    try {
      AsyncStorage.getItem('appUser').then(value => {
        // console.log("value appUser",JSON.parse(value))
        runInAction(() => {
          this.internalAppUser = JSON.parse(value);
        });
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  setTokenFromStorage() {
    try {
      AsyncStorage.getItem('jwt').then(value => {
        // console.log("value jwt",value)
        runInAction(() => {
          this.internalToken = value;
        });
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  setToken = token => {
    this.internalToken = token;
    if (token) {
      (async () => await AsyncStorage.setItem('jwt', token))();
    } else {
      (async () => await AsyncStorage.removeItem('jwt'))();
    }
  };

  setAppUser = async appUser => {
    this.internalAppUser = appUser;
    if (appUser) {
       (async () => await AsyncStorage.setItem('appUser', JSON.stringify(appUser)))();
    } else {
      (async () => await AsyncStorage.removeItem('appUser'))();
    }
  };
}
