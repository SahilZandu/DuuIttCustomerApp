import PropTypes from "prop-types"
import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from "./styles";
import { colors } from "../../theme/colors";
import Header from "../../components/header/Header";


const Wrapper = (props) => {

  return (

    <SafeAreaView
      edges={props.edges}
      style={[styles.parent, props.parentStyle]}>

      <>
        {props.showHeader && <Header {...props} />}
        <StatusBar
          translucent={props.transparentStatusBar}
          backgroundColor={props.transparentStatusBar ? 'transparent' : colors.appBackground}
          barStyle={props.barStyle ? props.barStyle : "dark-content"}  // or barStyle="light-content" for white icons
        />
        <View style={{ flex: 1 }}>
          {props.children}
        </View>
      </>
    </SafeAreaView>

  )
}

Wrapper.propTypes = {
  edges: PropTypes.array,
  transparentStatusBar: PropTypes.bool,
  parentStyle: PropTypes.object,
  showHeader: PropTypes.bool,
  barStyle: PropTypes.string,
  showBackgroundGradient: PropTypes.bool,
  gradientStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  onPressPicture: PropTypes.func,
  backImageStyle: PropTypes.object,
  profileImage: PropTypes.string,
  onPressSetting: PropTypes.func,
  showHello: PropTypes.bool
}

Wrapper.defaultProps = {
  edges: null,
  transparentStatusBar: false,
  showHeader: false,
  showBackgroundGradient: false,
  parentStyle: "dark-content",
}
export { Wrapper }

// import Header from "../header";
// import PropTypes from "prop-types"
// import React from "react";
// import { StatusBar, View } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { Colors, screenWidth } from "../../../utlis";
// import styles from "./styles";
// import MainHeader from "../mainHeader";
// const Wrapper = ({
//   edges = null,
//   transparentStatusBar = false,
//   showHeader = true,
//   showBackgroundGradient = false,
//   parentStyle,
//   gradientStyle,
//   headerStyle,
//   onPressPicture,
//   backImageStyle,
//   profileImage,
//   onPressSetting,
//   showHello,
//   children
// }) => {
//   return (
//     <>
//       <SafeAreaView edges={edges} style={[styles.parent, parentStyle]}>
//         <>
//           {showHeader && <MainHeader />}
//           <StatusBar
//             translucent={transparentStatusBar}
//             backgroundColor={transparentStatusBar ? 'transparent' : Colors.appBG}
//             barStyle="dark-content"
//           />
//           <View style={{ flex: 1 }}>{children}</View>
//         </>
//       </SafeAreaView>
//     </>
//   );
// };

// export { Wrapper }