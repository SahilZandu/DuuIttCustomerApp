import * as Yup from 'yup';

export const loginValidations = type => {
  console.log('type :', type);
  return Yup.object().shape({
    [type == 'Email' ? 'email' : '']: Yup.string('Enter your email')
      .trim()
      .email('Enter a valid email')
      .required('Enter your email')
      .matches(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        'Enter a valid email',
      ),
    [type == 'Mobile' ? 'mobile' : '']: Yup.string('Enter your mobile number')
      .trim()
      .required('Enter your mobile number')
      .min(10 ,"Mobile number should be 10 digits")
      .matches(
        /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
        'Number not valid',
      )
      .min(10 ,"Phone number should be 10 digits")
      .max(10,"Phone number should not be greater than 10 digits"),
      [type == 'Email' ? 'password' : '']: Yup.string('Enter your password')
      .trim()
      .required('Enter your password')
      .min(8, 'Password must be at least 8 characters'),
  });
};
