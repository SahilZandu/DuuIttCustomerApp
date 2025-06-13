import * as Yup from 'yup';

export const updateProfileValidations = () => {
  return Yup.object().shape({
    ['image']: Yup.string('Profile picture is required')
      .trim()
       .notRequired(),
      // .required('Profile picture is required'),
    // ['name']: Yup.string('Enter your name')
    // .trim()
    // .required('Name is required')
    // .min(2,"Name should be 2 character")
    // .max(50,"Name should not be greater than 50 character"),
    ['name']: Yup.string('')
      .trim()
      .required('Name required')
      .min(2)
      .matches(/[a-zA-Z]+$|[a-zA-Z]+ [a-zA-Z]+$/, 'Enter valid Name')
      .required('Name is required')
      .min(2, 'Name should be 2 character')
      .max(50, 'Name should not be greater than 50 character'),
    ['email']: Yup.string('Enter your email address')
      .trim()
      .email('Enter a valid email')
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Enter a valid email')
      // .required('Enter your email address')
       .notRequired(),
    ['mobile']: Yup.string('Enter your phone number')
      .trim()
      .required('Enter your phone number')
      .min(10, 'number should be more then 10 digit')
      .matches(
        // /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
        /^(?:)?[6-9]\d{9}$/,
        'Number not valid',
      ),
    ['dob']: Yup.string('Select date of birth')
      .trim()
      // .required('Date of birth is required'),
      .notRequired(),
    ['gender']: Yup.string('Select your gender')
      .trim()
      .required('Select your gender'),
    

  });
};
