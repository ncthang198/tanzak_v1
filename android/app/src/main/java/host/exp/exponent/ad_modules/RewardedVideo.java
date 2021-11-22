package host.exp.exponent.ad_modules;

import android.os.Handler;
import android.os.Looper;
import androidx.annotation.Nullable;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxReward;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.applovin.mediation.MaxRewardedAdListener;
import com.applovin.mediation.ads.MaxRewardedAd;

import android.util.Log;
import com.applovin.sdk.AppLovinErrorCodes;

public abstract class RewardedVideo extends ReactContextBaseJavaModule implements MaxRewardedAdListener {

    private MaxRewardedAd rewardedAd;
    private static final String REACT_CLASS = "RewardedVideo";

    public static final String EVENT_AD_LOADED = "rewardedVideoAdLoaded";
    public static final String EVENT_AD_FAILED_TO_LOAD = "rewardedVideoAdFailedToLoad";
    public static final String EVENT_AD_OPENED = "rewardedVideoAdOpened";
    public static final String EVENT_AD_CLOSED = "rewardedVideoAdClosed";
    public static final String EVENT_AD_LEFT_APPLICATION = "rewardedVideoAdLeftApplication";
    public static final String EVENT_REWARDED = "rewardedVideoAdRewarded";
    public static final String EVENT_VIDEO_STARTED = "rewardedVideoAdVideoStarted";
    public static final String EVENT_VIDEO_COMPLETED = "rewardedVideoAdVideoCompleted";
    public static final String EVENT_REWARD_USER = "rewardedVideoDidRewardUser";

    private Promise mRequestAdPromise;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public RewardedVideo(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void setAdUnitId(final String adUnitId)
    {
        Log.e("adUnitId", adUnitId);
        rewardedAd = MaxRewardedAd.getInstance("76d52fc5ff4f0bf6", getCurrentActivity());
    }

    @ReactMethod
    public void initAd(final Promise promise)
    {
        Log.e("oeuaoeu", "enter");

        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
          public void run() {
//            if(rewardedAd != null && rewardedAd.isReady()) {

//              rewardedAd = MaxRewardedAd.getInstance("76d52fc5ff4f0bf6", getCurrentActivity());
              rewardedAd.setListener(RewardedVideo.this);
              rewardedAd.loadAd();
              promise.resolve(null);
//            } else {
//               promise.reject("E_AD_NOT_READY", "Ad is not ready.");
//            }
          }
        });
    }

    @ReactMethod
    public void showAd(final Promise promise)
    {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
          public void run() {
            if(rewardedAd.isReady()) {
                //rewardedAd.delegate = RewardedVideo.this;
                rewardedAd.showAd();
                promise.resolve(null);
            } else {
                promise.reject("E_AD_NOT_READY", "Ad is not ready.");
            }
          }
        });
    }

    // MAX Ad Listener
    @Override
    public void onAdLoaded(final MaxAd maxAd)
    {

        sendEvent(EVENT_AD_LOADED, null);

        // Rewarded ad is ready to be shown. rewardedAd.isReady() will now return 'true'
    }
//    @Override
    public void onAdLoadFailed(final String adUnitId, final int errorCode)
    {
        final Handler handler = new Handler();
        handler.postDelayed( new Runnable()
        {
            @Override
            public void run()
            {
                rewardedAd.loadAd();
            }
        }, 3000 );
        String errorString = "ERROR_UNKNOWN";
        String errorMessage = "Unknown error";
        switch (errorCode) {
            case AppLovinErrorCodes.FETCH_AD_TIMEOUT:
                errorString = "ERROR_CODE_FETCH_AD_TIMEOUT";
                errorMessage = "The network conditions prevented the SDK from receiving an ad";
                break;
            case AppLovinErrorCodes.UNABLE_TO_RENDER_AD:
                errorString = "ERROR_CODE_UNABLE_TO_RENDER_AD";
                errorMessage = "There has been a failure to render an ad on screen";
                break;
            case AppLovinErrorCodes.UNSPECIFIED_ERROR:
                errorString = "ERROR_CODE_UNSPECIFIED_ERROR";
                errorMessage = "The system is in unexpected state";
                break;
//            case AppLovinErrorCodes.UNABLE_TO_PREPARE_NATIVE_AD:
//                errorString = "ERROR_CODE_UNABLE_TO_PREPARE_NATIVE_AD";
//                errorMessage = "There was an error while attempting to render a native ad";
//                break;
            case AppLovinErrorCodes.UNABLE_TO_PRECACHE_RESOURCES:
                errorString = "ERROR_CODE_UNABLE_TO_PRECACHE_RESOURCES";
                errorMessage = "An attempt to cache a resource to the filesystem failed; the device may be out of space.";
                break;
            case AppLovinErrorCodes.UNABLE_TO_PRECACHE_IMAGE_RESOURCES:
                errorString = "ERROR_CODE_UNABLE_TO_PRECACHE_IMAGE_RESOURCES";
                errorMessage = "An attempt to cache an image resource to the filesystem failed; the device may be out of space.";
                break;
            case AppLovinErrorCodes.UNABLE_TO_PRECACHE_VIDEO_RESOURCES:
                errorString = "ERROR_CODE_UNABLE_TO_PRECACHE_IMAGE_RESOURCES";
                errorMessage = "An attempt to cache a video resource to the filesystem failed; the device may be out of space.";
                break;
            case AppLovinErrorCodes.NO_NETWORK:
                errorString = "ERROR_CODE_NETWORK_ERROR";
                errorMessage = "The ad request was unsuccessful due to network connectivity.";
                break;
            case AppLovinErrorCodes.NO_FILL:
                errorString = "ERROR_CODE_NO_FILL";
                errorMessage = "The ad request was successful, but no ad was returned due to lack of ad inventory.";
                break;
        }

        WritableMap event = Arguments.createMap();
        WritableMap error = Arguments.createMap();
        Log.e("########", errorMessage);

        event.putString("message", errorMessage);
        sendEvent(EVENT_AD_FAILED_TO_LOAD, event);
        mRequestAdPromise.reject(errorString, errorMessage);

        // Rewarded ad failed to load. We recommend re-trying in 3 seconds.
//        final Handler handler = new Handler();
//        handler.postDelayed( new Runnable()
//        {
//            @Override
//            public void run()
//            {
//                rewardedAd.loadAd();
//            }
//        }, 3000 );
    }
//    @Override
    public void onAdDisplayFailed(final MaxAd maxAd, final int errorCode)
    {
        // Rewarded ad failed to display. We recommend loading the next ad
        rewardedAd.loadAd();
    }

    @Override
    public void onAdDisplayed(final MaxAd maxAd) {}

    @Override
    public void onAdClicked(final MaxAd maxAd) {}

    @Override
    public void onAdHidden(final MaxAd maxAd)
    {
        // rewarded ad is hidden. Pre-load the next ad
//        rewardedAd.loadAd();
        sendEvent(EVENT_AD_CLOSED, null);

    }

    @Override
    public void onRewardedVideoStarted(final MaxAd maxAd) {}
    @Override
    public void onRewardedVideoCompleted(final MaxAd maxAd) {}

    @Override
    public void onUserRewarded(final MaxAd maxAd, final MaxReward maxReward)
    {
        // Rewarded ad was displayed and user should receive the reward
        sendEvent(EVENT_REWARD_USER, null);
    }
}
