import * as Yup from 'yup';

export const senderReceiverValidations = () => {
  return Yup.object().shape({
    ['address_detail']: Yup.string('Enter your address')
      .trim()
      .required('Address is required')
      .min(2, "Address should be 2 character")
      .max(100, "Address should not be greater than 50 character"),
    ['name']: Yup.string('Enter your name')
      .trim()
      .required('Name is required')
      .min(2, "Name should be 2 character")
      .max(50, "Name should not be greater than 50 character")
      .matches(
        /^[A-Za-z\s]{2,50}$/,
        'Name not valid',
      ),
    ['phone']: Yup.string('Enter your phone number')
      .trim()
      .required('Enter your phone number')
      .min(10, 'Number should be more then 10 digit')
      .matches(
        /^(?:\+91|91)?[6-9]\d{9}$/,
        'Number not valid',
      ),

  });
};