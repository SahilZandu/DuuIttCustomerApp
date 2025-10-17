// // SwipeGestureScreen.js
// import React from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import { PanGestureHandler } from 'react-native-gesture-handler';
// import { useNavigation } from '@react-navigation/native';
// import Animated, {
//   useAnimatedGestureHandler,
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   runOnJS,
// } from 'react-native-reanimated';

// const { width } = Dimensions.get('window');

// const SwipeGestureScreen = ({ children }) => {
//   const navigation = useNavigation();
//   const translateX = useSharedValue(0);

//   const gestureHandler = useAnimatedGestureHandler({
//     onActive: (event) => {
//       translateX.value = event.translationX;
//     },
//     onEnd: (event) => {
//       // If user swipes right more than 80 px → go back
//       if (event.translationX > 80) {
//         runOnJS(navigation.goBack)();
//       } else if (event.translationX < -80) {
//         // Swipe left → do something else (optional)
//         // runOnJS(console.log)('Swiped left!');
//       }
//       translateX.value = withTiming(0); // Reset position
//     },
//   });

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: translateX.value }],
//   }));

//   return (
//     <PanGestureHandler onGestureEvent={gestureHandler}>
//       <Animated.View style={[styles.container, animatedStyle]}>
//         {children}
//       </Animated.View>
//     </PanGestureHandler>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff', // or transparent if overlay
//   },
// });

// export default SwipeGestureScreen;




// SwipeGestureScreen.js - Alternative version
import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const SwipeGestureScreen = ({ children }) => {
    const navigation = useNavigation();
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                { dx: pan.x }
            ], { useNativeDriver: false }),
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > 40) {
                    navigation.goBack();
                } else if (gesture.dx < -40) {
                    navigation.goBack();
                }
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false
                }).start();
            }
        })
    ).current;

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: pan.getTranslateTransform() }
            ]}
            {...panResponder.panHandlers}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.appBackground,
    },
});

export default SwipeGestureScreen;
