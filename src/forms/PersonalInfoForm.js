import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import CTA from '../components/cta/CTA';
import {Formik, useFormikContext} from 'formik';
import InputField from '../components/InputField';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';
import {rootStore} from '../stores/rootStore';
import FieldInput from '../components/FieldInput';
import {appImagesSvg} from '../commons/AppImages';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {personalInfoValidations} from './formsValidation/personalInfoValidations';
import FieldInputText from '../components/FieldInputText';
import InputFieldLabel from '../components/InputFieldLabel';

let dateStart = new Date();

const PersonalInfoForm = ({navigation, route}) => {
  const {loginType} = route.params;
  const {appUser} = rootStore.commonStore;
  const {updateCustomerInfo} = rootStore.authStore;
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  console.log('appUser--', appUser, loginType);

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: appUser?.email ? appUser?.email : '',
    mobile: appUser?.phone ? appUser?.phone?.toString() : '',
    dob: '',
    date_of_birth: '',
  });

  const handleInfo = async values => {
    console.log('values', values);
    await updateCustomerInfo(values, navigation, handleLoading);
  };
  const handleLoading = v => {
    setLoading(v);
  };

  const dateFormat = d => {
    var date = new Date(d);
    return moment(date).format('DD-MM-YYYY');
  };

  const dateFormatApi = d => {
    var date = new Date(d);
    return moment(date).format('YYYY-MM-DD');
  };
  const parseDateFromString = dateStr => {
    if (!dateStr) return new Date(); // fallback to current date

    const [day, month, year] = dateStr?.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const DatePickeButton = ({}) => {
    const {setFieldValue, values} = useFormikContext();
    const selectedDate = values?.dob
      ? parseDateFromString(values?.dob)
      : dateStart;
    // console.log(
    //   'selectedDate--',
    //   selectedDate,
    //   values,
    //   parseDateFromString(values.expiryDate),
    // );
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

  const FormButton = ({loading, onPress}) => {
    const {dirty, isValid, values} = useFormikContext();
    console.log('values--', values);
    return (
      <CTA
        disable={!(isValid && dirty)}
        title={Strings.next}
        onPress={() => onPress(values)}
        loading={loading}
      />
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={personalInfoValidations()}>
      <View pointerEvents={loading ?"none" :'auto'} style={styles.main}>
        <InputField
          textColor={colors.black}
          name={'name'}
          label={''}
          placeholder={'Enter your name'}
          maxLength={50}
        />

        <InputField
          autoCapitalize={'none'}
          editable={loginType == 'Email' ? false : true}
          isBlur={loginType == 'Email' ? true : false}
          textColor={colors.black}
          keyboardType="email-address"
          name={'email'}
          label={''}
          placeholder={'Enter email address'}
        />

        <InputField
          editable={loginType == 'Mobile' ? false : true}
          isBlur={loginType == 'Mobile' ? true : false}
          textColor={colors.black}
          keyboardType="number-pad"
          maxLength={10}
          // prefix={'+91'}
          name={'mobile'}
          label={''}
          placeholder={'Enter mobile number'}
        />

        <Spacer space={'-4%'} />

        <FieldInputText
          borderRadius={50}
          borderWidth={1.2}
          name={'dob'}
          rightIcon={true}
          placeholder={'Enter date of birth'}
          image={appImagesSvg.datePickerSvg}
          onBlur={true}
          onRightPress={() => {
            setShowPicker(true);
          }}
        />

        <DatePickeButton />
        <Spacer space={'16%'} />
        <FormButton loading={loading} onPress={handleInfo} />
      </View>
    </Formik>
  );
};

export default PersonalInfoForm;

const styles = StyleSheet.create({
  main: {
    // width: wp('85%'),
    //  alignSelf: 'center',
    marginHorizontal: 30,
    backgroundColor:colors.appBackground
  },

  forgotView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  forgotTouch: {
    width: wp('35%'),
    height: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotText: {
    fontSize: RFValue(12),
    fontFamily: fonts.bold,
    textAlign: 'right',
    color: colors.main,
  },
});
