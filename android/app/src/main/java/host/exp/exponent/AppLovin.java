package host.exp.exponent;

import host.exp.exponent.ad_modules.RewardedVideo;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxError;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class AppLovin  implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext)
    {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext)
    {
        return Arrays.<NativeModule>asList(
                new RewardedVideo(reactContext) {
                    //                    @Override
                    public void onAdRevenuePaid(MaxAd ad) {

                    }

                    @Override
                    public void onAdLoadFailed(String adUnitId, MaxError error) {

                    }

                    @Override
                    public void onAdDisplayFailed(MaxAd ad, MaxError error) {

                    }
                }
        );
    }
}
