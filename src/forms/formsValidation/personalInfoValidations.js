import * as Yup from 'yup';

export const personalInfoValidations = () => {
  return Yup.object().shape({
    ['name']: Yup.string('Enter your name')
      .trim()
      .required('Name is required')
      .matches(/^[A-Za-z\s.-]{2,50}$/, 'Enter a valid your name')
      .min(2, "Name should be 2 character")
      .max(50, "Name should not be greater than 50 character"),
    ['email']: Yup.string('Enter your email address')
      .trim()
      .email('Enter a valid email')
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Enter a valid email')
      // .required('Enter your email address'),
      .notRequired(),
    ['mobile']: Yup.string('Enter your phone number')
      .trim()
      .required('Enter your phone number')
      .min(10, 'Number should be more then 10 digit')
      .matches(
        // /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
        /^(?:\+91|91)?[6-9]\d{9}$/,
        'Number not valid',
      ),
    ['dob']: Yup.string('Select date of birth')
      .trim()
      .notRequired(),
    //  .required('Date of birth is required'),

  });
};