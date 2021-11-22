package host.exp.exponent;


import com.appsflyer.reactnative.BuildConfig;
import com.appsflyer.reactnative.RNAppsFlyerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.react.ReactPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import org.unimodules.core.interfaces.Package;
import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
import host.exp.exponent.generated.BasePackageList;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// import expo.modules.analytics.segment.SegmentPackage;
// import expo.modules.appauth.AppAuthPackage;
// import expo.modules.backgroundfetch.BackgroundFetchPackage;
// import expo.modules.barcodescanner.BarCodeScannerPackage;
// import expo.modules.camera.CameraPackage;
// import expo.modules.constants.ConstantsPackage;
// import expo.modules.contacts.ContactsPackage;
// import expo.modules.facedetector.FaceDetectorPackage;
// import expo.modules.filesystem.FileSystemPackage;
// import expo.modules.font.FontLoaderPackage;
// import expo.modules.gl.GLPackage;
// import expo.modules.google.signin.GoogleSignInPackage;
// import expo.modules.localauthentication.LocalAuthenticationPackage;
// import expo.modules.localization.LocalizationPackage;
// import expo.modules.location.LocationPackage;
// import expo.modules.medialibrary.MediaLibraryPackage;
// import expo.modules.permissions.PermissionsPackage;
// import expo.modules.print.PrintPackage;
// import expo.modules.sensors.SensorsPackage;
// import expo.modules.sms.SMSPackage;
// import expo.modules.taskManager.TaskManagerPackage;
import io.invertase.notifee.NotifeePackage;
import okhttp3.OkHttpClient;


// import expo.modules.ads.admob.AdMobPackage;
// Needed for `react-native link`
// import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactApplication;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

public class MainApplication extends ExpoApplication implements ReactApplication {

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }
   @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        // TODO: add native modules!

        // Needed for `react-native link`
        // new MainReactPackage(),
            new AsyncStoragePackage(),
            new RNAppsFlyerPackage(),
            new SplashScreenReactPackage(),
            new InAppBillingBridgePackage(),
            new AppLovin(),
            new RNDeviceInfo(),
            new ReactNativeFirebaseAppPackage(),
            new ReactNativeFirebaseMessagingPackage(),
            new NotifeePackage(),
            new FastImageViewPackage()
    );
  }

  public List<Package> getExpoPackages() {
    return new BasePackageList().getPackageList();
  }
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new ReactNativeFirebaseAppPackage(),
              new ReactNativeFirebaseMessagingPackage(),
              new NotifeePackage()
      );
    }
  };
  @Override
  public String gcmSenderId() {
    return null;
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }
}

