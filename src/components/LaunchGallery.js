// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

// export const LaunchGallery = async () => {
//   const result = await launchImageLibrary({
//     mediaType: 'photo',
//     maxHeight: 1000,
//     maxWidth: 1000,
//     quality: 1,
//   });
//   return result;
// };

// export const LaunchCamera = async () => {
//   const result = await launchCamera({
//     mediaType: 'photo',
//     maxHeight: 1000,
//     maxWidth: 1000,
//     quality: 1,
//   });
//   return result;
// };

import ImagePicker from 'react-native-image-crop-picker';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

// Open gallery
export const LaunchGallery = async () => {
  try {
    const result = await ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 1,
      mediaType: 'photo',
    });

    if (result.size && result.size > MAX_FILE_SIZE) {
      console.warn('File too large, max allowed size is 5 MB');
      return { error: 'File size exceeds 5 MB' };
    }

    return result; // result.path will be your image
  } catch (error) {
    console.log('LaunchGallery error:', error);
    return null;
  }
};

// Open camera
export const LaunchCamera = async () => {
  try {
    const result = await ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 1,
      mediaType: 'photo',
    });

    if (result.size && result.size > MAX_FILE_SIZE) {
      console.warn('File too large, max allowed size is 5 MB');
      return { error: 'File size exceeds 5 MB' };
    }

    return result;
  } catch (error) {
    console.log('LaunchCamera error:', error);
    return null;
  }
};


// export const LaunchGallaryMultipleImages = async (limit) => {
//   console.log("limit",limit)
//   const result = await launchImageLibrary({
//     mediaType: 'photo',
//      maxHeight:1000,
//      maxWidth:1000,
//     quality:1,
//     multiple:true,
//     selectionLimit:limit,
//   });
//   console.log("result",result)
//   return result;
// };
