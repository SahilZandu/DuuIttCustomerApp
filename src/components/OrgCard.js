import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../theme/fonts/fonts';
import { colors } from '../theme/colors';
import { SvgXml } from 'react-native-svg';

const OrgCard = ({
  org,
  isResOpen,
  offerData,
  isResOpenSoon,
  orgOffers,
  onReviews,
}) => {
  function calculateTime(distance, speed) {
    if (distance) {
      let timeInSeconds = (distance / speed) * 3600;
      let hours = Math.floor(timeInSeconds / 3600);
      let minutes = Math.floor((timeInSeconds % 3600) / 60);
      let seconds = Math.round(timeInSeconds % 60);

      if (hours == 0 && minutes == 0) {
        return seconds + ' sec';
      } else if (hours == 0) {
        return minutes + ' min';
      } else {
        return hours + ' h' + ' ' + minutes + ' min';
      }
    } else {
      return '0 sec';
    }
  }

  const OrgStatus = () => {
    return (
      <View
        style={styles.openRestaurantView}>
        <SvgXml xml={tick} style={styles.tickButton} />
        <Text
          style={styles.openNowText}>
          Open Now
        </Text>
        <Text
          style={styles.timeText}>
          | 12:30 pm - 12:00 am
        </Text>
      </View>
    );
  };

  // const renderOfferCard = ({item, index}) => {
  //   return (
  //     <View
  //       style={{
  //         height: hp('6%'),
  //         backgroundColor: colors.colorEC,
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //         borderRadius: 10,
  //         marginLeft: 16,
  //         paddingHorizontal: '5%',
  //       }}>
  //       <Text>{'  '}</Text>
  //       <View style={{alignItems: 'center', justifyContent: 'center'}}>
  //         <SvgXml xml={offerIcon} fill={'#0D71CD'} />
  //         <Text
  //           style={{
  //             color: 'white',
  //             position: 'absolute',
  //             fontSize: RFValue(10),
  //             fontFamily: fonts.medium,
  //           }}>
  //           %
  //         </Text>
  //       </View>
  //       <Text>{'  '}</Text>
  //       <View style={{}}>
  //         <Text
  //           style={{
  //             color: colors.color3D,
  //             fontFamily: fonts.medium,
  //             fontSize: RFValue(10),
  //           }}>
  //           Get up to ₹{item?.max_discount} Off
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.color80,
  //             fontFamily: fonts.medium,
  //             fontSize: RFValue(8),
  //           }}>
  //           use code {item?.coupon_code}
  //         </Text>
  //       </View>
  //       <Text>{'  '}</Text>
  //     </View>
  //   );
  // };

  // const Coupnes = orgOffers => {
  //   console.log('orgOffers  -----', orgOffers.orgOffers);
  //   if (orgOffers && orgOffers?.orgOffers.length > 0) {
  //     return (
  //       <View style={{width: wp('100%'), marginLeft: -16}}>
  //         <FlatList
  //           horizontal
  //           scrollEnabled={true}
  //           contentContainerStyle={{
  //             marginTop: '4%',
  //             paddingRight: 16,
  //           }}
  //           showsHorizontalScrollIndicator={false}
  //           data={orgOffers?.orgOffers}
  //           renderItem={renderOfferCard}
  //           keyExtractor={item => item?.id}
  //         />
  //       </View>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  const Offline = () => {
    return (
      <View style={{justifyContent:'center',marginTop:'3%'}}>
        {/* <Image
          source={isResOpenSoon ? resOpenSoonIcon : resClosedIcon}
          style={{
            height: hp('20%'),
            width: wp('100%'),
            alignSelf: 'center',
            marginTop: '2%',
            marginBottom: '1%',
          }}
          resizeMode="stretch"
        /> */}

        <Text
          style={[styles.offlineText, {
            // top: isResOpenSoon ? hp('5%') : hp('3%'),
          }]}>
          {isResOpenSoon
            ? 'Restaurant opens in ' + isResOpenSoon
            : 'This restaurant is not accepting orders at the moment. It should re-open soon.'}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onReviews}>
      <View style={styles.container}>
        {/* {isResOpen !== false && <Offline />} */}
        <View style={{ flexDirection: 'row' }}>
          <Text numberOfLines={2} style={[styles.title, { flex: 1 }]}>
            {org?.name}
          </Text>
          <View
            style={styles.ratingView}>
            <SvgXml
              width={12}
              height={12}
              xml={star}
              style={styles.ratingImage}
            />
            <Text
              style={styles.ratingText}>
              {3.8}
            </Text>
          </View>
        </View>

        <Text style={styles.des}>{org?.about}</Text>
        <Text style={styles.addressText}> {org?.minimum_order_preparation_time - 5 ?? 0} - {org?.minimum_order_preparation_time ?? 0} Min{' '}{(org?.distanceInKm).toFixed(1)} KM</Text>
        <Text style={styles.addressText}>{org?.address}</Text>
        {isResOpen !== false && <OrgStatus />}
        {isResOpen == false && <Offline />}
        {/* <Coupnes orgOffers={orgOffers} /> */}
      </View>
    </TouchableOpacity>
  );
};

