@echo off
REM Run React Native on Android
REM Prerequisites: Android SDK, Android Studio, and Android Emulator/Device

echo.
echo ========================================
echo React Native Android Build
echo ========================================
echo.
echo Before running this script, make sure you have:
echo 1. Android SDK installed
echo 2. Android Emulator running OR connected Android device
echo 3. ANDROID_HOME environment variable set
echo.

REM Check if ANDROID_HOME is set
if "%ANDROID_HOME%"=="" (
    echo ERROR: ANDROID_HOME is not set!
    echo.
    echo To fix this:
    echo 1. Install Android SDK from https://developer.android.com/studio
    echo 2. Set ANDROID_HOME environment variable to your SDK location
    echo    Example: C:\Android\Sdk
    echo.
    pause
    exit /b 1
)

echo ANDROID_HOME is set to: %ANDROID_HOME%
echo.
echo Building and installing on Android...
echo.

cd /d C:\Users\Vinicius\StudioProjects\filae
npm run android

pause

