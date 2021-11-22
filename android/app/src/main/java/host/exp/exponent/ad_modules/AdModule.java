package host.exp.exponent.ad_modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AdModule extends ReactContextBaseJavaModule
{
  //constructor
  public AdModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }


  @Override
  public String getName()
  {
    return getClass().getSimpleName();
  }

  void log(String message)
  {
    getReactApplicationContext()
            .getJSModule( DeviceEventManagerModule.RCTDeviceEventEmitter.class )
            .emit( "log", message );
  }
}