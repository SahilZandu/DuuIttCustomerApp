import * as Yup from 'yup';

export const reviewRatingValidations = () => {
  return Yup.object().shape({
    ['rating']: Yup.string('Enter restaurant rating').required(
      'Enter restaurant rating',
    ),
    ['feedback']: Yup.string('Enter your feedback')
    // .required('Enter your feedback')
    .notRequired()
    .min(10 ,'Feedback must be at least 10 characters long')
    .max(350,'Feedback cannot exceed 350 characters'),
    
  });
};
