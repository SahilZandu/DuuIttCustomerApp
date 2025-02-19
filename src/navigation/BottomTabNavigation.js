import React, {useState} from 'react';
import {View, Platform, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {bottomTabIcons} from '../commons/AppImages';
import {colors} from '../theme/colors';
import Home from '../screens/Auth/DashboardScreen/Home/Home';
import Promo from '../screens/Auth/DashboardScreen/Promo/Promo';
import Orders from '../screens/Auth/DashboardScreen/Orders/Orders';
import SideMenu from '../screens/Auth/DashboardScreen/SideMenu/SideMenu';
import ParcelHome from '../screens/DUParcel/ParcelHome/ParcelHome';
import Offers from '../screens/Auth/DashboardScreen/Offers/Offers';
import RideHome from '../screens/DURide/RideHome/RideHome';
import FoodHome from '../screens/DUFood/FoodHome/FoodHome';
import ResturantMenuProducts from '../screens/DUFood/Restaurent/ResturantMenuProducts';
 
import MyAddress from '../screens/CommonScreens/MyAddress/MyAddress';

const Tab = createBottomTabNavigator();

export function DashboardBottomNavigator() {
  const [update, setUpdate] = useState(true);

  const handleAnimation = () => {
    setUpdate(false);
    setTimeout(() => {
      setUpdate(true);
    }, 200);
  };

  return (
    <Tab.Navigator
      initialRouteName="tab1"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused}) => {
          let iconName;
          switch (route.name) {
            case 'tab1':
              iconName = focused
                ? bottomTabIcons.focusHomeIcon
                : bottomTabIcons.homeIcom;
              break;
            case 'tab2':
              iconName = focused
                ? bottomTabIcons.focusExploreIcon
                : bottomTabIcons.exploreIcon;
              break;
            case 'tab3':
              iconName = focused
                ? bottomTabIcons.focusOrderIcon
                : bottomTabIcons.orderIcon;
              break;
            case 'tab4':
              iconName = focused
                ? bottomTabIcons.focusProfileIcon
                : bottomTabIcons.profileIcon;
              break;
            default:
              iconName = focused
                ? bottomTabIcons.focusHomeIcon
                : bottomTabIcons.homeIcom;
          }
          return (
            <View style={styles.iconContainer}>
              <SvgXml xml={iconName} />
            </View>
          );
        },
        tabBarLabel: ({focused, color}) => {
          let label;
          switch (route.name) {
            case 'tab1':
              label = 'Home';
              break;
            case 'tab2':
              label = 'Explore';
              break;
            case 'tab3':
              label = 'Orders';
              break;
            case 'tab4':
              label = 'Profile';
              break;
            default:
              label = 'Home';
          }

          return (
            <View
              style={{
                // marginTop:hp('-4%'),
                justifyContent: 'center',
                alignItems: 'center',
                bottom: hp('0.8%'),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: focused ? colors.main : colors.colorAF,
                  fontSize: RFValue(11),
                  fontWeight: focused ? '600' : '500',
                  textTransform: 'uppercase',
                }}>
                {label}
              </Text>
            </View>
          );
        },

        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.colorAF,
        tabBarShowLabel: true,
        keyboardHidesTabBar: true,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        // tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
      })}>
      <Tab.Screen
        name="tab1"
        component={Home}
        // options={{tabBarLabel: 'Home'}}
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab2"
        component={Offers}
        // options={{tabBarLabel: 'Promo'}}
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab3"
        component={Orders}
        // options={{tabBarLabel: 'Orders'}}
        // listeners={{tabPress: handleAnimation}}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            handleAnimation();
            navigation.navigate('tab3', { tabText: 'All Orders' }); // Force re-render with new params
          },
          })}
        initialParams={{tabText:'All Orders'}} // Pass initial params
      />
      <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{tabPress: handleAnimation}}
      />
    </Tab.Navigator>
  );
}

