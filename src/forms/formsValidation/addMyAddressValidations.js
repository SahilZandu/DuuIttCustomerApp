import * as Yup from 'yup';

export const addMyAddressValidations = () => {
  return Yup.object().shape({
    // ['name']: Yup.string('Enter your name')
    // .trim()
    // .required('Name is required')
    // .min(2,"Name should be 2 character")
    // .max(50,"Name should not be greater than 50 character"),
    ['phone']: Yup.string('Enter your phone number')
    .trim()
    .required('Enter your phone number')
    .min(10 ,"Phone number should be 10 digits")
    .matches(
      /^(?:\+91|91)?[6-9]\d{9}$/,
      'Number not valid',
    )
    .min(10 ,"Phone number should be 10 digits")
    .max(10,"Phone number should not be greater than 10 digits"),
    ['house']: Yup.string('Enter your flat/house no')
    .trim()
    .required('Flat/House No is required')
    .min(2,"Flat/House No should be 2 character")
    .max(100,"Flat/House No should not be greater than 100 character"),
  });
};