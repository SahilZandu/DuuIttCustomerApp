import { StyleSheet } from 'react-native';
import { colors } from '../../../../../theme/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.appBackground,
    },
    upperMainView: {
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
    },
    renderMainView:{
        height: hp('10%'),
        width: wp('90%'),
        backgroundColor: colors.white,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.main,
        borderRadius: 10,
        marginTop: '5%',
    },
    renderInnerView:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeTextView:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    completeText:{
        fontSize: RFValue(11),
        fontFamily: fonts.medium,
        color: colors.color83,
    },
    ruppeImageView:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: colors.main,
        alignSelf: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginTop: '5%',
    },
    ruppeImage:{
        width: 14, height: 14
    },
    priceText:{
        fontSize: RFValue(10),
        fontFamily: fonts.medium,
        color:colors.main,
        marginLeft: '2%',
    },
    claimTouch:{
        backgroundColor:colors.main,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      alignSelf: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 20,
      marginTop: '2%',
    },
    claimText:{
        fontSize: RFValue(12),
        fontFamily: fonts.bold,
        color:colors.white,
    }

});
