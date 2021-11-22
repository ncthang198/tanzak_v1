<template>
  <view :style="{ flex: 1 }">
    <modal-progress :isLoading="_isLoading" />
    <header-image
      :navigation="navigation"
      :goBack="true"
      :main="{ text: 'コイン購入' }"
    />
    <image-background
      resizeMode="cover"
      :source="backgroundImg"
      :style="{ flex: 1 }"
    >
      <scroll-view>
        <view :style="{ backgroundColor: '#FFF' }">
          <view class="container-header" :style="{ marginTop: 0 }">
            <view
              :style="{ borderBottomWidth: 2, paddingLeft: 2, paddingRight: 2 }"
            >
              <text class="text-header" :style="{ fontSize: normalize(20) }"
                >お得なプレミアムプラン !</text
              >
            </view>
            <view
              :style="{
                width: 10,
                height: 10,
                position: 'absolute',
                bottom: 7,
                left: widthScreen / 2 - 10,
                borderLeftWidth: 10,
                borderLeftColor: 'transparent',
                borderRightWidth: 10,
                borderRightColor: 'transparent',
                borderTopWidth: 10,
                borderTopColor: 'black',
              }"
            ></view>
            <view
              :style="{
                width: 10,
                height: 10,
                position: 'absolute',
                bottom: 7,
                left: widthScreen / 2 - 7,
                borderLeftWidth: 7,
                borderLeftColor: 'transparent',
                borderRightWidth: 7,
                borderRightColor: 'transparent',
                borderTopWidth: 7,
                borderTopColor: 'white',
              }"
            >
            </view>
          </view>
          <view :style="{ paddingLeft: 90, alignItems: 'flex-start' }">
            <view :style="{ position: 'relative' }">
              <text class="text-endow">・全作品読み放題</text>
              <view :style="borderText"></view>
            </view>
            <view :style="{ position: 'relative' }">
              <text class="text-endow">・会員限定ストーリー</text>
              <view :style="borderText"></view>
            </view>
            <view :style="{ position: 'relative' }">
              <text class="text-endow">・特典画像公開</text>
              <view :style="borderText"></view>
            </view>
            <view :style="{ position: 'relative' }">
              <text class="text-endow">・広告非表示</text>
              <view :style="borderText"></view>
            </view>
          </view>
          <view :style="{ padding: 25, alignItems: 'center' }">
            <touchable-opacity
              :style="{ height: 65, width: '100%' }"
              :onPress="() => handlePaySubscription(subscriptions[1])"
            >
              <image
                resizeMode="contain"
                :style="{ width: '100%', height: 65, paddingBottom: 0 }"
                :source="buttonPlan"
              />
            </touchable-opacity>
            <text :style="{ marginTop: 3, color: 'dimgray', fontSize: 12 }"
              >無料体験後、１ヶ月ごとに￥780が課金されます。</text
            >
          </view>
          <view
            v-for="(subscription, index) in subscriptions"
            :key="index.toString()"
            :style="{
              padding: 15,
              backgroundColor: '#FFF',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }"
            class="borderTopStyle"
          >
            <view :style="{ flex: 1, flexDirection: 'row' }">
              <view :style="{ flex: 2, flexDirection: 'row' }">
                <view
                  :style="{ flexDirection: 'row', justifyContent: 'center' }"
                >
                  <nb-text
                    :style="{ fontSize: normalize(21), fontWeight: 'bold' }"
                  >
                    {{
                      subscription.duration +
                      subscription_count_units[subscription.unit]
                    }}読み放題
                  </nb-text>
                </view>
                <view
                  v-if="index > 0"
                  :style="{ flexDirection: 'row', alignItems: 'center' }"
                >
                  <view
                    class="triangle"
                    :style="{ flexDirection: 'row' }"
                  ></view>
                  <view class="textFree">
                    <text
                      :style="{
                        color: 'white',
                        fontWeight: '900',
                        fontSize: normalize(12),
                      }"
                      >7日間無料</text
                    >
                  </view>
                </view>
                <view
                  :style="{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }"
                >
                  <touchable-opacity
                    :onPress="() => handlePaySubscription(subscription)"
                  >
                    <view
                      :style="{
                        width: 80,
                        height: 30,
                        backgroundColor: '#2A5E83',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }"
                    >
                      <nb-text
                        :style="{ color: '#fff', fontSize: smallTextSizeSub }"
                      >
                        {{
                          showTextSubscription(
                            subscription.amount,
                            subscription.duration,
                            subscription_units[subscription.unit]
                          )
                        }}
                      </nb-text>
                    </view>
                  </touchable-opacity>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view>
          <view class="container-header">
            <view
              :style="{ borderBottomWidth: 2, paddingLeft: 2, paddingRight: 2 }"
            >
              <text class="text-header" :style="{ fontSize: normalize(20) }"
                >コインを購入して続きを読もう！</text
              >
            </view>
            <view
              :style="{
                width: 10,
                height: 10,
                position: 'absolute',
                bottom: 7,
                left: widthScreen / 2 - 10,
                borderLeftWidth: 10,
                borderLeftColor: 'transparent',
                borderRightWidth: 10,
                borderRightColor: 'transparent',
                borderTopWidth: 10,
                borderTopColor: 'black',
              }"
            ></view>
            <view
              :style="{
                width: 10,
                height: 10,
                position: 'absolute',
                bottom: 7,
                left: widthScreen / 2 - 7,
                borderLeftWidth: 7,
                borderLeftColor: 'transparent',
                borderRightWidth: 7,
                borderRightColor: 'transparent',
                borderTopWidth: 7,
                borderTopColor: 'white',
              }"
            >
            </view>
          </view>
          <view
            v-for="(coinCost, index) in listCoinCost"
            :key="index.toString()"
            :style="{
              padding: 15,
              backgroundColor: '#FFF',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }"
            :class="{ borderBottomStyle: index != listCoinCost.length - 1 }"
          >
            <view :style="{ flex: 1, flexDirection: 'row' }">
              <view :style="{ flex: 2 }">
                <view
                  :style="{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }"
                >
                  <view :style="{ flex: 1 }">
                    <image
                      resizeMode="contain"
                      :style="{ width: 26, height: 26 }"
                      :source="coinIcon"
                    />
                  </view>
                  <nb-text :style="{ fontSize: 22, flex: 3 }">
                    {{ formatNumber(coinCost.coin) }}
                  </nb-text>
                </view>
              </view>
              <view
                :style="{
                  alignItems: 'flex-start',
                  flex: 3,
                  justifyContent: 'center',
                }"
              >
                <nb-text v-if="coinCost.savingCoin > 0">
                  <nb-text :style="{ fontSize: smallTextSize }">おまけ</nb-text>
                  <nb-text
                    :style="{ fontWeight: '700', fontSize: smallTextSize }"
                    >{{ formatNumber(coinCost.savingCoin) }}</nb-text
                  >
                  <nb-text :style="{ fontSize: smallTextSize }">コイン</nb-text>
                </nb-text>
              </view>
              <view
                :style="{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }"
              >
                <touchable-opacity :onPress="() => handlePay(coinCost)">
                  <view
                    :style="{
                      width: 72,
                      height: 30,
                      backgroundColor: '#2A5E83',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                    }"
                  >
                    <nb-text
                      :style="{ color: '#fff', fontSize: smallTextSize }"
                    >
                      ￥{{ formatNumber(coinCost.cost) }}
                    </nb-text>
                  </view>
                </touchable-opacity>
              </view>
            </view>
          </view>
          <view :style="{ marginTop: 10, padding: 20 }">
            <nb-text
              :style="{
                color: '#555555',
                fontSize: normalize(10),
                textAlign: 'justify',
                lineHeight: 20,
              }"
              >{{ regulations }}</nb-text
            >
          </view>
          <view
            :style="{
              flex: 1,
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 18,
              paddingBottom: 18,
            }"
          >
            <nb-grid>
              <nb-col :style="{ paddingRight: 8 }">
                <nb-button
                  :on-press="() => openLinking('https://tanzak.jp/psa')"
                  block
                  :style="buttonStyle"
                >
                  <nb-text :style="buttonTextStyle"
                    >特定商取引法に基づく表示</nb-text
                  >
                </nb-button>
              </nb-col>
              <nb-col :style="{ paddingLeft: 8 }">
                <nb-button
                  :on-press="() => openLinking('https://tanzak.jp/asct')"
                  block
                  :style="buttonStyle"
                >
                  <text :style="buttonTextStyle">資金決済法に基づく表示</text>
                </nb-button>
              </nb-col>
            </nb-grid>
            <nb-grid>
              <nb-col :style="{ paddingRight: 8, marginTop: 10 }">
                <nb-button
                  :on-press="
                    () => openLinking('https://tanzak.jp/subscription/')
                  "
                  block
                  :style="buttonStyle"
                >
                  <nb-text :style="buttonTextStyle"
                    >定額読み放題について</nb-text
                  >
                </nb-button>
              </nb-col>
              <nb-col :style="{ paddingLeft: 8, marginTop: 10 }">
                <nb-button
                  :on-press="() => openLinking('https://tanzak.jp/term/')"
                  block
                  :style="buttonStyle"
                >
                  <text :style="buttonTextStyle">利用規約</text>
                </nb-button>
              </nb-col>
            </nb-grid>
          </view>
        </view>
      </scroll-view>
    </image-background>
  </view>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import HeaderImage from "../../components/share/HeaderImage.vue";