export function RideBottomNavigator() {
  const [update, setUpdate] = useState(true);

  const handleAnimation = () => {
    setUpdate(false);
    setTimeout(() => {
      setUpdate(true);
    }, 200);
  };

  return (
    <Tab.Navigator
      initialRouteName="tab1"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused}) => {
          let iconName;
          switch (route.name) {
            case 'tab1':
              iconName = focused
                ? bottomTabIcons.focusRideIcon
                : bottomTabIcons.rideIcon;
              break;
            // case 'tab2':
            //   iconName = focused
            //     ? bottomTabIcons.focusActivityIcon
            //     : bottomTabIcons.activityIcon;
            //   break;
            case 'tab2':
              iconName = focused
                ? bottomTabIcons.focusAddresIcon
                : bottomTabIcons.addressIcon;
              break;
            // case 'tab4':
            //     iconName = focused
            //     ? bottomTabIcons.focusProfileIcon
            //     : bottomTabIcons.profileIcon;
            //   break;
            default:
              iconName = focused
                ? bottomTabIcons.focusRideIcon
                : bottomTabIcons.rideIcon;
          }
          return (
            <View style={styles.iconContainer}>
              <SvgXml xml={iconName} />
            </View>
          );
        },
        tabBarLabel: ({focused, color}) => {
          let label;
          switch (route.name) {
            case 'tab1':
              label = 'Ride';
              break;
            // case 'tab2':
            //   label = 'Activity';
            //   break;
            case 'tab2':
              label = 'Address';
              break;
            // case 'tab4':
            //   label = 'Profile';
            //   break;
            default:
              label = 'Home';
          }

          return (
            <View
              style={{
                // marginTop:'-5%',
                justifyContent: 'center',
                alignItems: 'center',
                bottom: hp('0.8%'),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: focused ? colors.main : colors.colorAF,
                  fontSize: RFValue(11),
                  fontWeight: focused ? '600' : '500',
                  textTransform: 'uppercase',
                }}>
                {label}
              </Text>
            </View>
          );
        },

        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.colorAF,
        tabBarShowLabel: true,
        keyboardHidesTabBar: true,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        // tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
      })}>
      <Tab.Screen
        name="tab1"
        component={RideHome}
        // options={{tabBarLabel: 'Home'}}
        listeners={{tabPress: handleAnimation}}
      />
      {/* <Tab.Screen
        name="tab2"
        component={Promo}
        // options={{tabBarLabel: 'Promo'}}
        listeners={{tabPress: handleAnimation}}
      /> */}
      <Tab.Screen
        name="tab2"
        component={MyAddress}
        // options={{tabBarLabel: 'Orders'}}
        listeners={{tabPress: handleAnimation}}
        initialParams={{screenName: 'ride'}} // Pass initial params
      />
      {/* <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{tabPress: handleAnimation}}
      /> */}
    </Tab.Navigator>
  );
}

export function FoodBottomNavigator() {
  const [update, setUpdate] = useState(true);

  const handleAnimation = () => {
    setUpdate(false);
    setTimeout(() => {
      setUpdate(true);
    }, 200);
  };

  return (
    <Tab.Navigator
      initialRouteName="tab1"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused}) => {
          let iconName;
          switch (route.name) {
            case 'tab1':
              iconName = focused
                ? bottomTabIcons.focusFoodIcon
                : bottomTabIcons.foodIcon;
              break;
            // case 'tab2':
            //     iconName = focused
            //     ? bottomTabIcons.focusOrderIcon
            //     : bottomTabIcons.orderIcon;
            //   break;
            case 'tab2':
              iconName = focused
                ? bottomTabIcons.focusAddresIcon
                : bottomTabIcons.addressIcon;
              break;
            // case 'tab4':
            //     iconName = focused
            //     ? bottomTabIcons.focusProfileIcon
            //     : bottomTabIcons.profileIcon;
            //   break;
            default:
              iconName = focused
                ? bottomTabIcons.focusOrderIcon
                : bottomTabIcons.foodIcon;
          }
          return (
            <View style={styles.iconContainer}>
              <SvgXml xml={iconName} />
            </View>
          );
        },
        tabBarLabel: ({focused, color}) => {
          let label;
          switch (route.name) {
            case 'tab1':
              label = 'Food';
              break;
            // case 'tab1':
            //   label = 'resturantProducts';
            //   break;
              
            // case 'tab2':
            //   label = 'Orders';
            //   break;
            case 'tab2':
              label = 'Address';
              break;
            // case 'tab4':
            //   label = 'Profile';
            //   break;
            default:
              label = 'Home';
          }

          return (
            <View
              style={{
                // marginTop:'-5%',
                justifyContent: 'center',
                alignItems: 'center',
                bottom: hp('0.8%'),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: focused ? colors.main : colors.colorAF,
                  fontSize: RFValue(11),
                  fontWeight: focused ? '600' : '500',
                  textTransform: 'uppercase',
                }}>
                {label}
              </Text>
            </View>
          );
        },

        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.colorAF,
        tabBarShowLabel: true,
        keyboardHidesTabBar: true,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        // tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
      })}>
      <Tab.Screen
        name="tab1"
        component={FoodHome}
        // component={ResturantMenuProducts}
        // options={{tabBarLabel: 'Home'}}
        listeners={{tabPress: handleAnimation}}
      />
      {/* <Tab.Screen
        name="tab2"
        component={Orders}
        // options={{tabBarLabel: 'Promo'}}
        listeners={{tabPress: handleAnimation}}
      /> */}
      <Tab.Screen
        name="tab2"
        component={MyAddress}
        // options={{tabBarLabel: 'Orders'}}
        listeners={{tabPress: handleAnimation}}
        initialParams={{screenName: 'food'}} // Pass initial params
      />
      {/* <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{tabPress: handleAnimation}}
      /> */}
    </Tab.Navigator>
  );
}

