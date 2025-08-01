import React, { useCallback, useEffect, useState } from 'react';
import { View, Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { bottomTabIcons } from '../commons/AppImages';
import { colors } from '../theme/colors';
import Home from '../screens/Auth/DashboardScreen/Home/Home';
import Promo from '../screens/Auth/DashboardScreen/Promo/Promo';
import Orders from '../screens/Auth/DashboardScreen/Orders/Orders';
import SideMenu from '../screens/Auth/DashboardScreen/SideMenu/SideMenu';
import ParcelHome from '../screens/DUParcel/ParcelHome/ParcelHome';
import Offers from '../screens/Auth/DashboardScreen/Offers/Offers';
import RideHome from '../screens/DURide/RideHome/RideHome';
import FoodHome from '../screens/DUFood/FoodHome/FoodHome';
import ResturantMenuProducts from '../screens/DUFood/Restaurent/ResturantMenuProducts';
import * as Animatable from 'react-native-animatable';


import MyAddress from '../screens/CommonScreens/MyAddress/MyAddress';
import { rootStore } from '../stores/rootStore';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export function DashboardBottomNavigator() {
  const {
    orderTrackingList,
    parcelOrderInProgress,
    rideOrderInProgress,
  } = rootStore.orderStore;
  const { cartItemData } = rootStore.cartStore;
  const {
    foodOrderTrackingList,
  } = rootStore.foodDashboardStore;
  const [update, setUpdate] = useState(true);
  const [parcelOrdTrack, setParcelOrdTrack] = useState(orderTrackingList)
  const [parcelOrdInProgess, setParcelOrdInProgess] = useState(parcelOrderInProgress)
  const [rideOrdInProgess, setRideOrdInProgess] = useState(rideOrderInProgress)
  const [foodCartList, setFoodCartList] = useState(cartItemData);
  const [foodTrackingOrder, setFoodTackingOrder] = useState(foodOrderTrackingList)


  const handleAnimation = () => {
    setUpdate(false);
    setTimeout(() => {
      setUpdate(true);
    }, 100);
  };

  useFocusEffect(
    useCallback(() => {
      const {
        orderTrackingList,
        parcelOrderInProgress,
        rideOrderInProgress,
      } = rootStore.orderStore;
      const { cartItemData } = rootStore.cartStore;
      const {
        foodOrderTrackingList,
      } = rootStore.foodDashboardStore;
      setParcelOrdTrack(orderTrackingList)
      setParcelOrdInProgess(parcelOrderInProgress)
      setRideOrdInProgess(rideOrderInProgress)
      setFoodCartList(cartItemData)
      setFoodTackingOrder(foodOrderTrackingList)
    }, [orderTrackingList, parcelOrderInProgress, rideOrderInProgress, foodOrderTrackingList, cartItemData])
  )

  return (
    <Tab.Navigator
      initialRouteName="tab1"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
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
              {focused && update == true && (
                <Animatable.View
                  style={styles.animatedView}
                  duration={800}
                  animation={'pulse'}
                  iterationCount={1}>

                </Animatable.View>
              )}
              <SvgXml
                // height={20} width={20} 
                xml={iconName} />
              {(route.name == "tab1" &&
                (parcelOrdTrack?.length > 0 ||
                  parcelOrdInProgess?.length > 0 ||
                  foodCartList?.cart_items?.length > 0 ||
                  foodTrackingOrder?.length > 0 ||
                  rideOrdInProgess?.length > 0)) &&
                <View style={{
                  position: 'absolute',
                  top: hp('2.7%'),
                  right: wp('7.5%'),
                  height: 8, width: 8,
                  backgroundColor: 'red',
                  borderRadius: 100
                }} />}
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
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
                bottom: hp('1.7%'),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: focused ? colors.main : colors.colorAF,
                  fontSize: RFValue(7.5),
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
        listeners={{ tabPress: handleAnimation }}
      />
      <Tab.Screen
        name="tab2"
        component={Offers}
        // options={{tabBarLabel: 'Promo'}}
        listeners={{ tabPress: handleAnimation }}
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
        initialParams={{ tabText: 'All Orders' }} // Pass initial params
      />
      <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{ tabPress: handleAnimation }}
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
    }, 100);
  };

  return (
    <Tab.Navigator
      initialRouteName="tab1"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
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
              {focused && update == true && (
                <Animatable.View
                  style={styles.animatedView}
                  duration={800}
                  animation={'pulse'}
                  iterationCount={1}></Animatable.View>
              )}
              <SvgXml xml={iconName} />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
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
                bottom: hp('1.3%'),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: focused ? colors.main : colors.colorAF,
                  fontSize: RFValue(9),
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
        listeners={{ tabPress: handleAnimation }}
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
        listeners={{ tabPress: handleAnimation }}
        initialParams={{ screenName: 'ride' }} // Pass initial params
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
    }, 100);
  };

  return (
    <Tab.Navigator
      initialRouteName="tab1"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
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
              {focused && update == true && (
                <Animatable.View
                  style={styles.animatedView}
                  duration={800}
                  animation={'pulse'}
                  iterationCount={1}></Animatable.View>
              )}
              <SvgXml xml={iconName} />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
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
                bottom: hp('1.3%'),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: focused ? colors.main : colors.colorAF,
                  fontSize: RFValue(9),
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
        listeners={{ tabPress: handleAnimation }}
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
        listeners={{ tabPress: handleAnimation }}
        initialParams={{ screenName: 'food' }} // Pass initial params
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
    }, 100);
  };

  return (
    <Tab.Navigator
      initialRouteName="tab1"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
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
              {focused && update == true && (
                <Animatable.View
                  style={styles.animatedView}
                  duration={800}
                  // animation={'fadeIn'}
                  animation={'pulse'}
                  iterationCount={1}></Animatable.View>
              )}
              <SvgXml xml={iconName} />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
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
                bottom: hp('1.3%'),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: focused ? colors.main : colors.colorAF,
                  fontSize: RFValue(9),
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
        listeners={{ tabPress: handleAnimation }}
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
        listeners={{ tabPress: handleAnimation }}
        initialParams={{ screenName: 'parcel' }} // Pass initial params
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
  animatedView: {
    height: hp('0.8%'),
    backgroundColor: colors.main,
    width: wp('20%'),
    position: 'absolute',
    // top: '10%',
    top: '11%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: hp('-1.5%'),
    width: wp('20%'),
    borderTopWidth: Platform.OS == 'android' ? 0.1 : 0.1,
    height: hp('8%'),
  },

  // iconContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: 'transparent',
  //   marginTop: hp('-1%'),
  //   // paddingBottom: '0%',
  // },
  //   tabBarLabelStyle:{
  //     fontSize: RFValue(11),
  //     fontFamily: fonts.bold,
  //     letterSpacing: 0.80,
  //     textTransform: 'capitalize',
  //     bottom: '17%',
  //   },
  tabBarStyle: {
    position: 'absolute',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingVertical: '2%',
    height: hp('8%'),
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