export default OrgCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center'
  },
  title: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(17),
    textTransform: 'capitalize',
  },
  ratingView: {
    flexDirection: 'row',
    paddingHorizontal: '3%',
    paddingVertical: 5,
    backgroundColor: colors.colorFD,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  ratingImage: {
    right: '10%',
    top: '-2%'
  },
  ratingText: {
    fontSize: RFValue(11),
    fontFamily: fonts.semiBold,
    color: colors.white,
    left: '10%',
  },
  des: {
    color: colors.color64,
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    marginTop: '1.5%',
  },
  addressText: {
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: RFValue(11),
    marginTop: '1.5%',
  },
  text: {
    color: colors.color64,
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
  },
  openRestaurantView: {
    flexDirection: 'row', // This arranges the children in a horizontal row
    flexWrap: 'nowrap',
    width: '100%',
    marginTop: '3%',
  },
  tickButton: {
    marginRight: '2%',
    marginTop: '0.5%'
  },
  openNowText: {
    color: colors.main,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
  },
  timeText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    marginLeft: '2%',
  },
  offlineText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    width: wp('90%'),
    textTransform:'capitalize'
  }

});

const star = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 8 8" fill="none">
<path d="M4 0.5L5.29313 2.72016L7.80423 3.26393L6.09232 5.17984L6.35114 7.73607L4 6.7L1.64886 7.73607L1.90768 5.17984L0.195774 3.26393L2.70687 2.72016L4 0.5Z" fill="white"/>
</svg>`;
const tick = `<svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="14" height="14" rx="7" fill="#1B951C"/>
<path d="M10.3332 4.5L5.74984 9.08333L3.6665 7" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const offerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="current">
<path d="M10.4106 1.50623C11.185 0.40687 12.815 0.40687 13.5894 1.50623V1.50623C14.1304 2.27415 15.143 2.54548 15.9954 2.15093V2.15093C17.2158 1.58607 18.6273 2.40103 18.7483 3.74032V3.74032C18.8329 4.67584 19.5742 5.41714 20.5097 5.50166V5.50166C21.849 5.62266 22.6639 7.03421 22.0991 8.25457V8.25457C21.7045 9.10702 21.9758 10.1196 22.7438 10.6606V10.6606C23.8431 11.435 23.8431 13.065 22.7438 13.8394V13.8394C21.9758 14.3804 21.7045 15.393 22.0991 16.2454V16.2454C22.6639 17.4658 21.849 18.8773 20.5097 18.9983V18.9983C19.5742 19.0829 18.8329 19.8242 18.7483 20.7597V20.7597C18.6273 22.099 17.2158 22.9139 15.9954 22.3491V22.3491C15.143 21.9545 14.1304 22.2258 13.5894 22.9938V22.9938C12.815 24.0931 11.185 24.0931 10.4106 22.9938V22.9938C9.86965 22.2258 8.85702 21.9545 8.00457 22.3491V22.3491C6.78421 22.9139 5.37266 22.099 5.25166 20.7597V20.7597C5.16714 19.8242 4.42584 19.0829 3.49032 18.9983V18.9983C2.15103 18.8773 1.33607 17.4658 1.90093 16.2454V16.2454C2.29548 15.393 2.02415 14.3804 1.25623 13.8394V13.8394C0.15687 13.065 0.15687 11.435 1.25623 10.6606V10.6606C2.02415 10.1196 2.29548 9.10702 1.90093 8.25457V8.25457C1.33607 7.03421 2.15103 5.62266 3.49032 5.50166V5.50166C4.42584 5.41714 5.16714 4.67584 5.25166 3.74032V3.74032C5.37266 2.40103 6.78421 1.58607 8.00457 2.15093V2.15093C8.85702 2.54548 9.86965 2.27415 10.4106 1.50623V1.50623Z" />
</svg>`;
