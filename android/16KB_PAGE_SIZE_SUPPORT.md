# 16KB Page Size Support for Android 15+

## Overview
Google Play requires all apps targeting Android 15+ to support 16KB memory page sizes starting November 2025. This document explains the current status and solutions.

## Current Status

### ✅ Configured
- **NDK Version**: 26.1.10909125 (supports 16KB page sizes)
- **CMake Configuration**: Added linker flags for source-built libraries
- **Packaging**: Configured for 16KB alignment
- **Auto-Alignment Task**: Gradle task to align pre-built libraries

### ⚠️ Limitations
React Native 0.74.7 includes pre-built native libraries that were compiled **without** 16KB alignment:
- `libhermes.so`, `libjsi.so`, `libreactnativejni.so`, etc.
- These libraries come from React Native's AAR files

## Solutions

### Solution 1: Automatic Alignment (Current Implementation)
The build process now includes an automatic alignment task that runs after native libraries are merged:

```bash
./gradlew :app:assembleRelease
```

The `align16KbRelease` task will automatically attempt to align all `.so` files using `llvm-objcopy`.

**Note**: This may not work for all libraries, as some may not be alignable post-build.

### Solution 2: Manual Alignment Script
If automatic alignment doesn't work, you can run the manual script:

```bash
./android/align_16kb.sh <path_to_merged_libs>
```

The merged libs directory is typically at:
```
android/app/build/intermediates/merged_native_libs/Release/out/lib
```

### Solution 3: Upgrade React Native (Recommended)
The proper long-term solution is to upgrade to a React Native version that includes 16KB support:
- React Native 0.75+ should have better 16KB support
- Check React Native releases for 16KB page size support

### Solution 4: Wait for React Native Update
React Native team is working on 16KB support. Monitor:
- [React Native GitHub Issues](https://github.com/facebook/react-native/issues)
- React Native release notes

## Verification

To verify if libraries support 16KB:

```bash
# Check a library's alignment
readelf -l <library.so> | grep LOAD

# Or use llvm-readelf
llvm-readelf -l <library.so> | grep LOAD
```

Look for `Align` values of `0x4000` (16384 = 16KB) in the LOAD segments.

## Configuration Files

- `android/app/build.gradle`: CMake configuration and alignment task
- `android/app/src/main/jni/CMakeLists.txt`: CMake linker flags
- `android/gradle.properties`: Global CMake arguments
- `android/align_16kb.sh`: Manual alignment script

## Troubleshooting

### Alignment Task Fails
- Ensure NDK 26.1.10909125 is installed
- Check that `llvm-objcopy` exists in NDK directory
- Verify merged libs directory exists after `mergeReleaseNativeLibs` task

### Libraries Still Not Aligned
- Some libraries may not be alignable post-build
- Consider upgrading React Native
- Contact library maintainers for 16KB-compatible versions

### Build Errors
- Clean build: `./gradlew clean`
- Rebuild: `./gradlew :app:assembleRelease`

## References
- [Android 16KB Page Size Guide](https://developer.android.com/guide/practices/page-sizes)
- [Google Play Requirements](https://support.google.com/googleplay/android-developer/answer/11926878)



