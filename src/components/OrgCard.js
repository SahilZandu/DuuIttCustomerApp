import React from 'react';
import {View, Text, StyleSheet, FlatList, Image, Pressable, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import { colors} from '../theme/colors';

import {SvgXml} from 'react-native-svg';

// const resClosedIcon = require('../../../assets/closed.png');
// const resOpenSoonIcon = require('../../../assets/opensoon.png');

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

  const Info = () => {
    return (
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginTop: '3%'}}>
        <Pressable
          onPress={onReviews}
          style={{
            backgroundColor: 'rgba(27, 149, 28, 0.08)',
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            height: hp('3.5%'),
          }}>
          <View
            style={{
              backgroundColor: '#1B951C',
              height: hp('3.5%'),
              borderRadius: 6,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: fonts.medium,
                fontSize: RFValue(9),
              }}>
              {'  '}
              {org?.average_rating
                ? Number(org?.average_rating).toFixed(1)
                : '0.0'}{' '}
            </Text>
            <SvgXml xml={star} style={{marginRight: '3%', marginTop: '-2%'}} />
          </View>

          <Text style={styles.text}>
            {'  '}
            {org?.review_count} Review{' '}
          </Text>
        </Pressable>

        <View
          style={{
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            height: hp('3.5%'),
            backgroundColor: 'rgba(249, 189, 0, 0.12)',
            paddingHorizontal: '2%',
            marginLeft: '2%',
          }}>
          <SvgXml xml={time} style={{marginRight: '3%'}} />
          <Text style={styles.text}>
            {calculateTime(org?.distance, 50)}
            {'  '}
          </Text>
          <SvgXml xml={elcipe} style={{}} />
          <Text style={styles.text}>
            {'  '}
            {parseFloat(org?.distance?.toFixed(1))} Km
          </Text>
        </View>
      </View>
    );
  };

  const Address = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          // alignItems: 'center',
          marginTop: '4%',
          paddingRight: '5%',
        }}>
        <SvgXml xml={marker} style={{marginRight: '2%', marginTop: '1%'}} />
        <Text style={styles.text}>{org?.address}</Text>
      </View>
    );
  };

  const OrgStatus = () => {
    return (
      <View
        style={{
          flexDirection: 'row', // This arranges the children in a horizontal row
          flexWrap: 'nowrap',
          width: '100%',
          marginTop: 10,
        }}>
        <SvgXml xml={tick} style={{marginRight: '2%', marginTop: '1%'}} />

        <Text
          style={{
            color: '#28B056',
            fontSize: RFValue(14),
            fontFamily: fonts.medium,
          }}>
          Open Now
        </Text>
        <Text
          style={{
            fontSize: RFValue(14),
            fontFamily: fonts.medium,
            color: colors.black,
            marginStart: 6,
          }}>
          | 12:30pm - 12am
        </Text>
      </View>
    );
  };

  const renderOfferCard = ({item, index}) => {
    return (
      <View
        style={{
          height: hp('6%'),
          backgroundColor: '#ECF4FB',
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 10,
          marginLeft: 16,
          paddingHorizontal: '5%',
        }}>
        <Text>{'  '}</Text>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <SvgXml xml={offerIcon} fill={'#0D71CD'} />
          <Text
            style={{
              color: 'white',
              position: 'absolute',
              fontSize: RFValue(10),
              fontFamily: fonts.medium,
            }}>
            %
          </Text>
        </View>
        <Text>{'  '}</Text>
        <View style={{}}>
          <Text
            style={{
              color: '#3D3D3D',
              fontFamily: fonts.medium,
              fontSize: RFValue(10),
            }}>
            Get up to ₹{item?.max_discount} Off
          </Text>
          <Text
            style={{
              color: '#808080',
              fontFamily: fonts.medium,
              fontSize: RFValue(8),
            }}>
            use code {item?.coupon_code}
          </Text>
        </View>
        <Text>{'  '}</Text>
      </View>
    );
  };

  const Coupnes = orgOffers => {
    console.log('orgOffers  -----', orgOffers.orgOffers);
    if (orgOffers && orgOffers?.orgOffers.length > 0) {
      return (
        <View style={{width: wp('100%'), marginLeft: -16}}>
          <FlatList
            horizontal
            scrollEnabled={true}
            contentContainerStyle={{
              marginTop: '4%',
              paddingRight: 16,
            }}
            showsHorizontalScrollIndicator={false}
            data={orgOffers?.orgOffers}
            renderItem={renderOfferCard}
            keyExtractor={item => item?.id}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const Offline = () => {
    return (
      <View style={{marginBottom: '5%'}}>
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
          style={{
            color: '#646464',
            fontFamily: fonts.medium,
            fontSize: RFValue(10),
            position: 'absolute',
            width: wp('65%'),
            top: isResOpenSoon ? hp('5%') : hp('3%'),
          }}>
          {isResOpenSoon
            ? 'Restaurant opens in ' + isResOpenSoon
            : 'This restaurant is not accepting orders at the moment. It should re-open soon.'}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
    onPress={onReviews}>

    
    <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
      {isResOpen == false && <Offline />}

      <Text style={styles.title}>{org?.name}</Text>

      <Text style={styles.des}>{org?.description}</Text>
      <Text style={styles.des}>25-30 min 1km Sector 61</Text>

      {/* <Info /> */}
      {/* <Address /> */}
      <OrgStatus />

      <Coupnes orgOffers={orgOffers} />
    </View>
    </TouchableOpacity>
  );
};

export default OrgCard;

const styles = StyleSheet.create({
  title: {
    color: '#000000',
    fontFamily: fonts.medium,
    fontSize: RFValue(17),
    textTransform: 'capitalize',
  },
  des: {
    color: '#646464',
    fontFamily: fonts.medium,
    fontSize: RFValue(10),
    marginTop: '1%',
  },
  text: {
    color: '#646464',
    fontFamily: fonts.medium,
    fontSize: RFValue(10),
  },
});

const star = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 8 8" fill="none">
<path d="M4 0.5L5.29313 2.72016L7.80423 3.26393L6.09232 5.17984L6.35114 7.73607L4 6.7L1.64886 7.73607L1.90768 5.17984L0.195774 3.26393L2.70687 2.72016L4 0.5Z" fill="white"/>
</svg>`;

const time = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 12 13" fill="none">
<path d="M4.5 2V1H7.5V2H4.5ZM5.5 7.5H6.5V4.5H5.5V7.5ZM6 11.5C5.38333 11.5 4.802 11.3813 4.256 11.144C3.71033 10.9063 3.23333 10.5833 2.825 10.175C2.41667 9.76667 2.09367 9.28967 1.856 8.744C1.61867 8.198 1.5 7.61667 1.5 7C1.5 6.38333 1.61867 5.802 1.856 5.256C2.09367 4.71033 2.41667 4.23333 2.825 3.825C3.23333 3.41667 3.71033 3.09383 4.256 2.8565C4.802 2.61883 5.38333 2.5 6 2.5C6.51667 2.5 7.0125 2.58333 7.4875 2.75C7.9625 2.91667 8.40833 3.15833 8.825 3.475L9.525 2.775L10.225 3.475L9.525 4.175C9.84167 4.59167 10.0833 5.0375 10.25 5.5125C10.4167 5.9875 10.5 6.48333 10.5 7C10.5 7.61667 10.3813 8.198 10.144 8.744C9.90633 9.28967 9.58333 9.76667 9.175 10.175C8.76667 10.5833 8.28967 10.9063 7.744 11.144C7.198 11.3813 6.61667 11.5 6 11.5ZM6 10.5C6.96667 10.5 7.79167 10.1583 8.475 9.475C9.15833 8.79167 9.5 7.96667 9.5 7C9.5 6.03333 9.15833 5.20833 8.475 4.525C7.79167 3.84167 6.96667 3.5 6 3.5C5.03333 3.5 4.20833 3.84167 3.525 4.525C2.84167 5.20833 2.5 6.03333 2.5 7C2.5 7.96667 2.84167 8.79167 3.525 9.475C4.20833 10.1583 5.03333 10.5 6 10.5Z" fill="#646464"/>
</svg>`;

const elcipe = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 3 3" fill="none">
<circle cx="1.5" cy="1.5" r="1.5" fill="#646464"/>
</svg>`;

const marker = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 14" fill="none">
<path d="M6.99992 7.58341C7.96642 7.58341 8.74992 6.79991 8.74992 5.83341C8.74992 4.86692 7.96642 4.08341 6.99992 4.08341C6.03342 4.08341 5.24992 4.86692 5.24992 5.83341C5.24992 6.79991 6.03342 7.58341 6.99992 7.58341Z" stroke="#1D721E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.99992 12.8334C9.33325 10.5001 11.6666 8.41074 11.6666 5.83341C11.6666 3.25609 9.57725 1.16675 6.99992 1.16675C4.42259 1.16675 2.33325 3.25609 2.33325 5.83341C2.33325 8.41074 4.66659 10.5001 6.99992 12.8334Z" stroke="#1D721E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const tick = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="14" height="14" rx="7" fill="#1B951C"/>
<path d="M10.3332 4.5L5.74984 9.08333L3.6665 7" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const offerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="current">
<path d="M10.4106 1.50623C11.185 0.40687 12.815 0.40687 13.5894 1.50623V1.50623C14.1304 2.27415 15.143 2.54548 15.9954 2.15093V2.15093C17.2158 1.58607 18.6273 2.40103 18.7483 3.74032V3.74032C18.8329 4.67584 19.5742 5.41714 20.5097 5.50166V5.50166C21.849 5.62266 22.6639 7.03421 22.0991 8.25457V8.25457C21.7045 9.10702 21.9758 10.1196 22.7438 10.6606V10.6606C23.8431 11.435 23.8431 13.065 22.7438 13.8394V13.8394C21.9758 14.3804 21.7045 15.393 22.0991 16.2454V16.2454C22.6639 17.4658 21.849 18.8773 20.5097 18.9983V18.9983C19.5742 19.0829 18.8329 19.8242 18.7483 20.7597V20.7597C18.6273 22.099 17.2158 22.9139 15.9954 22.3491V22.3491C15.143 21.9545 14.1304 22.2258 13.5894 22.9938V22.9938C12.815 24.0931 11.185 24.0931 10.4106 22.9938V22.9938C9.86965 22.2258 8.85702 21.9545 8.00457 22.3491V22.3491C6.78421 22.9139 5.37266 22.099 5.25166 20.7597V20.7597C5.16714 19.8242 4.42584 19.0829 3.49032 18.9983V18.9983C2.15103 18.8773 1.33607 17.4658 1.90093 16.2454V16.2454C2.29548 15.393 2.02415 14.3804 1.25623 13.8394V13.8394C0.15687 13.065 0.15687 11.435 1.25623 10.6606V10.6606C2.02415 10.1196 2.29548 9.10702 1.90093 8.25457V8.25457C1.33607 7.03421 2.15103 5.62266 3.49032 5.50166V5.50166C4.42584 5.41714 5.16714 4.67584 5.25166 3.74032V3.74032C5.37266 2.40103 6.78421 1.58607 8.00457 2.15093V2.15093C8.85702 2.54548 9.86965 2.27415 10.4106 1.50623V1.50623Z" />
</svg>`;
