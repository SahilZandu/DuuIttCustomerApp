import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import CTA from '../components/cta/CTA';
import {Formik, useFormikContext} from 'formik';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import AppInputScroll from '../halpers/AppInputScroll';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import RBSheet from '@lunalee/react-native-raw-bottom-sheet';
import PickUpdateActions from '../halpers/PickUpdateActions';
import {updateProfileValidations} from './formsValidation/updateProfileValidations';
import {colors} from '../theme/colors';
import {rootStore} from '../stores/rootStore';
import Url from '../api/Url';
import InputFieldLabel from '../components/InputFieldLabel';
import FieldInputText from '../components/FieldInputText';
import DropDownLabelComp from '../components/DropDownLabelComp';

let dateStart = new Date();
let genderArray = [
  {
    id: 1,
    name: 'male',
  },
  {
    id: 2,
    name: 'female',
  },
  {
    id: 3,
    name: 'others',
  },
];

const FormButton = ({loading, onPress}) => {
  const {dirty, isValid, values} = useFormikContext();

  return (
    <CTA
      disable={!(isValid && dirty)}
      title={'SAVE CHANGES'}
      onPress={() => onPress(values)}
      loading={loading}
      isBottom={true}
      width={'90%'}
    />
  );
};

const ProfileForm = ({navigation, screenName}) => {
  const {updateProfile} = rootStore.dashboardStore;
  const {appUser} = rootStore.commonStore;
  const refRBSheet = useRef(null);
  const dateFormat = d => {
    var date = new Date(d);
    return moment(date).format('DD-MM-YYYY');
  };
  const dateFormatApi = d => {
    var date = new Date(d);
    return moment(date).format('YYYY-MM-DD');
  };
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [image, setImage] = useState(
    appUser?.profile_pic?.length > 0
      ? Url?.Image_Url + appUser?.profile_pic
      : '',
  );
  const [update, setUpdate] = useState(true);
  const [initialValues, setInitialValues] = useState({
    image:
      appUser?.profile_pic?.length > 0
        ? Url?.Image_Url + appUser?.profile_pic
        : '',
    name: appUser?.name?.length > 0 ? appUser?.name : '',
    email: appUser?.email?.length > 0 ? appUser?.email : '',
    mobile:
      appUser?.phone?.toString()?.length > 0 ? appUser?.phone?.toString() : '',
    dob:
      appUser?.date_of_birth?.length > 0
        ? dateFormat(appUser?.date_of_birth)
        : '',
    date_of_birth:
      appUser?.date_of_birth?.length > 0
        ? dateFormatApi(appUser?.date_of_birth)
        : '',
    gender: appUser?.gender?.length > 0 ? appUser?.gender : 'male',
  });

  const handleLogin = async values => {
    console.log('values', values);
    await updateProfile(values, handleLoading, onSuccess);
    // navigation.navigate("verifyOtp",{value:values,loginType:type})
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const onSuccess = () => {
    const {appUser} = rootStore.commonStore;
    setUpdate(false);
    setInitialValues({
      image: Url?.Image_Url + appUser?.profile_pic,
      name: appUser?.name,
      email: appUser?.email,
      mobile: appUser?.phone?.toString(),
      dob: dateFormat(appUser?.date_of_birth),
      date_of_birth: dateFormatApi(appUser?.date_of_birth),
      gender: appUser?.gender,
    });

    setTimeout(() => {
      setUpdate(true);
    }, 50);
    if (screenName !== 'sideMenu') {
      navigation.goBack();
    }
  };
  const parseDateFromString = dateStr => {
    if (!dateStr) return new Date(); // fallback to current date

    const [day, month, year] = dateStr?.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const DatePickeButton = ({}) => {
    const {setFieldValue, values} = useFormikContext();

    // Get date from formik field or fallback to current date

     
    const selectedDate = values?.dob
      ? parseDateFromString(values?.dob)
      : dateStart;
    console.log('selectedDate--', selectedDate, values, parseDateFromString(values.dob));
    return (
      <DatePicker
        modal
        mode="date"
        maximumDate={dateStart}
        open={showPicker}
        date={selectedDate}
        format="DD-MM-YYYY"
        onConfirm={date => {
          setShowPicker(false);
          setFieldValue('dob', dateFormat(date));
          setFieldValue('date_of_birth', dateFormatApi(date));
        }}
        onCancel={() => {
          setShowPicker(false);
        }}
      />
    );
  };

  const ProfileCoverImage = () => {
    return (
      <View style={styles.imageMainView}>
        <Image
          style={styles.image}
          source={image?.length > 0 ? {uri: image} : appImages.avtarImage}
        />
        <View style={styles.editIconMain}>
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.open();
            }}
            activeOpacity={0.8}
            style={styles.editImageTouch}>
            <SvgXml xml={appImagesSvg.whiteEditProfile} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onChangeImage = uri => {
    setImage(uri);
    refRBSheet.current.close();
  };

  if (update == true) {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={updateProfileValidations()}>
        <View style={{flex: 1}}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <AppInputScroll
              Pb={'25%'}
              padding={true}
              keyboardShouldPersistTaps={'handled'}>
              <View style={{flex: 1, marginHorizontal: 20}}>
                {/* {<ProfileCoverImage />} */}
                <View style={styles.imageMainView}>
                  <View style={styles.imageView}>
                    <Image
                      style={styles.image}
                      source={
                        image?.length > 0 ? {uri: image} : appImages.avtarImage
                      }
                    />
                  </View>
                  <View style={styles.editIconMain}>
                    <TouchableOpacity
                      onPress={() => {
                        refRBSheet.current.open();
                      }}
                      activeOpacity={0.8}
                      style={styles.editImageTouch}>
                      <SvgXml xml={appImagesSvg.whiteEditProfile} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Spacer space={'-7%'} />

                <InputFieldLabel
                  borderWidth={1}
                  inputLabel={'Name'}
                  name={'name'}
                  placeholder={'Enter full name'}
                />
                <InputFieldLabel
                  autoCapitalize={'none'}
                  borderWidth={1}
                  inputLabel={'Email Address'}
                  keyboardType="email-address"
                  name={'email'}
                  placeholder={'example@gmail.com'}
                />
                <InputFieldLabel
                  borderWidth={1}
                  inputLabel={'Phone Number'}
                  keyboardType="number-pad"
                  name={'mobile'}
                  placeholder={'Enter phone number'}
                  maxLength={10}
                />

                <FieldInputText
                  borderWidth={1.2}
                  name={'dob'}
                  rightIcon={true}
                  inputLabel={'Date of Birth'}
                  placeholder={'Enter date of birth'}
                  image={appImagesSvg.datePickerSvg}
                  onBlur={true}
                  onRightPress={() => {
                    setShowPicker(true);
                  }}
                />

                <DropDownLabelComp
                  position={'relative'}
                  marginTop={hp('-4%')}
                  name={'gender'}
                  title={'Gender'}
                  value={initialValues.gender}
                  list={genderArray}
                />
              </View>
            </AppInputScroll>
          </KeyboardAvoidingView>
          <View
            style={{backgroundColor: colors.appBackground, height: hp('9%')}}>
            <FormButton loading={loading} onPress={handleLogin} />
          </View>
          <DatePickeButton />
          <RBSheet
            height={hp('22%')}
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            keyboardAvoidingViewEnabled={Platform.OS == 'ios' ? true : false}
            customStyles={{
              wrapper: {
                backgroundColor: 'rgba(52, 52, 52, 0.8)',
              },
              container: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            }}>
            <PickUpdateActions name={'image'} onSelectUri={onChangeImage} />
          </RBSheet>
        </View>
      </Formik>
    );
  } else {
    null;
  }
};

export default ProfileForm;

const styles = StyleSheet.create({
  imageMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  imageView: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: colors.main,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    // borderWidth: 0.5,
    // borderColor: colors.main,
  },
  editIconMain: {
    backgroundColor: 'white',
    height: 27,
    width: 27,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-14%',
    right: '-5%',
  },
  editImageTouch: {
    backgroundColor: '#AFAFAF',
    height: 22,
    width: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
