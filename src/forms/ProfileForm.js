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
import {loginValidations} from './formsValidation/loginValidations';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import FieldInput from '../components/FieldInput';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import AppInputScroll from '../halpers/AppInputScroll';
import GenderType from '../components/GenderType';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import RBSheet from '@lunalee/react-native-raw-bottom-sheet';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import PickUpdateActions from '../halpers/PickUpdateActions';
import {updateProfileValidations} from './formsValidation/updateProfileValidations';
import { colors } from '../theme/colors';

let dateStart = new Date();

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

const ProfileForm = ({navigation}) => {
  const refRBSheet = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [image, setImage] = useState('');
  const [initialValues, setInitialValues] = useState({
    image: image,
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: 'male',
  });

  const dateFormat = d => {
    var date = new Date(d);
    return moment(date).format('DD-MM-YYYY');
  };

  const handleLogin = values => {
    console.log('values', values);
    // navigation.navigate("verifyOtp",{value:values,loginType:type})
  };

  const DatePickeButton = ({}) => {
    const {setFieldValue} = useFormikContext();
    return (
      <DatePicker
        modal
        mode="date"
        maximumDate={dateStart}
        open={showPicker}
        date={dateStart}
        format="DD-MM-YYYY"
        onConfirm={date => {
          setShowPicker(false);
          setFieldValue('dob', dateFormat(date));
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={updateProfileValidations()}>
      <View style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
            <View style={{flex: 1}}>
              {/* {<ProfileCoverImage />} */}
              <View style={styles.imageMainView}>
                <Image
                  style={styles.image}
                  source={
                    image?.length > 0 ? {uri: image} : appImages.avtarImage
                  }
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
              <Spacer space={'-7%'} />
              <FieldInput
                inputLabel={'Name'}
                name={'fullName'}
                placeholder={'Enter full name'}
              />
              <FieldInput
                inputLabel={'Email Address'}
                keyboardType="email-address"
                name={'email'}
                placeholder={'example@gmail.com'}
                // rightIcon={true}
                // image={appImagesSvg.editProfile}
              />
              <FieldInput
                inputLabel={'Phone Number'}
                keyboardType="number-pad"
                name={'mobile'}
                placeholder={'Enter phone number'}
                maxLength={10}
                // rightIcon={true}
                // image={appImagesSvg.editProfile}
              />
              <FieldInput
                inputLabel={'Date of Birth'}
                name={'dob'}
                placeholder={'Enter date of birth'}
                rightIcon={true}
                image={appImagesSvg.datePickerSvg}
                onRightPress={() => {
                  setShowPicker(true);
                }}
              />

              <GenderType
                title={'Gender'}
                name={'gender'}
                value={initialValues.gender}
              />
            </View>
          </AppInputScroll>
        </KeyboardAvoidingView>
        <View>
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
};

export default ProfileForm;

const styles = StyleSheet.create({
  imageMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth:0.5,
    borderColor:colors.main
  },
  editIconMain: {
    backgroundColor: 'white',
    height: 27,
    width: 27,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-21%',
    right: '-7%',
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
