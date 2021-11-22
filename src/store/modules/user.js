import axios from 'axios';
import Vue from "vue-native-core";
import story from '../../seeds/story'
import { COUNT_DOWN_TIMER } from '../../common/Config.js';
import {Platform, NativeModules, Alert } from 'react-native'
const { InAppUtils } = NativeModules
import InAppBilling from "react-native-billing"
import DeviceInfo from 'react-native-device-info';
import Constants from 'expo-constants'
import iapReceiptValidator from 'iap-receipt-validator';
const password = '2145cae3ecec4c8d913dc13828c15f09'; // Shared Secret from iTunes connect
const isProduction = false; // true = prod, false = sandbox
const validateReceipt = iapReceiptValidator(password, isProduction);
import MD5 from "crypto-js/md5";
import appsFlyer from 'react-native-appsflyer';
import { writeLog } from '../../common/helper.js'

// initial state
const state = {
  currentUser: null,
  timeLeft: null,
  allowAds: null,
  report: {
    pv_top: 0,
    pv_tags: 0,
    pv_tag_detail: 0,
    pv_book_detail: 0,
    top_book_cover_click: 0, // Except when click to history section
    first_read_date: null,
    second_read_date: null
  },
  currentSubscription: null,
  deepLinkBookId: null,
  deepLinkFetchDone: false,
  externalLink: null,
  showWebview: false, 
  isLoading: false,
  noti_type: null
}

// getters
const getters = {
  currentUser: state => {
    return state.currentUser
  },
  isLoading: state => {
    return state.isLoading;
  },
  currentSubscription: state => {
    return state.currentSubscription
  },
  timeCountDown: state => {
    return state.timeLeft
  },
  notificationType: state => {
    return state.noti_type
  },
  totalCoin: state => {
    if(state.currentUser) {
      const paid_life = (state.currentUser.paid_life) ? state.currentUser.paid_life : 0
      const free_life = (state.currentUser.free_life) ? state.currentUser.free_life : 0
      try {
        return paid_life + free_life
      } catch(err) {
        console.log(err)
      }
    }
  },
  // countdownCoin: state => {
  //   if(state.currentUser){
  //     return state.currentUser.coin_from_countdown
  //   }
  //   return 0
  // },
  getStatusAds: state => state.allowAds,
  deepLinkBookId: state => state.deepLinkBookId,
  deepLinkFetchDone: state => state.deepLinkFetchDone,
  externalLink: state => state.externalLink,
  showWebview: state => state.showWebview
}

