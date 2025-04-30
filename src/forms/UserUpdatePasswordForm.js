import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import CTA from '../components/cta/CTA';
import { Formik, useFormikContext } from 'formik';
import InputField from '../components/InputField';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import { Strings } from '../translates/strings';
import { rootStore } from '../stores/rootStore';
import { userUpdatePasswordValidations } from './formsValidation/userUpdatePasswordValidations';
import { colors } from '../theme/colors';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../halpers/handleAndroidBackButton';



const FormButton = ({ loading, onPress }) => {
    const { dirty, isValid, values } = useFormikContext();
    return (
        <CTA
            disable={!(isValid && dirty)}
            title={Strings?.save}
            onPress={() => onPress(values)}
            loading={loading}
        />
    );
};

const UserUpdatePasswordForm = ({ navigation }) => {
    const { userSetUpdatePassword } = rootStore.authStore
    const { appUser } = rootStore.commonStore;
    const [loading, setLoading] = useState(false);
    const [secureTextEntry, setsecureTextEntry] = useState(true);
    const [secureTextEntry2, setsecureTextEntry2] = useState(true);
    const [secureTextEntry3, setsecureTextEntry3] = useState(true);
    const [initialValues, setInitialValues] = useState(
        {
            email: appUser?.email ? appUser?.email : '',
            // oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    );

    const handleUserUpdatePass = async (values) => {
        console.log('values', values);
        await userSetUpdatePassword(values, 'update', navigation, handleLoading)
    };

    const handleLoading = v => {
        setLoading(v);
    };

    useFocusEffect(
        useCallback(() => {
            handleAndroidBackButton(navigation);
        }, []),
    );

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={userUpdatePasswordValidations()}>
            <View style={{ width: wp('85%'), alignSelf: 'center' }}>
                {/* <InputField
                    textColor={colors.black}
                    autoCapitalize={'none'}
                    name={'oldPassword'}
                    label={''}
                    inputLabel={'Old Password'}
                    placeholder={'********'}
                    secureTextEntry={secureTextEntry}
                    onPressEye={() => setsecureTextEntry(!secureTextEntry)}
                    rightIconName={!secureTextEntry ? 'eye' : 'eye-off'}
                /> */}
                <InputField
                    textColor={colors.black}
                    autoCapitalize={'none'}
                    name={'newPassword'}
                    label={''}
                    inputLabel={'New Password'}
                    placeholder={'********'}
                    secureTextEntry={secureTextEntry2}
                    onPressEye={() => setsecureTextEntry2(!secureTextEntry2)}
                    rightIconName={!secureTextEntry2 ? 'eye' : 'eye-off'}
                />
                <InputField
                    textColor={colors.black}
                    autoCapitalize={'none'}
                    name={'confirmPassword'}
                    label={''}
                    inputLabel={'Confirm Password'}
                    placeholder={'********'}
                    secureTextEntry={secureTextEntry3}
                    onPressEye={() => setsecureTextEntry3(!secureTextEntry3)}
                    rightIconName={!secureTextEntry3 ? 'eye' : 'eye-off'}
                />
                <Spacer space={'12%'} />
                <FormButton loading={loading} onPress={handleUserUpdatePass} />
            </View>
        </Formik>
    );
};

export default UserUpdatePasswordForm;
