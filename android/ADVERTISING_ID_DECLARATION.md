# Advertising ID Declaration - Google Play Console

## 🔍 Analysis

Your app uses:
- ✅ **Firebase Analytics** (`@react-native-firebase/analytics`)
- ✅ **Firebase Messaging** (`@react-native-firebase/messaging`)

**Firebase Analytics uses Advertising ID by default** for analytics purposes, even if you don't explicitly use it in your code.

## 📋 Solution: Make Declaration in Google Play Console

### Step 1: Go to Google Play Console
1. Navigate to: https://play.google.com/console
2. Select your app: **Duultt Customer App**
3. Go to: **Policy** → **App content** → **Advertising ID**

### Step 2: Make the Declaration

**Option A: If you use Firebase Analytics (Recommended)**
- Select: **"Yes, my app uses advertising ID"**
- Reason: **"Analytics"** or **"App functionality"**
- This is the correct choice since Firebase Analytics uses Advertising ID

**Option B: If you want to disable Advertising ID**
- You can configure Firebase Analytics to not use Advertising ID
- Then declare: **"No, my app does not use advertising ID"**
- See configuration below

## ⚙️ Option: Disable Advertising ID in Firebase (Optional)

If you want to declare "No" and disable Advertising ID usage:

### Update AndroidManifest.xml

Add this to disable Advertising ID collection:

```xml
<application>
    <!-- Disable Advertising ID collection -->
    <meta-data
        android:name="google_analytics_adid_collection_enabled"
        android:value="false" />
    <meta-data
        android:name="google_analytics_ssaid_collection_enabled"
        android:value="false" />
</application>
```

### Update Firebase Configuration

In your Firebase initialization code, disable ad ID collection:

```javascript
import analytics from '@react-native-firebase/analytics';

// Disable advertising ID collection
analytics().setAnalyticsCollectionEnabled(true); // Keep analytics enabled
// But ad ID will be disabled via manifest
```

## ✅ Recommended Action

**Since you use Firebase Analytics, declare:**
- **"Yes, my app uses advertising ID"**
- **Purpose: "Analytics"**

This is the standard and correct declaration for apps using Firebase Analytics.

## 📝 Steps in Google Play Console

1. Click **"Update declaration"** (blue link)
2. Select: **"Yes, my app uses advertising ID"**
3. Select purpose: **"Analytics"** or **"App functionality"**
4. Click **Save**
5. The warning will disappear

## 🔗 Reference

- [Google Play Advertising ID Policy](https://support.google.com/googleplay/android-developer/answer/6048248)
- [Firebase Analytics and Advertising ID](https://firebase.google.com/support/privacy)

---

**Quick Fix**: Just go to Google Play Console → Policy → App content → Advertising ID → Select "Yes" → Save

This is a **declaration requirement**, not a code issue. Your app is fine!



