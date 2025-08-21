import { Platform, StyleSheet } from "react-native";
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { colors } from "../../theme/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const insets = useSafeAreaInsets();
export default StyleSheet.create({
    parent:{
        flex:1,
        backgroundColor:colors.appBackground,  
        marginTop: Platform.OS == 'ios' ? hp('6%') : hp('4.5%'),
        // paddingTop: insets.top,
        // paddingBottom: insets.bottom
    },
    gradientStyle:{ flex: 1,
        paddingHorizontal:20,
        paddingBottom:getBottomSpace()
    }
})