import { LIST_COIN_COST } from "./../../common/Config";
import CoinIcon from "../../../assets/images/coin_icon.png";
import CircleArrow from "../../../assets/images/icon_arrow_cricle.png";
import ButtonPlan from "../../../assets/stamp/07.png";
import Background from "../../../assets/top/bg_top.png";
import { Platform, Alert } from "react-native";
import { formatNumber, writeLog, normalize } from "../../common/helper.js";
import { NativeModules, Linking, Dimensions } from "react-native";
const { InAppUtils } = NativeModules;
import InAppBilling from "react-native-billing";
import ModalProgress from "../../components/share/ModalProgress.vue";
import appsFlyer from "react-native-appsflyer";
import { IDFV_PERMISSED } from "./../../common/Config";
import Constants from "expo-constants";
import DeviceInfo from "react-native-device-info";
import React from "react";
import {
  SUBSCRIPTION_UNIT,
  SUBSCRIPTION_COUNT_UNIT,
  SUBSCRIPTION_REGULATIONS,
} from "../../common/Constant.js";

export default {
  props: {
    navigation: {
      type: Object,
    },
  },
  components: {
    HeaderImage,
    ModalProgress,
  },
  data() {
    return {
      smallTextSize: Platform.OS === "android" ? 12 : 14,
      smallTextSizeSub: Platform.OS === "android" ? 10 : 12,
      listCoinCost: LIST_COIN_COST,
      coinIcon: CoinIcon,
      cricleArrow: CircleArrow,
      backgroundImg: Background,
      buttonStyle: {
        height: 38,
        backgroundColor: "#2A5E83",
        alignItems: "center",
        justifyContent: "center",
      },
      buttonTextStyle: {
        fontSize: Platform.OS === "android" ? 12 : 14,
        color: "#fff",
        alignItems: "center",
        paddingLeft: 2,
        paddingRight: 2,
      },
      topArrow: Platform.OS === "android" ? 53.5 : 50,
      topArrowCoin: Platform.OS === "android" ? 53.6 : 46,
      isLoading: false,
      idfv_permissed: IDFV_PERMISSED,
      widthScreen: Dimensions.get("window").width,
      subscriptions: [],
      subscription_units: SUBSCRIPTION_UNIT,
      subscription_count_units: SUBSCRIPTION_COUNT_UNIT,
      regulations: SUBSCRIPTION_REGULATIONS,
      borderText: {
        height: 10,
        backgroundColor: "#ff7d7d",
        marginTop: Platform.OS === "android" ? -18 : -13,
        marginLeft: 28,
        marginRight: 5,
        zIndex: -1,
      },
      buttonPlan: ButtonPlan,
    };
  },
  methods: {
    fetchSubscriptionsApi() {
      this.axios
        .get("api/subscriptions")
        .then((res) => {
          this.subscriptions = res.data.data;
        })
        .catch((error) => {
          this.writeLog(this.axios, {
            event: "GET SUBSCRIPTIONS ERROR",
            value: error,
            log_type: "info",
          });
        });
    },
    showTextSubscription(amount, duration, unit) {
      if (duration > 1) {
        durationText = duration;
        unit = unit == "月" ? "ヶ月" : unit;
      } else {
        durationText = "";
      }
      return "￥" + formatNumber(amount) + "/" + durationText + unit;
    },
    formatNumber,
    writeLog,
    normalize,

    ...mapMutations({
      updateCoin: "user/updateCoin",
    }),
    ...mapActions({
      updateExternalLink: "user/updateExternalLink",
      updateShowWebview: "user/updateShowWebview",
      _getCurrentSubscription: "user/getCurrentSubscription",
      _subscription: "user/subscription",
    }),

    openLinking(url) {
      this.updateExternalLink(url);
      this.updateShowWebview(true);
      return;
    },
    async handlePaySubscription(subscription) {
      if (this.isLoading) return;
      await this.axios.post("/api/logs/event_log", {
        event: "BUY_SUBCRIPTION",
        value: subscription,
        device: Constants.deviceName + "=" + DeviceInfo.getUniqueId(),
        log_type: "info",
      });
      await this._subscription(subscription);
      await this._getCurrentSubscription();
    },
    // Step 1: create new transaction
    // Step 2: Increase coin
    iosPaymentCallback(item, purchase_response) {
      // write log when purchased
      this.writeLog(this.axios, {
        event: "PAYMENT IOS CALLBACK",
        value: purchase_response,
        log_type: "info",
      });
      this.createIosTransaction(item, purchase_response);
      this.increaseCoin(item, purchase_response["transactionReceipt"]);
    },

    // Step 1: create new transaction
    // Step 2: Increase coin
    iosPaymentCallback_payment_canceled(item, purchase_response) {
      // write log when purchased
      this.writeLog(this.axios, {
        event: "PAYMENT IOS CALLBACK",
        value: purchase_response,
        log_type: "info",
      });
      // this.createIosTransaction(item, purchase_response)
      this.increaseCoin(item, purchase_response);
    },

    // Step 1: create new transaction
    // Step 2: Increase coin
    androidPaymentCallback(item, purchase_response) {
      // write log when purchased
      this.writeLog(this.axios, {
        event: "PAYMENT ANDROID CALLBACK",
        value: purchase_response,
        log_type: "info",
      });
      this.createAndroidTransaction(item, purchase_response);
      this.increaseCoin(item, purchase_response["purchaseToken"]);
    },

    async handlePay(item) {
      if (this.isLoading) return;
      await this.axios.post("/api/logs/event_log", {
        event: "BUY_COIN",
        value: item,
        device: Constants.deviceName + "=" + DeviceInfo.getUniqueId(),
        log_type: "info",
      });
      if (Platform.OS === "android") {
        await this.androiPay(item);
      } else {
        await this.iosPay(item);
      }
    },

    async iosPay(item) {
      this.isLoading = true;
      await InAppUtils.canMakePayments((canMakePayments) => {
        if (!canMakePayments) {
          this.writeLog(this.axios, {
            event: "CREATE_SUB_IOS_TRANSACTION",
            value: "NOT_ALLOW_MAKE_PAYMENT",
            log_type: "error",
          });
          setTimeout(() => {
            Alert.alert(
              "禁じられている",
              "このデバイスは購入できません。 デバイスの制限を確認してください"
            );
          }, 700);
        }
      });

      let productIdentifier = item.key;

      InAppUtils.loadProducts([productIdentifier], (error, products) => {
        if (error) {
          this.writeLog(this.axios, {
            event: "PAYMENT COIN IOS LOAD PRODUCTS ERROR",
            value: error,
            log_type: "info",
          });
          Alert.alert("エラー", "課金に失敗しました。");
        }
        InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
          if (error) {
            if (error.code == "ESKERRORDOMAIN2") {
              let purchaseInStoreKitFlow = false;
              try {
                for (let i = 0; i < 3; i++) {
                  new Promise((res) => setTimeout(res, 2000));
                  // InAppUtils.getPurchaseTransactions finishes the transactions so we dont need to
                  // manually do it
                  shouldClearCurrentTransaction = false;
                  this.writeLog(this.axios, {
                    event: "START ESKERRORDOMAIN2",
                    value: productIdentifier,
                    log_type: "info",
                  });

                  const purchases = InAppUtils.getPurchaseTransactions();
                  this.writeLog(this.axios, {
                    event: "START ESKERRORDOMAIN2 purchases",
                    value: purchases,
                    log_type: "info",
                  });

                  const purchase = purchases.find(
                    (item) => item.productIdentifier === productIdentifier
                  );

                  if (purchase) {
                    purchaseInStoreKitFlow = true;
                    const receiptData = InAppUtils.receiptData();
                    this.iosPaymentCallback_payment_canceled(item, receiptData);
                    break;
                  }

                  this.writeLog(this.axios, {
                    event: "END COIN ESKERRORDOMAIN2",
                    value: productIdentifier,
                    log_type: "info",
                  });
                }
                if (purchaseInStoreKitFlow) {
                  this.writeLog(this.axios, {
                    event: "PURCHASE COIN IOS ESKERRORDOMAIN2 SUCCESS",
                    value: productIdentifier,
                    log_type: "info",
                  });
                } else {
                  Alert.alert("エラー", "課金に失敗しました。");
                  this.writeLog(this.axios, {
                    event: "PURCHASE COIN IOS ESKERRORDOMAIN2 ERROR",
                    value: productIdentifier,
                    log_type: "error",
                  });
                }
              } catch (error) {
                Alert.alert("エラー", "課金に失敗しました。");
                this.writeLog(this.axios, {
                  event: "PURCHASE COIN IOS ESKERRORDOMAIN2 ERROR",
                  value: productIdentifier,
                  log_type: "error",
                });
              }
            } else {
              Alert.alert("エラー", "課金に失敗しました。"); // Payment with errors !!!
              this.writeLog(this.axios, {
                event: "PURCHASE COIN IOS ERROR",
                value: error + productIdentifier,
                log_type: "error",
              });
            }
          }
          if (response) {
            this.writeLog(this.axios, {
              event: "PURCHASE COIN IOS RESPONSE",
              value: response,
              log_type: "info",
            });
          }
          // NOTE for v3.0: User can cancel the payment which will be available as error object here.c
          if (response && response.productIdentifier) {
            //unlock store here.
            this.iosPaymentCallback(item, response);
          }
        });
      });
      this.isLoading = false;
    }, // end iosPay()

    async androiPay(item) {
      const getErrorMessage = (code) =>
        `Purchase or subscribe failed with error: ${code}`;

      // let productIdentifier = `jp.co.shueisha.tanzak.coin${item.coin + item.savingCoin}`
      let productIdentifier = item.key;
      let details;
      try {
        await InAppBilling.close();
        await InAppBilling.open();

        details = await InAppBilling.purchase(productIdentifier);
        this.androidPaymentCallback(item, details);

        await InAppBilling.consumePurchase(productIdentifier);
        await InAppBilling.close();
      } catch (err) {
        this.writeLog(this.axios, {
          event: "PURCHASE COIN ANROID GO TO CATCH",
          value: err.message,
          log_type: "info",
        });

        if (err.message === getErrorMessage(102)) {
          this.writeLog(this.axios, {
            event: "PURCHASE COIN ANROID TWICE",
            value: err.message,
            log_type: "info",
          });
          const productDetails = await InAppBilling.purchase(productIdentifier);
          this.writeLog(this.axios, {
            event: "PURCHASE COIN ANROID productDetails",
            value: productDetails,
            log_type: "info",
          });

          if (productDetails) {
            this.writeLog(this.axios, {
              event: "PURCHASE COIN ANROID PRODUCT DETAILS 2 TIMES",
              value: productDetails,
              log_type: "info",
            });
            this.androidPaymentCallback(item, productDetails);

            await InAppBilling.consumePurchase(productIdentifier);
            await InAppBilling.close();
          } else {
            this.writeLog(this.axios, {
              event: "PURCHASE COIN ANROID ERROR",
              value: err.message,
              log_type: "error",
            });
            alert("課金に失敗しました。"); // Payment with errors !!!
          }
        } else {
          this.writeLog(this.axios, {
            event: "PURCHASE COIN ANROID ERROR",
            value: err.message,
            log_type: "error",
          });
          alert("課金に失敗しました。"); // Payment with errors !!!
        }
      } finally {
        this.writeLog(this.axios, {
          event: "PURCHASE COIN ANROID Finally",
          value: productIdentifier,
          log_type: "info",
        });
        await InAppBilling.consumePurchase(productIdentifier);
        return await InAppBilling.close();
      }
    }, // end androiPay()

    createIosTransaction(item, response) {
      transaction = {
        product_id: response["productIdentifier"],
        transaction_id: response["transactionIdentifier"],
        purchased_at: response["transactionDate"],
        receipt: response["transactionReceipt"],
        coin: item.coin,
      };
      this.axios.post(`api/payments/create_ios_transaction`, transaction);
    },

    createAndroidTransaction(item, response) {
      transaction = {
        product_id: response["productId"],
        transaction_id: response["orderId"],
        purchased_at: response["purchaseTime"],
        receipt: response["purchaseToken"],
        payload: JSON.stringify(response),
        coin: item.coin,
      };
      this.axios
        .post(`api/payments/create_android_transaction`, transaction)
        .then(function (resp) {
          // TODO
          // Only increate coin if new transaction created
          // new_transaction_id = resp.data.data.transaction_id
        })
        .catch(function (error) {});
    },

    increaseCoin(item, receiptData) {
      // API to update coin
      const params = {
        receiptData: receiptData,
        coin_from: "purchase",
        promotion_coin: parseInt(item.savingCoin),
        coin: item.coin,
        os: Platform.OS,
      };

      this.axios
        .put(`api/coins/increase`, params)
        .then((response) => {
          user = response.data.data;
          if (!user.id) {
            this.writeLog(this.axios, {
              event: "INCREASE COIN FALSE",
              value: "",
              log_type: "error",
            });
            return;
          }
          this.writeLog(this.axios, {
            event: "INCREASE COIN SUCCESS",
            value: "",
            log_type: "info",
          });
          this.updateCoin({ paid: user.paid_life, free: user.free_life });
          alert(`You get ${item.coin + item.savingCoin} coin`);
          const eventName = `af_purchase_${item.coin}`;
          const eventValues = {
            af_content_id: item.coin,
            af_currency: "JPY",
            af_revenue: item.cost,
          };          
        })
        .catch((error) => {
          this.writeLog(this.axios, {
            event: "CALL API INCREASE COIN CATCH ERROR",
            value: error,
            log_type: "error",
          });
        });
    },

    showTestPayment() {
      const result = this.idfv_permissed.filter(
        (idfv) => idfv == DeviceInfo.getUniqueId()
      );

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.fetchSubscriptionsApi();
  },
  //   computed: {
  //   ...mapGetters({
  //     currentUser: 'user/currentUser',
  //     _totalCoin: 'user/totalCoin',
  //     currentSubscription: 'user/currentSubscription'
  //   }),

  //   isHaveCode() {
  //     return this.tranferCode != ''
  //   }
  // },
  watch: {
    _isLoading(newVal, oldVal) {
      this._isLoading = newVal;
    },
  },
  computed: {
    ...mapGetters({
      currentSubscription: "user/currentSubscription",
      _isLoading: "user/isLoading",
    }),
  },
};
</script>

<style>
.borderBottomStyle {
  border-bottom-color: #e8e8e8;
  border-bottom-width: 1;
}

.borderTopStyle {
  border-top-color: #e8e8e8;
  border-top-width: 1;
}
.text-header {
  font-weight: bold;
  margin-top: 15;
  padding-bottom: 5;
}

.container-header {
  background-color: white;
  align-items: center;
  margin-top: 15;
  padding-bottom: 15;
  position: relative;
}

.text-endow {
  font-size: 22;
  margin: 10;
  font-weight: 900;
  z-index: 2;
  color: #555555;
}
.text-button {
  font-size: 25;
  font-weight: bold;
}

.border-text {
  height: 10;
  background-color: #fdd100;
  margin-top: -18;
  margin-left: 28;
  margin-right: 5;
  z-index: -1;
}

.triangle {
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-left-width: 5;
  border-right-width: 5;
  border-bottom-width: 10;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: red;
  transform: rotate(-90deg);
}

.textFree {
  border-width: 1;
  background-color: red;
  border-color: red;
  border-radius: 5;
  padding-top: 3;
  padding-bottom: 3;
  padding-left: 8;
  padding-right: 8;
}
</style>
