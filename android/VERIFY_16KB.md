# How to Verify 16KB Page Size Support

## After Building

1. **Build your release bundle:**
   ```bash
   cd android
   ./gradlew :app:bundleRelease
   ```

2. **Check the build output** - Look for messages like:
   ```
   Aligning native libraries in ... to 16KB boundaries...
   Done aligning libraries: X aligned, Y skipped/failed
   ```

3. **Verify alignment manually:**
   ```bash
   # Extract AAB (if needed)
   unzip -q app-release.aab -d aab_extracted
   
   # Check a library
   readelf -l aab_extracted/base/lib/arm64-v8a/libhermes.so | grep LOAD
   ```
   
   Look for `Align 0x4000` (16384 = 16KB) in the output.

## If Google Play Still Shows Errors

The alignment task may not work for all pre-built libraries from React Native 0.74.7. In this case:

1. **Check React Native version:**
   - React Native 0.74.7 has pre-built libraries without 16KB support
   - Consider upgrading to React Native 0.75+ when available

2. **Temporary workaround:**
   - The alignment task will attempt to fix libraries
   - Some libraries may not be alignable post-build
   - Google Play may still flag them

3. **Long-term solution:**
   - Wait for React Native to release a version with built-in 16KB support
   - Or rebuild React Native from source with 16KB flags

## Current Configuration

- ✅ AGP 8.5.1+ (supports 16KB)
- ✅ NDK 26.1.10909125 (supports 16KB)
- ✅ CMake configuration with 16KB flags
- ✅ Automatic alignment task
- ⚠️ React Native 0.74.7 pre-built libraries (may not be fully alignable)



