import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, View} from 'react-native';
import {styles} from './styles';
import Header from '../../../../components/header/Header';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import {useFocusEffect} from '@react-navigation/native';
import {Formik, useFormikContext} from 'formik';
import InputFieldMultiLine from '../../../../components/InputFieldMultiLine';
import CTA from '../../../../components/cta/CTA';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import { feedbackValidations } from '../../../../forms/formsValidation/feedbackValidations';
import { Strings } from '../../../../translates/strings';

export default function Feedback({navigation}) {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    feedback: '',
  });

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  const FormButton = ({loading, onPress}) => {
    const {dirty, isValid, values} = useFormikContext();
    return (
      <>
        <CTA
          disable={!(isValid && dirty)}
          title={'Submit'}
          onPress={() => {
            onPress(values);
          }}
          loading={loading}
          theme={'primary'}
          isBottom={true}
        />
      </>
    );
  };

  const handleFeedback = values => {};

  return (
    <View style={styles.container}>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
        title={'Send Feedback'}
        backArrow={true}
          />
       
        <Formik
        initialValues={initialValues}
        validationSchema={feedbackValidations()}
        >
        <View style={styles.mainView}>
         <AppInputScroll padding={true} Pb={hp('15%')}> 
          <View style={styles.inputView}>
            <InputFieldMultiLine
              maxLength={350}
              inputLabel={''}
              name={'feedback'}
              placeholder={'Enter Feedback'}
            />
            <Text
              style={styles.tellAboutText}>
             {Strings.TellUsLoveAbout}
            </Text>
          </View>
          </AppInputScroll>
          <View
            style={styles.bottomBtnView}>
            <FormButton loading={loading} onPress={handleFeedback} />
          </View>
          </View>
      </Formik>
      
    </View>
  );
}


// import React, { useRef, useState, useEffect } from 'react';
// import { ScrollView, StyleSheet, Text, View, Animated } from 'react-native';
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';

// const Feedback = () => {
//     const [initialDataHeight, setInitialDataHeight] = useState(0);
//     const [scrollOffset, setScrollOffset] = useState(0);
//     const scrollHeight = useRef(new Animated.Value(hp('8%'))).current;
//     const initialDataRef = useRef(null);

//     // Handle scroll events to track the scroll offset
//     const handleScroll = (event) => {
//         const offsetY = event.nativeEvent.contentOffset.y;

//         // Animate the height of the scrollable view based on the scroll position
//         if (offsetY >= 20) {
//             Animated.timing(scrollHeight, {
//                 toValue: hp('60%'),
//                 duration: 300,
//                 useNativeDriver: false,
//             }).start();
//         } else {
//             Animated.timing(scrollHeight, {
//                 toValue: hp('8%'),
//                 duration: 300,
//                 useNativeDriver: false,
//             }).start();
//         }

//         setScrollOffset(offsetY);
//     };

//     // Measure the height of the initial data container once it's rendered
//     useEffect(() => {
//         if (initialDataRef.current) {
//             initialDataRef.current.measure((x, y, width, height) => {
//                 setInitialDataHeight(height);
//             });
//         }
//     }, []);

//     return (
//         <View style={styles.container}>
//             {/* Initial Data */}
//             <View style={styles.initialDataContainer} ref={initialDataRef}>
//                 <Text style={styles.initialData}>Initial Data</Text>
//             </View>

//             {/* Show Scroll Offset */}
//             <View style={styles.offsetContainer}>
//                 <Text>Scroll Offset: {scrollOffset.toFixed(2)}</Text>
//             </View>

//             {/* Scrollable Content with Animated Height */}
//             <Animated.View
//                 style={[
//                     styles.scrollContainer,
//                     { height: scrollHeight },
//                 ]}
//             >
//                 <ScrollView
//                     onScroll={handleScroll}
//                     scrollEventThrottle={16}
//                     contentContainerStyle={{ paddingTop: initialDataHeight }}
//                 >
//                     <Text style={styles.contentText}>
//                         Scrollable content starts here.
//                     </Text>
//                     {Array.from({ length: 20 }, (_, index) => (
//                         <Text key={index} style={styles.contentText}>
//                             Content line {index + 1}
//                         </Text>
//                     ))}
//                 </ScrollView>
//             </Animated.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f3f4f6',
//     },
//     initialDataContainer: {
//         backgroundColor: '#d1d5db',
//         alignItems: 'center',
//         padding: 20,
//     },
//     initialData: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     offsetContainer: {
//         padding: 10,
//         backgroundColor: '#e5e7eb',
//         alignItems: 'center',
//     },
//     scrollContainer: {
//         position: 'absolute',
//         bottom: '0%',
//         width: wp('100%'),
//         backgroundColor: 'green',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         overflow: 'hidden', // Ensures rounded corners are respected
//     },
//     contentText: {
//         fontSize: 16,
//         textAlign: 'center',
//         color: 'white',
//         marginVertical: 10,
//     },
// });

// export default Feedback;


// import React, { useRef, useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Animated } from 'react-native';
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';

// const Feedback = () => {
//     const [initialDataHeight, setInitialDataHeight] = useState(0);
//     const scrollHeight = useRef(new Animated.Value(hp('60%'))).current; // Set a fixed height for the content

//     // Measure the height of the initial data container once it's rendered
//     useEffect(() => {
//         if (initialDataRef.current) {
//             initialDataRef.current.measure((x, y, width, height) => {
//                 setInitialDataHeight(height);
//             });
//         }
//     }, []);

