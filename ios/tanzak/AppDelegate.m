// Copyright 2015-present 650 Industries. All rights reserved.

#import "AppDelegate.h"

#import <AppLovinSDK/AppLovinSDK.h>
#import "RNSplashScreen.h"
#import <Firebase.h>


@implementation AppDelegate

// Put your app delegate methods here. Remember to also call methods from EXStandaloneAppDelegate superclass
// in order to keep Expo working. See example below.
 - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
    }
    [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];


    [[ALSdk shared] initializeSdkWithCompletionHandler:^(ALSdkConfiguration *configuration) {
        // AppLovin SDK is initialized, start loading ads
    }];

    [super application:application didFinishLaunchingWithOptions:launchOptions];
//    [RNSplashScreen show];
    return YES;
}

@end
