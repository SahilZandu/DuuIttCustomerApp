import * as Yup from 'yup';

export const userSetPassValidations = ()=> {
  return Yup.object().shape({
    ['email']: Yup.string('Enter your email')
         .trim()
         .email('Enter a valid email')
         .required('Enter your email')
         .matches(
           /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
           'Enter a valid email',
         ),
      ['password']: Yup.string('Enter your password')
      .trim()
      .required('Enter your password')
      .min(8, 'Password must be at least 8 characters'),
      ['confirm']: Yup.string('Enter your confirm password')
      .trim()
      .required('Enter confirm password')
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .min(8, 'Confirm password must be at least 8 characters'),
  });

};