//     const initialDataRef = useRef(null);

//     return (
//         <View style={styles.container}>
//             {/* Initial Data */}
//             <View style={styles.initialDataContainer} ref={initialDataRef}>
//                 <Text style={styles.initialData}>Initial Data</Text>
//             </View>

//             {/* Non-scrollable Content */}
//             <Animated.View
//                 style={[
//                     styles.scrollContainer,
//                     { height: scrollHeight },
//                 ]}
//             >
//                 <View style={styles.contentContainer}>
//                     <Text style={styles.contentText}>
//                         Non-scrollable content starts here.
//                     </Text>
//                     {Array.from({ length: 20 }, (_, index) => (
//                         <Text key={index} style={styles.contentText}>
//                             Content line {index + 1}
//                         </Text>
//                     ))}
//                 </View>
//             </Animated.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f3f4f6',
//     },
//     initialDataContainer: {
//         backgroundColor: '#d1d5db',
//         alignItems: 'center',
//         padding: 20,
//     },
//     initialData: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     scrollContainer: {
//         position: 'absolute',
//         bottom: '0%',
//         width: wp('100%'),
//         backgroundColor: 'green',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         overflow: 'hidden', // Ensures rounded corners are respected
//     },
//     contentContainer: {
//         padding: 20, // Add padding for the content
//     },
//     contentText: {
//         fontSize: 16,
//         textAlign: 'center',
//         color: 'white',
//         marginVertical: 10,
//     },
// });

// export default Feedback;

// import React, { useRef } from 'react';
// import { View, Text, StyleSheet, Animated } from 'react-native';
// import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

// const GestureExample = () => {
//     // Animated values for height and width
//     const animatedHeight = useRef(new Animated.Value(100)).current; // Initial height
//     const animatedWidth = useRef(new Animated.Value(100)).current; // Initial width

//     // Function to handle gesture events
//     const onGestureEvent = Animated.event(
//         [{ nativeEvent: { translationY: animatedHeight, translationX: animatedWidth } }],
//         { useNativeDriver: false }
//     );

//     return (
//         <GestureHandlerRootView style={styles.container}>
//             <PanGestureHandler onGestureEvent={onGestureEvent}>
//                 <Animated.View style={[styles.box, { height: animatedHeight, width: animatedWidth }]}>
//                     <Text style={styles.text}>Drag Me!</Text>
//                 </Animated.View>
//             </PanGestureHandler>
//         </GestureHandlerRootView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f3f4f6',
//     },
//     box: {
//         backgroundColor: 'blue',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 10,
//     },
//     text: {
//         color: 'white',
//         fontSize: 18,
//     },
// });

// export default GestureExample;


// import React, { useRef, useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

// const Feedback = () => {
//       const initialDataRef = useRef(null);
//     const [minMaxHp ,setMinMaxHp]=useState(hp('60%'))

//     // Measure the height of the initial data container once it's rendered
   

//     // Function to handle gesture events
//     // const onGestureEvent = Animated.event(
     
//     //     [{ nativeEvent: { translationY: scrollHeight } }],
//     //     { useNativeDriver: false }
//     // );

//     const onGestureEvent = ({nativeEvent})=>{
//         console.log('nativeEvent----------',nativeEvent);
//         if(nativeEvent?.translationY >= 0){
//           setMinMaxHp(hp('30%'))
//         }else {
//           setMinMaxHp(hp('60%'))
//         }
//         // if(nativeEvent?.absoluteY >= 451 && nativeEvent?.absoluteY <= 600){
//         //   setMinMaxHp(hp('60%'))
//         // }
//         // else if(nativeEvent?.absoluteY >= 250 && nativeEvent?.absoluteY <= 450){
//         //   setMinMaxHp(hp('30%'))
//         // }else{
//         //   setMinMaxHp(hp('30%'))
//         // }
//     }



//     return (
//         <GestureHandlerRootView style={styles.container}>
//             {/* Initial Data */}
//             <View style={styles.initialDataContainer} ref={initialDataRef}>
//                 <Text style={styles.initialData}>Initial Data</Text>
//             </View>

//             {/* Non-scrollable Content with Gesture Handling */}
//             <PanGestureHandler onGestureEvent={onGestureEvent}>
//                 <Animated.View
//                     style={[
//                         styles.scrollContainer,
//                         { height: minMaxHp },
//                     ]}
//                 >
//                   <ScrollView style={{flex:1}}>
//                     <View style={styles.contentContainer}>
//                         <Text style={styles.contentText}>
//                             Non-scrollable content starts here.
//                         </Text>
//                         {Array.from({ length: 20 }, (_, index) => (
//                             <Text key={index} style={styles.contentText}>
//                                 Content line {index + 1}
//                             </Text>
//                         ))}
//                     </View>
//                     </ScrollView>
//                 </Animated.View>
//             </PanGestureHandler>
//         </GestureHandlerRootView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f3f4f6',
//     },
//     initialDataContainer: {
//         backgroundColor: '#d1d5db',
//         alignItems: 'center',
//         padding: 20,
//     },
//     initialData: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     scrollContainer: {
//         position: 'absolute',
//         bottom: '0%',
//         width: wp('100%'),
//         backgroundColor: 'green',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         overflow: 'hidden', // Ensures rounded corners are respected
//     },
//     contentContainer: {
//         padding: 20, // Add padding for the content
//     },
//     contentText: {
//         fontSize: 16,
//         textAlign: 'center',
//         color: 'white',
//         marginVertical: 10,
//     },
// });

// export default Feedback;









