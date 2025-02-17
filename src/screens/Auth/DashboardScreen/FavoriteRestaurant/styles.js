import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../../theme/colors';
import { fonts } from '../../../../theme/fonts/fonts';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  flatListView: {
    flex: 1, justifyContent: 'center'
  },
  noDataView: {
    justifyContent: 'center', alignItems: 'center'
  },
  noDataText: {
    fontSize: RFValue(13), fontFamily: fonts.medium, color: colors.black
  },
  mainRenderView: {
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: '4%',
  },
  imageTextMainView: {
    flexDirection: 'row', alignItems: 'center'
  },
  restImage: {
    width: wp('25%'),
    height: hp('11%'),
    borderRadius: 10,
  },
  innerMainView: {
    flex: 1, flexDirection: 'column', marginLeft: '3%'
  },
  restLikeIconView: {
    flexDirection: 'row', alignItems: 'center'
  },
  restName: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  ratingView: {
    flexDirection: 'row',
    marginTop: '4%',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: '2%',
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  kmMinView: {
    flexDirection: 'row',
    marginTop: '4%',
    alignItems: 'center',
  },
  kmText: {
    marginLeft: '2%',
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.color83,
  },
  minText: {
    marginLeft: '2%',
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.color83,
  }

});
