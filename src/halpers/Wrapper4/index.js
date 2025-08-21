// import PropTypes from "prop-types"
// import React from "react";
// import { StatusBar, View } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import styles from "./styles";
// import { colors } from "../../theme/colors";
// import DashboardHeader from "../../components/header/DashboardHeader";


// const Wrapper4 = (props) => {

//   return (

//     <SafeAreaView
//       edges={props.edges}
//       style={[styles.parent, props.parentStyle]}>

//       <>
//         {props.showHeader && <DashboardHeader {...props} />}
//         <StatusBar
//           translucent={props.transparentStatusBar}
//           backgroundColor={props.transparentStatusBar ? 'transparent' : colors.appBackground}
//           barStyle={props.barStyle ? props.barStyle : "dark-content"}  // or barStyle="light-content" for white icons
//         />
//         <View style={{ flex: 1 }}>
//           {props.children}
//         </View>
//       </>
//     </SafeAreaView>

//   )
// }

// Wrapper4.propTypes = {
//   edges: PropTypes.array,
//   transparentStatusBar: PropTypes.bool,
//   parentStyle: PropTypes.object,
//   showHeader: PropTypes.bool,
//   barStyle: PropTypes.string,
//   showBackgroundGradient: PropTypes.bool,
//   gradientStyle: PropTypes.object,
//   headerStyle: PropTypes.object,
//   onPressPicture: PropTypes.func,
//   backImageStyle: PropTypes.object,
//   profileImage: PropTypes.string,
//   onPressSetting: PropTypes.func,
//   showHello: PropTypes.bool
// }

// Wrapper4.defaultProps = {
//   edges: null,
//   transparentStatusBar: false,
//   showHeader: false,
//   showBackgroundGradient: false,
//   parentStyle: "dark-content",
// }
// export { Wrapper4 }



import PropTypes from "prop-types";
import React from "react";
import { StatusBar, View, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "./styles";
import { colors } from "../../theme/colors";
import DashboardHeader from "../../components/header/DashboardHeader";

const Wrapper4 = (props) => {
  return (
    <SafeAreaView
      edges={props.edges}
      style={[styles.parent, props.parentStyle]}>

      {/* iOS status bar background hack */}
      {/* {Platform.OS === "ios" && !props.transparentStatusBar && (
        <View
          style={{
            height: 44, // default status bar height for iPhone X+, may adjust dynamically if needed
            backgroundColor: colors.appBackground,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        />
      )} */}

      <>
        {props.showHeader && <DashboardHeader {...props} />}
        <StatusBar
          animated={true}
          translucent={props.transparentStatusBar}
          backgroundColor={
            props.transparentStatusBar ? "transparent" : colors.appBackground
          }
          barStyle={props.barStyle ? props.barStyle : "dark-content"}
        />
        <View style={{ flex: 1 }}>
          {props.children}
        </View>
      </>
    </SafeAreaView>
  );
};

Wrapper4.propTypes = {
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
  showHello: PropTypes.bool,
};

Wrapper4.defaultProps = {
  edges: null,
  transparentStatusBar: false,
  showHeader: false,
  showBackgroundGradient: false,
  barStyle: "dark-content",
};

export { Wrapper4 };
