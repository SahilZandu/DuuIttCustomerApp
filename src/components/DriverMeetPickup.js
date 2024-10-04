import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import MeetingPickupComp from './MeetPickupComp';
import HomeSlider from './slider/homeSlider';


let imageArray = [
  {id: 1, image: appImages.sliderImage1},
  {id: 2, image: appImages.sliderImage2},
  {id: 3, image: appImages.sliderImage1},
  {id: 4, image: appImages.sliderImage2},
];

const DriverMeetPickup = ({topLine,sliderData,onPressDot}) => {
  const [sliderItems, setSliderItems] = useState(imageArray);

  return (
    <View>
      {topLine && <View style={styles.topLineView} />}
      <View style={{marginTop:'1%'}}>
        <MeetingPickupComp
          firstText={'Meet at your pickup stop'}
          secondText={'Ride Details'}
          onPressDot={onPressDot}
        />
        <View style={{marginLeft: '6%', alignSelf: 'center'}}>
          <HomeSlider data={sliderItems} />
        </View>
      </View>
    </View>
  );
};

export default DriverMeetPickup;

const styles = StyleSheet.create({
  topLineView: {
    height: 4.5,
    backgroundColor: colors.colorD9,
    width: wp('12%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '1%',
  },
});