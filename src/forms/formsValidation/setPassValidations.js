import * as Yup from 'yup';

export const setPassValidations = type => {
  console.log('type :', type);
  return Yup.object().shape({
      ['password']: Yup.string('Enter your password')
      .trim()
      .required('Enter your password')
      .min(8, 'Password must be at least 8 characters'),
      ['confirm']: Yup.string('Enter your confirm password')
      .trim()
      .required('Enter confirm password')
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .min(8, 'Password must be at least 8 characters'),
  });

};
