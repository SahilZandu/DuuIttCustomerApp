#!/bin/bash

echo "🔧 Fixing React Native library compatibility issues..."

# Function to fix a library's build.gradle
fix_library() {
    local lib_path="$1"
    local namespace="$2"
    
    if [ -f "$lib_path/android/build.gradle" ]; then
        echo "Fixing $lib_path..."
        
        # Add namespace if missing
        if ! grep -q "namespace" "$lib_path/android/build.gradle"; then
            sed -i '' '/android {/a\
    namespace "'$namespace'"' "$lib_path/android/build.gradle"
        fi
        
        # Add buildFeatures.buildConfig if buildConfigField exists
        if grep -q "buildConfigField" "$lib_path/android/build.gradle" && ! grep -q "buildFeatures" "$lib_path/android/build.gradle"; then
            sed -i '' '/android {/a\
    buildFeatures {\
        buildConfig true\
    }' "$lib_path/android/build.gradle"
        fi
        
        # Update SDK versions to 35
        sed -i '' 's/compileSdkVersion [0-9]*/compileSdkVersion 35/g' "$lib_path/android/build.gradle"
        sed -i '' 's/targetSdkVersion [0-9]*/targetSdkVersion 35/g' "$lib_path/android/build.gradle"
        sed -i '' 's/minSdkVersion [0-9]*/minSdkVersion 23/g' "$lib_path/android/build.gradle"
        sed -i '' 's/buildToolsVersion "[0-9.]*"/buildToolsVersion "35.0.0"/g' "$lib_path/android/build.gradle"
    fi
}

# Fix common libraries
fix_library "node_modules/react-native-audio-record" "com.reactnativeaudiorecorder"
fix_library "node_modules/react-native-background-timer" "com.pilloxa.backgroundtimer"
fix_library "node_modules/react-native-date-picker" "com.henninghall.date_picker"
fix_library "node_modules/react-native-fast-image" "com.dylanvann.fastimage"
fix_library "node_modules/react-native-geolocation-service" "com.agontuk.RNFusedLocation"
fix_library "node_modules/react-native-linear-gradient" "com.BV.LinearGradient"
fix_library "node_modules/react-native-maps" "com.airbnb.android.react.maps"
fix_library "node_modules/react-native-modal" "com.reactnativecommunity.modal"
fix_library "node_modules/react-native-notifications" "com.wix.reactnativenotifications"
fix_library "node_modules/react-native-permissions" "com.zoontek.rnpermissions"
fix_library "node_modules/react-native-popover-view" "com.reactnativecommunity.popover"
fix_library "node_modules/react-native-progress" "com.reactnativecommunity.progress"
fix_library "node_modules/react-native-qrcode-svg" "com.reactnativecommunity.qrcodesvg"
fix_library "node_modules/react-native-rating-element" "com.reactnativecommunity.rating"
fix_library "node_modules/react-native-razorpay" "com.razorpay.rn"
fix_library "node_modules/react-native-reanimated" "com.swmansion.reanimated"
fix_library "node_modules/react-native-restart" "com.reactnativecommunity.restart"
fix_library "node_modules/react-native-safe-area-context" "com.th3rdwave.safeareacontext"
fix_library "node_modules/react-native-screens" "com.swmansion.rnscreens"
fix_library "node_modules/react-native-share" "cl.json.RNShare"
fix_library "node_modules/react-native-skeleton-placeholder" "com.reactnativecommunity.skeleton"
fix_library "node_modules/react-native-svg" "com.horcrux.svg"
fix_library "node_modules/react-native-vector-icons" "com.oblador.vectoricons"
fix_library "node_modules/react-native-voice" "com.reactnativecommunity.voice"
fix_library "node_modules/react-native-webview" "com.reactnativecommunity.webview"

echo "✅ Library fixes completed!"
echo "Now try building your project again."
