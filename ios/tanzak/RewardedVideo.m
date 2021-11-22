#import "RewardedVideo.h"

#if __has_include(<React/RCTUtils.h>)
#import <React/RCTUtils.h>
#else
#import "RCTUtils.h"
#endif

@interface RewardedVideo()<MARewardedAdDelegate>
@property (nonatomic, strong) MARewardedAd *rewardedAd;
@end

static NSString *const kEventAdLoaded = @"rewardedVideoAdLoaded";
static NSString *const kEventAdFailedToLoad = @"rewardedVideoAdFailedToLoad";
static NSString *const kEventAdOpened = @"rewardedVideoAdOpened";
static NSString *const kEventAdClosed = @"rewardedVideoAdClosed";
static NSString *const kEventRewarded = @"rewardedVideoAdRewarded";
static NSString *const kEventVideoStarted = @"rewardedVideoAdVideoStarted";
static NSString *const kEventVideoCompleted = @"rewardedVideoAdVideoCompleted";
static NSString *const kEventRewardUser = @"rewardedVideoDidRewardUser";


@implementation RewardedVideo
{
    RCTPromiseResolveBlock _requestAdResolve;
    RCTPromiseRejectBlock _requestAdReject;
    BOOL hasListeners;
}

- (void)startObserving
{
    hasListeners = YES;
}

- (void)stopObserving
{
    hasListeners = NO;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
    return @[
             kEventRewarded,
             kEventAdLoaded,
             kEventAdFailedToLoad,
             kEventAdOpened,
             kEventVideoStarted,
             kEventAdClosed,
             kEventVideoCompleted,
             kEventRewardUser,
            ];
}

RCT_EXPORT_METHOD(setAdUnitId:(NSString *)id)
{
    self.rewardedAd = [MARewardedAd sharedWithAdUnitIdentifier: id];
}
                  
                  
                  
#pragma mark exported methods

RCT_EXPORT_METHOD(initAd:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    _requestAdResolve = resolve;
    _requestAdReject = reject;
//    self.rewardedAd = [MARewardedAd sharedWithAdUnitIdentifier: @"fd54924f62852991"];
    if ([self.rewardedAd isReady]) {
        reject(@"E_AD_ALREADY_LOADED", @"Ad is already loaded.", nil);
    } else {
        self.rewardedAd.delegate = self;
        [self.rewardedAd loadAd];
    }
}

RCT_EXPORT_METHOD(showAd:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if([self.rewardedAd isReady]) {
        self.rewardedAd.delegate = self;
        [self.rewardedAd showAd];
        resolve(nil);
    } else {
        reject(@"E_AD_NOT_READY", @"Ad is not ready.", nil);
    }
}

#pragma mark - MAAdDelegate Protocol

- (void)didLoadAd:(MAAd *)ad
{
    if (hasListeners) {
        [self sendEventWithName:kEventAdLoaded body:nil];
    }
}

- (void)didFailToLoadAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withErrorCode:(NSInteger)errorCode
{
    // Rewarded ad failed to load. We recommend re-trying in 3 seconds.
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 3 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
//        [self.rewardedAd loadAd];
//    });
    if (hasListeners) {
        //[self.rewardedAd loadAd];
        [self sendEventWithName:kEventAdFailedToLoad body:nil];
    }
}

- (void)didDisplayAd:(MAAd *)ad {
    if (hasListeners) {
        [self sendEventWithName:kEventVideoStarted body:nil];
    }
}

- (void)didClickAd:(MAAd *)ad {}

- (void)didHideAd:(MAAd *)ad
{
    // Rewarded ad is hidden. Pre-load the next ad
    if (hasListeners) {
     //[self.rewardedAd loadAd];
        [self sendEventWithName:kEventAdClosed body:nil];
    }
}

- (void)didFailToDisplayAd:(MAAd *)ad withErrorCode:(NSInteger)errorCode
{
    // Rewarded ad failed to display. We recommend loading the next ad
    if (hasListeners) {
        //[self.rewardedAd loadAd];
        [self sendEventWithName:kEventAdFailedToLoad body:nil];
    }
    
}
#pragma mark - MARewardedAdDelegate Protocol

- (void)didStartRewardedVideoForAd:(MAAd *)ad {
    if (hasListeners) {
        [self sendEventWithName:kEventVideoStarted body:nil];
    }
}

- (void)didCompleteRewardedVideoForAd:(MAAd *)ad {}

- (void)didRewardUserForAd:(MAAd *)ad withReward:(MAReward *)reward
{
    if (hasListeners) {
        [self sendEventWithName:kEventRewardUser body:nil];
    }
    
}
@end

