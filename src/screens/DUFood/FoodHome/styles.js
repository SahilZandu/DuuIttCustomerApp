import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  buttonContainer: {
    // paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ECFFF3', // Filled color (green in this case)
    borderWidth: 2,
    borderColor: '#28B056', // Border color (slightly darker green)
    borderRadius: 20, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#28B056', // Text color
    fontSize: 10,
    fontWeight: 'bold',
  },
  View_:{
    marginStart:10
  },
  star: {
    position: 'absolute',
    top: 5, // Adjust the distance from the top
    right: 5, // Adjust the distance from the right
    zIndex: 1, // Ensure the star is above the image
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: 10,
  },
  itemContainer: {
    // width: 150,

    marginHorizontal: 10,
    
    // alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  name: {
    marginTop: 8,
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.black,
    // textAlign: 'center',
  },
  rating: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.black,
    marginStart: 2,
    // textAlign: 'center',
  },
  mint: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: '#272525',
    marginStart: 5,
    // textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  titleText: {
    fontSize: RFValue(16),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '2.5%',
    marginStart:10,
  },
  outerScrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: '2%',
  },
  bottomImageView: {
    marginTop: '5%',
  },
  bottomImage: {
    height: hp('30%'),
    width: wp('100%'),
  },
});
