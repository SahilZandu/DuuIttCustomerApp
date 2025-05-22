import * as Yup from 'yup';

export const userUpdatePasswordValidations = () => {
    return Yup.object().shape({
        ['oldPassword']: Yup.string('Enter your old password')
            .trim()
            .required('Enter your old password')
            .min(8, 'Old password must be at least 8 characters'),
        ['newPassword']: Yup.string('Enter your new password')
            .trim()
            .required('Enter your new password')
            .min(8, 'New password must be at least 8 characters'),
        ['confirmPassword']: Yup.string('Enter your confirm password')
            .trim()
            .required('Enter confirm password')
            .oneOf([Yup.ref("newPassword")], "Passwords do not match")
            .min(8, 'Confirm password must be at least 8 characters'),
    });

};
