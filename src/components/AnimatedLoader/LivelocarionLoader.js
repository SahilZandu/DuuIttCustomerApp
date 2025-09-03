import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../../theme/colors';


const LiveLocationLoader = ({ }) => {
  const map = ['1',];

  return (
    <View style={{ paddingHorizontal: 0 }}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}
          backgroundColor={colors.black50}
          highlightColor={colors.black50}>
          <View>
            <View style={{ height: hp('7%'), width: wp('71%'), borderRadius: 8 }} />
          </View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default LiveLocationLoader;
