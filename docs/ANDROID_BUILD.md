# Android Build Guide

This project is configured to build a native Android APK using [Capacitor](https://capacitorjs.com/).

## Prerequisites

- Node.js 18+
- Java JDK 17
- Android Studio (for local development)

## Building Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Build Web App**:
    ```bash
    npm run build
    ```

3.  **Sync Capacitor**:
    ```bash
    npx cap sync android
    ```

4.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
    From here, you can run the app on an emulator or device.

5.  **Build APK via Command Line**:
    ```bash
    cd android
    ./gradlew assembleDebug
    ```
    The APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

## GitHub Actions

A GitHub Action workflow (`.github/workflows/android-build.yml`) is set up to automatically build the APK on every push to `main`.

### Artifacts
The built APK is uploaded as an artifact named `app-debug`. You can download it from the "Actions" tab in your GitHub repository.

## Troubleshooting

### "SDK Location not found"
Create a `local.properties` file in the `android` directory with the path to your Android SDK:
```properties
sdk.dir=/path/to/your/android/sdk
```

### Gradle Errors
Try cleaning the build:
```bash
cd android
./gradlew clean
```