// actions
const actions = {
  checkExpireAds ({commit}, coin) {
    return new Promise((resolve, reject) => {
      axios.get('/api/show_ads').then(({data: res}) => {
        commit('updateAdStatus', res.data.status)
        resolve(res.data.status)
      }).catch(error => { })
    })
  },
  setLoading({commit}, isLoadding){
    commit('updateLoading', isLoadding)
  },
  decrementCoin ({commit}, coin) {
    axios.get(`/api/coins/minus_coins_pay/?coin_pay=${coin}`).then(({data: res}) => {
      commit('updateCoin', {free: res.data.free_life, paid: res.data.paid_life})
      if(res.data.time_rest > 0)
        Vue.prototype.$root_cowndown(res.data.time_rest)
    }).catch(error => { console.log('src/store/modules/user.js', error)})
  },
  updateNotificationType ({commit}, notificationType) {
    commit('setNotificationType', notificationType)
  },
  incrementPageViews ({commit}, screen){
    commit('incrementPageViews', screen)
  },
  sendReportToServer({commit, state}){
    axios.post(`/api/reports/update_page_view`, state.report).then(({data: res}) => {
      commit('resetPageViews')
    })
  },
  async getCurrentSubscription({commit}){
    if(Platform.OS=="ios"){
      InAppUtils.receiptData(async (error, receiptData)=> {          
        if(error){
          commit('updateCurrentSubscription', null)
        }else{
          await axios.post('/api/users/subscription',{
            receipt: receiptData
          }).then(async (rs) => {
            if (rs.status === 200) {
              if(rs.data.status==404){
                commit('updateCurrentSubscription', null)
              }else{
                commit('updateCurrentSubscription', rs.data.data)
              }
            }else{
              commit('updateCurrentSubscription', null)  
            }      
          }).catch(async (error) => {     
            commit('updateCurrentSubscription', null)
          })
        }
      })
    }else{
      await axios.post('/api/users/subscription').then(async (rs) => {
        if (rs.status === 200) {
          if(rs.data.status==404){
            commit('updateCurrentSubscription', null)
          }else{
            commit('updateCurrentSubscription', rs.data.data)
          }
        }else{
          commit('updateCurrentSubscription', null)
        }      
      }).catch(async (error) => {     
        commit('updateCurrentSubscription', null)
      })
    }
  },
  async mergeSubscription({commit}){  
    commit('updateLoading', true)
    if(Platform.OS == 'ios'){
      actions.restoreSubscriptionIOS(commit);
    }else{
      actions.restoreSubscriptionAndroid(commit);
    }
  },
  async restoreSubscriptionAndroid(commit){
    await InAppBilling.close()
    await InAppBilling.open()
    await InAppBilling.loadOwnedPurchasesFromGoogle()
    // const isSub = await InAppBilling.isSubscribed('subscription.1months');
    const subscriptions = await actions.getSubscriptions();
    const listOwnerProducts = await InAppBilling.listOwnedSubscriptions();
    if(listOwnerProducts.length === 0) {
      commit('updateLoading', false)
      alert('サブスクリプションがみつかりません')
    } else {
      for(let i = 0 ; i < subscriptions.length ;i++){
        const subscription = subscriptions[i];
        if(listOwnerProducts.includes(subscription.key)){
          const is = await actions.checkIsSub(subscription.key);
          if(is){
            InAppBilling.getSubscriptionTransactionDetails(subscription.key).then((detail) => {
              axios.get(`/api/subscription_by_transaction_identifier/${MD5(detail.orderId).toString()}`).then((res)=> {
                const sub = res.data.data;
                actions.moveDevice(sub,commit)
                commit('updateLoading', false)
              }).catch(() => {
                commit('updateLoading', false)
              });
            }).catch(() => {
              commit('updateLoading', false)
            })
          }
        }
      }
    }
    
    // await InAppBilling.close()
  },
  async checkIsSub(productId){
    await InAppBilling.loadOwnedPurchasesFromGoogle()
    return InAppBilling.getSubscriptionTransactionDetails(productId).then(async (detail) => {
      return detail.autoRenewing;
    }).catch(async () => {
      return false;
    })
  },
  async getSubscriptions(){
    return axios.get('/api/subscriptions').then((res) => {
      return res.data.data
    }).catch(() => {
      return []
    })
  },
  async restoreSubscriptionIOS(commit){
    InAppUtils.restorePurchases(async (error, products)=> {

      if(products.length === 0){
        commit('updateLoading', false)
        setTimeout(() => {
          alert('サブスクリプションが見つかりません。')
        }, 500)
        return;
      }
      const originalTransactionIdentifier = (products[0]) ? products[0].originalTransactionIdentifier : null;
      let  receiptDataMD = MD5(originalTransactionIdentifier).toString();
      axios.get(`/api/subscription_by_transaction_identifier/${receiptDataMD}`).then( (res)=> {
        const sub = res.data.data;
        commit('updateLoading', false)
        actions.moveDevice(sub,commit)
      }).catch(() => {
        commit('updateLoading', false)
        alert('サブスクリプションが見つかりません。')
      });
    });
  },
  async moveDevice(sub, commit){
    try {
      if(state.currentUser.id !=  sub.user_id){
        axios.post('/api/subscriptions', {subscriptionId: sub.subscription_id,transaction_identifier: sub.transaction_identifier, logs: 'Change device'}).then((rs) => {
          commit('updateCurrentSubscription', rs.data)
          commit('updateLoading', false)
          setTimeout(() => {
            alert('プレミアムプランの引き継ぎに成功しました。')
          }, 500)
        }).catch((error) => {
          commit('updateCurrentSubscription', null)
          commit('updateLoading', false)
          setTimeout(() => {
            alert('プレミアムプランの引き継ぎに成功しました。')
          }, 500)
        });
      }else{
        commit('updateLoading', false)
        setTimeout(() => {
          alert("プレミアムプランは同じ端末になります。")
        }, 500)
      }
    } catch (error) {
      commit('updateLoading', false)
      setTimeout(() => {
        alert('プレミアムプランの引き継ぎに失敗しました。')
      }, 500)
      
    }
  },
  async subscription({commit},sub){
    commit('updateLoading', true)
    if(Platform.OS == 'ios'){
      await actions.iosPaySub(sub, commit)
    }else{
      await actions.androidPaySub(sub, commit)
    }
  },
  async androidPaySub(subscription, commit){
    try {
      await InAppBilling.close() 
      await InAppBilling.open()
      commit('updateLoading', false)
      const details = await InAppBilling.subscribe(subscription.key_test)
      //to do call back to server
      actions.paymentSubscription(subscription, details, commit);            
      // await InAppBilling.consumePurchase(subscription.key)
      await InAppBilling.close()
    } catch (error) {
      actions.writeLog({ event: 'PURCHASE SUB ANDROID ERROR', value: error, log_type: 'error' })
      // alert('エラー', '課金に失敗しました。') 
    }
  },
  async iosPaySub(subscription, commit){
    writeLog( axios,  { event: 'IOS_PAY_SUB', value: subscription, log_type: 'info' })
    let item =  {
      cost: subscription.amount,
      key: subscription.key_test,
      savingCoin: 0,
    }
    await InAppUtils.canMakePayments(async(canMakePayments) => {      
      if(!canMakePayments) {
        writeLog( axios,  { event: 'CREATE_IOS_TRANSACTION_SUB', value: "NOT_ALLOW_MAKE_PAYMENT", log_type: 'error' })
        setTimeout(() => {
          Alert.alert('禁じられている', 'このデバイスは購入できません。 デバイスの制限を確認してください');
        }, 700);
        return;
      }
    })
    let productIdentifier = item.key
      InAppUtils.loadProducts([productIdentifier], (error, products) => {        
        commit('updateLoading', false)
        if(error){
          Alert.alert('エラー', '課金に失敗しました。')
          actions.writeLog({ event: 'IOS_LOAD_PRODUCTS_ERROR', value: error, log_type: 'info' })
        }        
        InAppUtils.purchaseProduct(productIdentifier,async(error, response) => {
          if(error){
            actions.writeLog({ event: 'PURCHASE_SUB_IOS_ERROR', value: error + productIdentifier, log_type: 'error' })
            console.log(error, 'payment error')
            Alert.alert('エラー', '課金に失敗しました。') // Payment with errors !!!
          }
          if(response){            
            actions.writeLog({ event: 'PURCHASE_SUB_IOS_SUCCESS', value: response, log_type: 'info' })
          }
          // NOTE for v3.0: User can cancel the payment which will be available as error object here.c
          if(response && response.productIdentifier) {
            //unlock store here.            
            await this.paymentSubscription(subscription, response, commit)
          }else{
            actions.writeLog({ event: 'PURCHASE_SUB_IOS_RESPONSE', value: "response.productIdentifier invalid", log_type: 'error' })
          }
        });
      });
  },
  async paymentSubscription(subscription, logs, commit){        
    actions.writeLog({ event: 'PAYMENT_SUBSCRIPTION', value: subscription, log_type: 'info' })
    let transaction_identifier = (Platform.OS == 'ios') ? MD5(logs.originalTransactionIdentifier).toString() : MD5(logs.orderId).toString();
    logs.transactionReceipt= '';
                    const eventName = `af_purchase_${subscription.key}`
                    const eventValues = {
                      "af_content_id": subscription.id,
                      "af_currency":"JPY",
                      "af_revenue": JSON.stringify(subscription.amount)
                     }                    
    await axios.post('/api/subscriptions', {subscriptionId: subscription.id,transaction_identifier: transaction_identifier, logs: JSON.stringify(logs)}, {maxContentLength: 4096})
    .then((rs) => {            
      commit('updateCurrentSubscription', rs.data)
      commit('updateLoading', false)
    }).catch((error) => {      
      commit('updateCurrentSubscription', null)
      commit('updateLoading', false)
    });
  },
  async writeLog(params) {    
      axios.post('/api/logs/write_debug', {...params, device: Constants.deviceName + '=' + DeviceInfo.getUniqueId() })      
    // axios.get('/api/logs/write', { params: {...params, device: Constants.deviceName + '=' + DeviceInfo.getUniqueID()} })
    
  },
  /** end sub */
  /** logic cancel sub */
  async checkSubScription({commit}) {     
    try{            
      const subscription = await actions.currentSubscription(commit);      
      // console.log("subscription exist in server: ", subscription)
      if(!subscription) {
        
      }else{                        
        await actions.isSubscription(commit,subscription.key)
      }
    }catch(error){
      writeLog( axios,  { event: 'CHECK_SUB_SCRIPTION_ERROR', value: error, log_type: 'error' })          
    }
    
  },
  async cancelSubscription(commit){
    await axios.post('/api/users/subscription',{
      is_cancel: 1
    }).then(async (rs) => {
      if(rs.status==200){
        writeLog( axios,  { event: 'CANCEL_SUBSCRIPTION', value: "cancle subscript cause don't error purchase", log_type: 'info' })          
        commit('updateCurrentSubscription', null)
      }
    }).catch(error=>{
    })
  },
  async isSubscription(commit,productId){
    if(Platform.OS == 'ios'){
      InAppUtils.loadProducts([productId], (error, products) => {
        InAppUtils.receiptData((error, receiptData)=> {
          if(error) {
            writeLog( axios,  { event: 'CHECK_SUB_SCRIPTION_ERROR', value: error, log_type: 'error' })          
            actions.cancelSubscription(commit)
          }
        });
      });
      
    }else{
      await InAppBilling.close()
      await InAppBilling.open()
      await InAppBilling.loadOwnedPurchasesFromGoogle()
      const isSub = await InAppBilling.isSubscribed(productId);
      if(isSub === false){
        actions.cancelSubscription(commit)  
      }
      await InAppBilling.close()
    }
  },
  async currentSubscription(commit) {   
    console.log("start check sub")
    return new Promise((resolve, reject) => {
      if(Platform.OS=="ios"){
        InAppUtils.receiptData(async (error, receiptData)=> {          
          // console.log("receiptData: ", receiptData)
          if(receiptData){
            axios.post('/api/users/subscription',{
              receipt: receiptData
            }).then(async (rs) => {
              console.log(rs.data, "ios check sub")
              if (rs.status === 200) {
                if(rs.data.status==404){
                  return resolve(null)
                }else{
                  return resolve(rs.data.data);
                }
              }else{
                return reject(error)
              }      
            }).catch(async (error) => {     
              return reject(error)
            })
          }else{
            axios.post('/api/users/subscription').then(async (rs) => {
              console.log(rs.data, "ios check sub")
              if (rs.status === 200) {
                if(rs.data.status==404){
                  return resolve(null)
                }else{
                  return resolve(rs.data.data);
                }
              }else{
                return reject(error)
              }      
            }).catch(async (error) => {     
              return reject(error)
            })
          }
        })
      }else{
        axios.post('/api/users/subscription').then(async (rs) => {
          if (rs.status === 200) {
            let { data } = rs.data;  
            if(rs.data.status==404){              
              return resolve(null)
            }else{
              return resolve(rs.data.data);
            }
          }else{
            return reject(error)
          }      
        }).catch(async (error) => {     
          console.log(error, "error")
          return reject(error)
        })
      }
    })
    // return this.cancelSubscription(commit) 
    
  },
  /** end  */
  reportReadingStoryDate({ commit }){
    commit('reportReadingStoryDate')
  },
  setDeepLinkBookId({ commit }, bookId) {
    commit('setDeepLinkBookId', bookId)
  },
  updateDeepLinkFetchDone({ commit }, status) {
    commit('updateDeepLinkFetchDone', status)
  },
  updateExternalLink({ commit }, link) {
    commit('updateExternalLink', link)
  },
  updateShowWebview({ commit }, status) {
    commit('updateShowWebview', status)
  }
}

