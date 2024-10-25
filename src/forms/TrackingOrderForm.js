import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {Surface} from 'react-native-paper';
import {colors} from '../theme/colors';
import {appImages, appImagesSvg} from '../commons/AppImages';
import Svg, {SvgXml} from 'react-native-svg';
import DriverTrackingProfileComp from '../components/DriverTrackingProfileComp';
import DriverTrackingComp from '../components/DriverTrackingComp';
import TextRender from '../components/TextRender';
import {currencyFormat} from '../halpers/currencyFormat';
import {FlatList} from 'react-native-gesture-handler';
import {rootStore} from '../stores/rootStore';
import Url from '../api/Url';
import TrackingDetailsComp from '../components/TrackingDetailsComp';
import AnimatedLoader from '../components/AnimatedLoader/AnimatedLoader';
import handleAndroidBackButton from '../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';



const trackArray = [
  {
    id: 0,
    name: 'Arrived to pick up location',
    status: 'completed',
  },
  {
    id: 1,
    name: 'Picked',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Arrived to destination',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Delivered',
    status: 'pending',
  },
];

const TrackingOrderForm = ({navigation}) => {
  const {ordersTrackOrder, orderTrackingList} = rootStore.orderStore;
  const [loading, setLoading] = useState(
    orderTrackingList?.length?.length > 0 ? false : true,
  );
  const [isSelected, setIsSelected] = useState(0);
  const [trackedArray, setTrackedArray] = useState(orderTrackingList);
  const [trackingArray, setTrackingArray] = useState(trackArray);

  // useEffect(() => {
  //   getTrackingOrder();
  // }, []);
  
  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton();
      getTrackingOrder();
    }, []),
  );

  const getTrackingOrder = async () => {
    const res = await ordersTrackOrder(handleLoading);
    setTrackedArray(res);
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const hanldeLinking = type => {
    if (type) {
      if (type == 'email') {
        Linking.openURL(`mailto:${'DuuItt@gmail.com'}`);
      } else {
        Linking.openURL(`tel:${'1234567890'}`);
      }
    }
  };

  const setTrackStatus = status => {
    switch (status) {
      case 'arrive_to_pick':
        return 0;
      case 'picked':
        return 1;
      case 'arrived_to_destination':
        return 2;
      case 'delivered':
        return 3;
      default:
        return -1;
    }
  };

  const onViewDetails = (status, index) => {
    // if (isSelected == index) {
    //   setIsSelected('');
    // } else {
    //   setIsSelected(index);
    // }
    setIsSelected(prev => (prev === index ? null : index));
    const res = setTrackStatus(status);
    // console.log('res--', res);
    const updatedTrackArray = trackingArray?.map((item, i) => {
      if (i <= res) {
        return {...item, status: 'completed'};
      } else {
        return {...item, status: 'pending'};
      }
    });

    setTrackingArray([...updatedTrackArray]);
  };

  const setTrackImage = status => {
    switch (status) {
      case 'food':
        return appImages.order1;
      case 'parcel':
        return appImages.order2;
      case 'ride':
        return appImages.order3;
    }
  };

  const renderItem = ({item, index}) => {
    // console.log('item--', item);
    return (
      <View style={{marginHorizontal: 20}}>
        <TrackingDetailsComp
          onViewDetails={onViewDetails}
          item={item}
          xml={
            isSelected === index
              ? appImagesSvg.upGreenIcon
              : appImagesSvg.downGreenIcon
          }
          index={index}
        />
        {isSelected === index && (
          <Surface elevation={2} style={styles.trackingSurfaceView}>
            <View style={styles.innerTrackingView}>
              <DriverTrackingProfileComp
                item={{
                  image:
                    item?.rider?.profile_pic?.length > 0
                      ? item?.rider?.profile_pic
                      : setTrackImage(item?.order_type),

                  name: item?.rider?.name
                    ? item?.rider?.name
                    : 'Felicia Cudmore',
                  rating: '4.5',
                }}
                onMessage={() => {
                  hanldeLinking('email');
                }}
                onCall={() => {
                  hanldeLinking('call');
                }}
              />
              <View style={styles.lineView} />
              <DriverTrackingComp
                data={trackingArray}
                image={appImages.packetImage}
                //   bottomLine={true}
              />
              <TextRender
                title={'Cash'}
                value={currencyFormat(item?.total_amount)}
                bottomLine={false}
              />
            </View>
          </Surface>
        )}
      </View>
    );
  };

  return (
    <View style={styles.main}>
      {loading == true && trackedArray?.length == 0 ? (
        <AnimatedLoader type={'trackingOrderLoader'} />
      ) : (
        <View style={{flex: 1}}>
          {trackedArray?.length > 0 ? (
            <FlatList
              initialNumToRender={20}
              data={trackedArray}
              renderItem={renderItem}
              keyExtractor={item => item?._id?.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: '10%'}}
            />
          ) : (
            <View style={styles.noDataView}>
              <Text style={styles.noDataText}>No Data Found</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TrackingOrderForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  trackingSurfaceView: {
    shadowColor: colors.black50,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('41%'),
    marginTop: '3%',
    justifyContent: 'center',
  },
  innerTrackingView: {
    marginHorizontal: 20,
  },
  lineView: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '4%',
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: RFValue(15),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
});
