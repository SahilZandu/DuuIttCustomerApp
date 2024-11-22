import React, {useState} from 'react';
import {View,Platform,Text } from 'react-native';
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
import MyAddress from '../screens/DUParcel/MyAddress/MyAddress';
import Offers from '../screens/Auth/DashboardScreen/Offers/Offers';


const Tab = createBottomTabNavigator();

export function DashboardBottomNavigator  () {
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
                ? bottomTabIcons.focusPromoIcon
                : bottomTabIcons.promoIcon;
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
              <SvgXml
                xml={iconName}
              />
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
              label = 'Offers';
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
            <View style={{
                marginTop:'-5%',
                justifyContent:'center',
                alignItems:'center'
                }}>
            <Text style={{
                textAlign:'center',
                color: focused ? colors.main : colors.colorAF,
               fontSize:RFValue(11),
              fontWeight:focused ? '600' :'500',
              textTransform:'uppercase',
            }}
             >
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
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{tabPress: handleAnimation}}
      />

    </Tab.Navigator>
  );
};


export function RideBottomNavigator  () {
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
            case 'tab2':
              iconName = focused
                ? bottomTabIcons.focusActivityIcon
                : bottomTabIcons.activityIcon;
              break;
            case 'tab3':
                iconName = focused
                ? bottomTabIcons.focusAddresIcon
                : bottomTabIcons.addressIcon;
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
              <SvgXml
                xml={iconName}
              />
            </View>
          );
        },
        tabBarLabel: ({focused, color}) => {
          let label;
          switch (route.name) {
            case 'tab1':
              label = 'Ride';
              break;
            case 'tab2':
              label = 'Activity';
              break;
            case 'tab3':
              label = 'Address';
              break;
            case 'tab4':
              label = 'Profile';
              break;
            default:
              label = 'Home';
          }

          return (
            <View style={{
                marginTop:'-5%',
                justifyContent:'center',
                alignItems:'center'
                }}>
            <Text style={{
                textAlign:'center',
                color: focused ? colors.main : colors.colorAF,
               fontSize:RFValue(11),
              fontWeight:focused ? '600' :'500',
              textTransform:'uppercase',
            }}
             >
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
        component={Promo}
        // options={{tabBarLabel: 'Promo'}}
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab3"
        component={Orders}
        // options={{tabBarLabel: 'Orders'}}
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{tabPress: handleAnimation}}
      />

    </Tab.Navigator>
  );
};

export function FoodBottomNavigator  () {
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
            case 'tab2':
                iconName = focused
                ? bottomTabIcons.focusOrderIcon
                : bottomTabIcons.orderIcon;
              break;
              case 'tab3':
                iconName = focused
                  ? bottomTabIcons.focusAddresIcon
                  : bottomTabIcons.addressIcon;
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
              <SvgXml
                xml={iconName}
              />
            </View>
          );
        },
        tabBarLabel: ({focused, color}) => {
          let label;
          switch (route.name) {
            case 'tab1':
              label = 'Food';
              break;
            case 'tab2':
              label = 'Orders';
              break;
            case 'tab3':
              label = 'Address';
              break;
            case 'tab4':
              label = 'Profile';
              break;
            default:
              label = 'Home';
          }

          return (
            <View style={{
                marginTop:'-5%',
                justifyContent:'center',
                alignItems:'center'
                }}>
            <Text style={{
                textAlign:'center',
                color: focused ? colors.main : colors.colorAF,
               fontSize:RFValue(11),
              fontWeight:focused ? '600' :'500',
              textTransform:'uppercase',
            }}
             >
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
        component={Orders}
        // options={{tabBarLabel: 'Promo'}}
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab3"
        component={Promo}
        // options={{tabBarLabel: 'Orders'}}
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{tabPress: handleAnimation}}
      />

    </Tab.Navigator>
  );
};

export function ParcelBottomNavigator  () {
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
            case 'tab2':
              iconName = focused
              ? bottomTabIcons.focusOrderIcon
              : bottomTabIcons.orderIcon;
              break;
            case 'tab3':
                iconName = focused
                ? bottomTabIcons.focusAddresIcon
                : bottomTabIcons.addressIcon;
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
              <SvgXml
                xml={iconName}
              />
            </View>
          );
        },
        tabBarLabel: ({focused, color}) => {
          let label;
          switch (route.name) {
            case 'tab1':
              label = 'Parcel';
              break;
            case 'tab2':
              label = 'Orders';
              break;
            case 'tab3':
              label = 'Address';
              break;
            case 'tab4':
              label = 'Profile';
              break;
            default:
              label = 'Home';
          }

          return (
            <View style={{
                marginTop:'-5%',
                justifyContent:'center',
                alignItems:'center'
                }}>
            <Text style={{
                textAlign:'center',
                color: focused ? colors.main : colors.colorAF,
               fontSize:RFValue(11),
              fontWeight:focused ? '600' :'500',
              textTransform:'uppercase',
            }}
             >
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
      <Tab.Screen
        name="tab2"
        component={Orders}
        // options={{tabBarLabel: 'Orders'}}
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab3"
        component={MyAddress}
        // options={{tabBarLabel: 'MyAddress'}}
        listeners={{tabPress: handleAnimation}}
      />
      <Tab.Screen
        name="tab4"
        component={SideMenu}
        // options={{tabBarLabel: 'Profile'}}
        listeners={{tabPress: handleAnimation}}
      />

    </Tab.Navigator>
  );
};




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
    borderTopRightRadius:15,
    borderTopLeftRadius:15,
    paddingVertical: '2%',
    height: hp('7%'),
    backgroundColor:colors.white, // Make the background transparent
    borderTopWidth:0,
    paddingBottom: 0,
    shadowColor: Platform.OS === 'android' ? 'black' : 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 20,
    
  },
};





