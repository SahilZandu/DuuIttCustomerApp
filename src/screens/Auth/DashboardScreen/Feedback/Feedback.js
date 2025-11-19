import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import Header from '../../../../components/header/Header';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { Formik, useFormikContext } from 'formik';
import InputFieldMultiLine from '../../../../components/InputFieldMultiLine';
import CTA from '../../../../components/cta/CTA';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import { feedbackValidations } from '../../../../forms/formsValidation/feedbackValidations';
import { Strings } from '../../../../translates/strings';
import { rootStore } from '../../../../stores/rootStore';
import { Wrapper } from '../../../../halpers/Wrapper';
import { AppEvents } from '../../../../halpers/events/AppEvents';
import SwipeGestureScreen from '../../../../halpers/SwipeGestureScreen';

export default function Feedback({ navigation }) {
  const { appFeedback } = rootStore.dashboardStore;
  const { appUser } = rootStore.commonStore;
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    feedback: '',
  });


  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'Feedback',
        payload: {
          name: appUser?.name ?? '',
          phone: appUser?.phone?.toString() ?? '',
        }
      })
    } catch (error) {
      console.log("Error---", error);
    }

  }

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  const FormButton = ({ loading, onPress }) => {
    const { dirty, isValid, values } = useFormikContext();
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

  const handleFeedback = async (values) => {
    await appFeedback(values, handleLoading, navigation)
  };

  const handleLoading = (v) => {
    setLoading(v)
  }

  return (
    <SwipeGestureScreen>
      <Wrapper
        edges={['left', 'right']}
        transparentStatusBar
        onPress={() => {
          navigation.goBack();
        }}
        title={'Send Feedback'}
        backArrow={true}
        showHeader
      >

        <View style={styles.container}>
          {/* <Header
        onPress={() => {
          navigation.goBack();
        }}
        title={'Send Feedback'}
        backArrow={true}
          /> */}

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

      </Wrapper>
    </SwipeGestureScreen>
  );
}












