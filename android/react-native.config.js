module.exports = {
  project: {
    android: {
      sourceDir: './android',
      manifestPath: './android/app/src/main/AndroidManifest.xml',
      buildGradlePath: './android/app/build.gradle',
      settingsGradlePath: './android/settings.gradle',
      gradlePropertiesPath: './android/gradle.properties',
      mainActivityPath: './android/app/src/main/java/com/duuittapp/MainActivity.kt',
      mainApplicationPath: './android/app/src/main/java/com/duuittapp/MainApplication.kt',
    },
  },
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android',
          packageImportPath: 'import com.oblador.vectoricons.VectorIconsPackage;',
          packageInstance: 'new VectorIconsPackage()',
        },
      },
    },
  },
  assets: ['./src/assets/fonts/'],
};
