import PropTypes from "prop-types"
import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from "./styles";
import { colors } from "../../theme/colors";
import DashboardHeader3 from "../../components/header/DashboardHeader3";


const Wrapper3 = (props) => {
  return (

    <SafeAreaView
      edges={props.edges}
      style={[styles.parent, props.parentStyle]}>

      <>
        {props.showHeader && <DashboardHeader3 {...props} />}
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

Wrapper3.propTypes = {
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

Wrapper3.defaultProps = {
  edges: null,
  transparentStatusBar: false,
  showHeader: false,
  showBackgroundGradient: false,
  parentStyle: "dark-content",
}
export { Wrapper3 }