// mutations
const mutations = {
  updateCurrentSubscription (state, subscription) {
    state.currentSubscription = subscription
  },
  setNotificationType (state, notificationType) {
    state.noti_type = notificationType
  },
  saveUser (state, user) {
    state.currentUser = user
    state.timeLeft = user.time_rest
  },
  setCountdown (state, time) {
    state.timeLeft = time
  },
  updateAdStatus (state, status) {
    state.allowAds = status
  },
  updateLoading (state, isLoading){
    state.isLoading = isLoading
  },
  incrementCoin (state) {
    state.currentUser = {...state.currentUser, free_life: state.currentUser.free_life + 1}
  },
  // incrementCoinFromCountDown (state) {
  //   state.currentUser.coin_from_countdown = state.currentUser.coin_from_countdown + 1
  // },
  updateCoin (state, coin) {
    state.currentUser.paid_life = coin.paid
    state.currentUser.free_life = coin.free
  },
  incrementPageViews(state, screen) {
    state.report[screen] = state.report[screen] + 1
  },
  resetPageViews(state){
    state.report = {
      pv_top: 0,
      pv_tags: 0,
      pv_tag_detail: 0,
      pv_book_detail: 0,
      top_book_cover_click: 0
    }
  },
  reportReadingStoryDate(state){
    if(!state.report['first_read_date'] || !state.report['second_read_date']) {
      state.report['first_read_date'] = new Date()
      state.report['second_read_date'] = new Date()
    }
  },

  setDeepLinkBookId(state, bookId){
    state.deepLinkBookId = bookId
  },

  updateDeepLinkFetchDone(state, status) {
    state.deepLinkFetchDone = status
  },

  updateExternalLink(state, link) {
    state.externalLink = link
  },

  updateShowWebview(state, status) {
    state.showWebview = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
