import * as Yup from 'yup';

export const giftMessageValidations = () => {
  return Yup.object().shape({
    ['feedback']: Yup.string('Enter your message')
      .trim()
      .required('Enter your message'),
  });
};
