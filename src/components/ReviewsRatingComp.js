import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import ModalPopUpTouch from './ModalPopUpTouch';
import AppInputScroll from '../halpers/AppInputScroll';
import { Formik, useFormikContext } from 'formik';
import InputFieldMultiLine from './InputFieldMultiLine';
import BTN from './cta/BTN';
import { feedbackValidations } from '../forms/formsValidation/feedbackValidations';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import { rootStore } from '../stores/rootStore';
import { reviewRatingValidations } from '../forms/formsValidation/reviewRatingValidations';


let starArray = [1, 2, 3, 4, 5];
const ReviewsRatingComp = ({
  title,
  isVisible,
  onClose,
  loading,
  onHandleLoading,
  data,
  type,
  reviewToRider
}) => {
  const { addReviews } = rootStore.dashboardStore;
  const {appUser}=rootStore.commonStore;
  const [initialValues, setInitialValues] = useState({
    rating: 0,
    feedback: '',
  });
  const [ratingShow, setRatingShow] = useState(0);

  //   console.log("data type,---", data,type);

  const onRestaurantRating = item => {
    setRatingShow(item);
  };


  useEffect(() => {
    setRatingShow(0)
  }, [isVisible])

  const RestaurantContainer = () => {
    const { setFieldValue } = useFormikContext();
    return (
      <View style={styles.mainStarView}>
        {starArray?.map((item, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setFieldValue('rating', item);
                onRestaurantRating(item);
              }}
              activeOpacity={0.8}
              style={styles.TouchStar}>
              <SvgXml
                xml={
                  ratingShow >= item
                    ? appImagesSvg.yellowStarActive
                    : appImagesSvg.yellowStarUnactive
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const FormButton = ({ loading, onPress }) => {
    const { dirty, isValid, values } = useFormikContext();
    return (
      <BTN
        disable={!(isValid && dirty)}
        loading={loading}
        title={'Submit'}
        onPress={() => onPress(values)}
      />
    );
  };
  const handleUpdate = async values => {
    console.log('values---', values);
    let payload = {};
    if (reviewToRider === false) {
      payload = {
        review: values?.feedback ?? '',
        rating: values?.rating,
        type: type,
        order_id: data?._id,
        restaurant_id: data?.restaurant?._id,
        rider_id: data?.rider?._id ?? data?.rider_id,
        review_to_rider: reviewToRider,
        user_id: data?.customer?._id ?? appUser?._id,
      };
    } else {
      payload = {
        review: values?.feedback ?? '',
        rating: values?.rating,
        type: type,
        order_id: data?._id,
        rider_id: data?.rider?._id ?? data?.rider_id,
        review_to_rider: reviewToRider,
        user_id: data?.customer?._id ?? appUser?._id,
      };
    }
    const res = await addReviews(payload, handleLoading, onSuccess);
    console.log('res---', res);
    // handleLoading(false);
  };

  const handleLoading = v => {
    onHandleLoading(v);
    // if (v === false) {
    //   setRatingShow(0)
    //   onClose();
    // }
  };

  const onSuccess = () => {
    setRatingShow(0)
    onClose();
  }


  return (
    <ModalPopUpTouch
      avoidKeyboard={true}
      propagateSwipe={true}
      crossImage
      isVisible={isVisible}
      onClose={onClose}
      onOuterClose={onClose}>
      <View style={styles.main}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust if needed
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <Spacer space={'2%'} />
          <AppInputScroll
            padding={true}
            keyboardShouldPersistTaps={'handled'}
          // Pb={hp('15%')}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={reviewRatingValidations()}>
              <View style={styles.innerView}>
                <Text style={styles.titleText}>{title}</Text>
                {<RestaurantContainer />}
                <InputFieldMultiLine
                  height={hp('13%')}
                  maxLength={350}
                  inputLabel={'Add detailed review'}
                  name={'feedback'}
                  placeholder={'Enter Your Feedback'}
                />
                <Spacer space={hp('6%')} />
                <FormButton loading={loading} onPress={handleUpdate} />
              </View>
            </Formik>
          </AppInputScroll>
        </KeyboardAvoidingView>
      </View>
    </ModalPopUpTouch>
  );
};

export default ReviewsRatingComp;

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.appBackground,
    height: hp('46%'),
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  innerView: {
    marginTop: '3%',
    marginHorizontal: 20,
  },
  titleText: {
    fontSize: RFValue(15),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  mainStarView: {
    flexDirection: 'row',
    marginTop: '5%',
  },
  TouchStar: {
    paddingHorizontal: '2%',
  },
});
