# Build Instructions for Google Play Store

## ✅ Current Configuration

- **Android Gradle Plugin**: 8.5.1+ (supports 16KB page sizes)
- **NDK Version**: 26.1.10909125 (supports 16KB, compatible with React Native 0.74.7)
- **16KB Alignment**: Automatic alignment task configured
- **Packaging**: Configured for 16KB support

## 📦 Building Release Bundle for App Store

### Step 1: Clean Build
```bash
cd android
./gradlew clean
```

### Step 2: Build Release Bundle (AAB)
```bash
./gradlew :app:bundleRelease
```

The AAB file will be created at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Step 3: Verify Alignment (Optional)
```bash
# Extract and check a library
unzip -q app/build/outputs/bundle/release/app-release.aab -d aab_extracted
readelf -l aab_extracted/base/lib/arm64-v8a/libhermes.so | grep LOAD
```

Look for `Align 0x4000` (16384 = 16KB) in the output.

## 📤 Uploading to Google Play Console

1. **Go to Google Play Console**
   - Navigate to your app
   - Go to "Production" → "Create new release"

2. **Upload AAB File**
   - Upload: `android/app/build/outputs/bundle/release/app-release.aab`
   - The alignment task runs automatically during build

3. **If 16KB Error Persists**
   - React Native 0.74.7's pre-built libraries may not be fully alignable
   - The alignment task attempts to fix them, but some may still fail
   - Consider upgrading to React Native 0.77+ when available for built-in 16KB support

## 🔍 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
./gradlew clean
./gradlew :app:bundleRelease
```

### Alignment Task Not Running
- Check build output for: `> Task :app:align16KbRelease`
- Verify NDK is installed: `ls $ANDROID_HOME/ndk/26.1.10909125`

### Google Play Still Shows Error
- Some React Native 0.74.7 libraries cannot be fully aligned post-build
- This is a known limitation of React Native 0.74.7
- Solution: Upgrade to React Native 0.77+ when available

## 📝 Notes

- **Version Code**: Currently set to 8 (increment for each release)
- **Signing**: Release keystore configured in `build.gradle`
- **Alignment**: Automatic alignment runs during build process

## 🚀 Next Steps

1. Build the release bundle using the commands above
2. Upload to Google Play Console
3. If errors persist, consider React Native upgrade path