export function ParcelBottomNavigator() {
  const [update, setUpdate] = useState(true);

  const handleAnimation = () => {
    setUpdate(false);
    setTimeout(() => {
      setUpdate(true);
    }, 200);
  };

  return (
    <Tab.Navigator
      initialRouteName="tab1"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused}) => {
          let iconName;
          switch (route.name) {
            case 'tab1':
              iconName = focused
                ? bottomTabIcons.focusParcelIcon
                : bottomTabIcons.parcelIcon;
              break;
            // case 'tab2':
            //   iconName = focused
            //   ? bottomTabIcons.focusOrderIcon
            //   : bottomTabIcons.orderIcon;
            //   break;
            case 'tab2':
              iconName = focused
                ? bottomTabIcons.focusAddresIcon
                : bottomTabIcons.addressIcon;
              break;
            // case 'tab4':
            //     iconName = focused
            //     ? bottomTabIcons.focusProfileIcon
            //     : bottomTabIcons.profileIcon;
            //   break;
            default:
              iconName = focused
                ? bottomTabIcons.focusParcelIcon
                : bottomTabIcons.parcelIcon;
          }
          return (
            <View style={styles.iconContainer}>
              <SvgXml xml={iconName} />
            </View>
          );
        },
        tabBarLabel: ({focused, color}) => {
          let label;
          switch (route.name) {
            case 'tab1':
              label = 'Parcel';
              break;
            // case 'tab2':
            //   label = 'Orders';
            //   break;
            case 'tab2':
              label = 'Address';
              break;
            // case 'tab4':
            //   label = 'Profile';
            //   break;
            default:
              label = 'Home';
          }

          return (
            <View
              style={{
                // marginTop:'-5%',
                justifyContent: 'center',
                alignItems: 'center',
                bottom: hp('0.8%'),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: focused ? colors.main : colors.colorAF,
                  fontSize: RFValue(11),
                  fontWeight: focused ? '600' : '500',
                  textTransform: 'uppercase',
                }}>
                {label}
              </Text>
            </View>
          );
        },

        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.colorAF,
        tabBarShowLabel: true,
        keyboardHidesTabBar: true,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        // tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
      })}>
      <Tab.Screen
        name="tab1"
        component={ParcelHome}
        // options={{tabBarLabel: 'Home'}}
        listeners={{tabPress: handleAnimation}}
      />
      {/* <Tab.Screen
        name="tab2"
        component={Orders}
        // options={{tabBarLabel: 'Orders'}}
        listeners={{tabPress: handleAnimation}}
      /> */}
      <Tab.Screen
        name="tab2"
        component={MyAddress}
        // options={{tabBarLabel: 'MyAddress'}}
        listeners={{tabPress: handleAnimation}}
        initialParams={{screenName: 'parcel'}} // Pass initial params
      />
      {/* <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{tabPress: handleAnimation}}
      /> */}
    </Tab.Navigator>
  );
}

const styles = {
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: hp('-1%'),
    // paddingBottom: '0%',
  },
  //   tabBarLabelStyle:{
  //     fontSize: RFValue(11),
  //     fontFamily: fonts.bold,
  //     letterSpacing: 0.80,
  //     textTransform: 'capitalize',
  //     bottom: '17%',
  //   },
  tabBarStyle: {
    position:'absolute',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingVertical: '2%',
    height: hp('7.5%'),
    backgroundColor: colors.white, // Make the background transparent
    borderTopWidth: 0,
    paddingBottom: 0,
    shadowColor:
      Platform.OS === 'android' ? colors.black : 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 20,
    // marginBottom:'3%'
  },
};
