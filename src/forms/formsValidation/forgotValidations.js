import * as Yup from 'yup';

export const forgotValidations = () => {
  return Yup.object().shape({
    [ 'email']: Yup.string('Enter your email')
      .trim()
      .email('Enter a valid email')
      .required('Enter your email')
      .matches(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        'Enter a valid email',
      ),
  });
};
