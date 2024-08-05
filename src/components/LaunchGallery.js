import {launchImageLibrary,launchCamera} from 'react-native-image-picker';

export const LaunchGallary = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
     maxHeight:1000,
     maxWidth:1000,
    quality:1,
  });
  return result;
};

export const LaunchCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
       maxHeight:1000,
       maxWidth:1000,
      quality:1,
    });
    return result;
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
