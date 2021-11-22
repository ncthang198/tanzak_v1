import {Platform, NativeModules, Alert } from 'react-native'
const { InAppUtils } = NativeModules
import InAppBilling from "react-native-billing"
import DeviceInfo from 'react-native-device-info';
import Constants from 'expo-constants'

export default class SubscriptionService {
  constructor(axios){
    this.axios = axios;
  }
  async checkSubScription() {
    this.writeLog(this.axios, { event: 'CHECK SUBSCRIPTION SERVICE', value: "get subscript exist", log_type: 'info' })
    const subscription = await this.currentSubscription();
    if(!subscription) {
      this.writeLog(this.axios, { event: 'CHECK SUBSCRIPTION SERVICE', value: "SUBSCRIPTION NULL", log_type: 'info' })
      return null;
    }
    await this.isSubscription(subscription.key)
    return subscription;
  }

  async isSubscription(productId){
    if(Platform.OS == 'ios'){
      InAppUtils.receiptData((error, receiptData)=> {
      if(error) {
        this.writeLog(this.axios, { event: 'ERROR GET RECEIPTDATA', value: error, log_type: 'error' })
        this.cancelSubscription()
      }
    });
    }else{
      await InAppBilling.open()
      await InAppBilling.loadOwnedPurchasesFromGoogle()
      InAppBilling.getSubscriptionTransactionDetails(productId).then((detail) => {
        if(detail.autoRenewing === false){
          this.cancelSubscription()  
        }
      }).catch((error) => {
        this.cancelSubscription()
      })
    }
  }
  async cancelSubscription(){
    await this.writeLog(this.axios, { event: 'CANCEL SUBSCRIPTION', value: "cancle subscript cause don't have receipt data", log_type: 'info' })          
    await this.axios.delete('/api/remove_user_subscription')
  }
  async currentSubscription() {  
    return await this.axios.get('/api/users/subscription').then(async (rs) => {
      if (rs.status === 200) {
        let { data } = rs.data;
        return data;
      }
      return null;
    }).catch(async (error) => {
      return null;
    })
  }
  async subscription(subscription){
    if(Platform.OS == 'ios'){
      await this.iosPaySub(subscription)
    }else{
      await this.androidPaySub(subscription)
    }
  }
  async androidPaySub(subscription){
    try {
      await InAppBilling.close() 
      await InAppBilling.open()
      details = await InAppBilling.subscribe(subscription.key)
      //to do call back to server
      this.paymentSubscription(subscription, details);
      await InAppBilling.consumePurchase(subscription.key)
      await InAppBilling.close()
    } catch (error) {
      throw new error
    }
  }
  async iosPaySub(subscription){
    let item =  {
      cost: subscription.amount,
      key: subscription.key,
      savingCoin: 0,
    }
    await InAppUtils.canMakePayments(async(canMakePayments) => {
      if(!canMakePayments) {
        setTimeout(() => {
          Alert.alert('禁じられている', 'このデバイスは購入できません。 デバイスの制限を確認してください');
        }, 700);
        return;
      }
      let productIdentifier = item.key
      InAppUtils.loadProducts([productIdentifier], (error, products) => {
        if(error){
          this.writeLog({ event: 'PAYMENT IOS LOAD PRODUCTS ERROR', value: error, log_type: 'info' })
        }
        InAppUtils.purchaseProduct(productIdentifier,async(error, response) => {
          if(error){
            this.writeLog({ event: 'PURCHASE IOS ERROR', value: error + productIdentifier, log_type: 'error' })
            alert('エラー', '課金に失敗しました。') // Payment with errors !!!
            return;
          }
          if(response){
            this.writeLog({ event: 'PURCHASE IOS RESPONSE', value: response, log_type: 'info' })
          }
          // NOTE for v3.0: User can cancel the payment which will be available as error object here.c
          if(response && response.productIdentifier) {
            //unlock store here.
            await this.paymentSubscription(subscription, response)
          }
        });
      });
    })
  }
  async paymentSubscription(subscription, logs){
    await this.axios.post('/api/subscriptions', {subscriptionId: subscription.id, logs: JSON.stringify(logs)});
  }
  async writeLog(params) {
    // this.axios.get('/api/logs/write', { params: {...params, device: Constants.deviceName + '=' + DeviceInfo.getUniqueID()} })
    axios.post('/api/logs/write_debug', {...params, device: Constants.deviceName + '=' + DeviceInfo.getUniqueId() })
  }
}