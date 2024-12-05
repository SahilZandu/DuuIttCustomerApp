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
import { silderArray } from '../stores/DummyData/Home';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import MeetingPickupComp from './MeetPickupComp';
import HomeSlider from './slider/homeSlider';


const DriverMeetPickup = ({topLine,sliderData,onPressDot}) => {
  const [sliderItems, setSliderItems] = useState(silderArray);

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