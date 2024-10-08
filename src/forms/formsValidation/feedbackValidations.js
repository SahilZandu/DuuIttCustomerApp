import * as Yup from 'yup';

export const feedbackValidations = () => {
  return Yup.object().shape({
    ['feedback']: Yup.string('Enter your feedback')
      .trim()
      .required('Enter your feedback'),
  });
};
