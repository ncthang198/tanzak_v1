export default {
  URL: {
    // api: 'https://api.kaznat.jp',
    api: 'http://52.197.57.44',
    webroot: '' // http://domain-web-view
  },

  // config for Firebase, use to sync user data across device and favorite post
  Firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    messagingSenderId: '',
    readlaterTable: ''
  },

  // Appsflyer for Test only
  DEV_KEY_APPSFLYER: 'CEpvzyecbyQyEAYxnGd8Fg',
  APPSFLYER_ID_TEST_IOS: "1465367033" // Production
  // APPSFLYER_ID_TEST_IOS: "id002402400" // Dev
}

export const COUNT_DOWN_TIMER = 40*60 // 40 minutes

export const SUPPORT_MAIL_ADDRESS = 'support@tanzak.jp'

export const COIN_FULL = 30

export const BUY_COIN = 100

export const KEY_HASH256 = 'e30f46951413866e1ded38eb03177b11';

export const EXPIRE_TOKEN_TIME = 7258118400 // Year 2200

export const REWARDED_AD_UNIT_ID = 'ca-app-pub-3940256099942544/5224354917'
export const REWARDED_AD_UNIT_ID_IOS = 'ca-app-pub-8484192467277627/4038583407'

export const Sticker = [
  {
    id: 1,
    static: require('../../assets/stamp/01.png'),
    animate: 'https://media.giphy.com/media/4BJCvMoLPePq8/giphy.gif'
  },
  {
    id: 2,
    static: require('../../assets/stamp/02.png'),
    animate: 'https://media.giphy.com/media/Mvi1ZqG17NSso/giphy.gif'
  },
  {
    id: 3,
    static: require('../../assets/stamp/03.png'),
    animate: 'https://media.giphy.com/media/xUPGcqFkj0v3uGsm1G/giphy.gif'
  },
  {
    id: 4,
    static: require('../../assets/stamp/04.png'),
    animate: 'https://media.giphy.com/media/4BJCvMoLPePq8/giphy.gif'
  },
  {
    id: 5,
    static: require('../../assets/stamp/05.png'),
    animate: 'https://media.giphy.com/media/Mvi1ZqG17NSso/giphy.gif'
  },
  {
    id: 6,
    static: require('../../assets/stamp/06.png'),
    animate: 'https://media.giphy.com/media/xUPGcqFkj0v3uGsm1G/giphy.gif'
  },
]

export const AutoSticker = {
  stamp_7: {
    static: require('../../assets/auto-stamp/07.png')
  },
  stamp_8: {
    static: require('../../assets/auto-stamp/08.png')
  },
  stamp_9: {
    static: require('../../assets/auto-stamp/09.png')
  },
  stamp_11: {
    static: require('../../assets/auto-stamp/11.png')
  },
}
// export const Sticker = [
//   {
//     id: 1,
//     static: require('https://2.pik.vn/2019237866e0-2868-4194-be5a-91e399ea3032.png'),
//     animate: 'https://media.giphy.com/media/4BJCvMoLPePq8/giphy.gif'
//   },
//   {
//     id: 2,
//     static: 'https://2.pik.vn/20196fb1d76e-5a3f-4969-9b19-bdde8c632e3a.png',
//     animate: 'https://media.giphy.com/media/Mvi1ZqG17NSso/giphy.gif'
//   },
//   {
//     id: 3,
//     static: 'https://2.pik.vn/2019e0983ce0-9ce9-4202-ae82-172f2cb24edb.png',
//     animate: 'https://media.giphy.com/media/xUPGcqFkj0v3uGsm1G/giphy.gif'
//   },
// ]

export const APPLOVIN_ID_TEST_IOS = '9b7d134a6b8835a4'
export const APPLOVIN_ID_TEST_ANDROID = '76d52fc5ff4f0bf6'

// Honban
export const IAP_PRODUCT_ID = 'com.bnk.tanzak'

// Staging
// export const IAP_PRODUCT_ID = 'com.acvhcm.tanzaku'


export const LIST_COIN_COST = [
  {
    key: `${IAP_PRODUCT_ID}.coin120`,
    cost: 120,
    coin: 120,
    savingCoin: 0
  },
  {
    key: `${IAP_PRODUCT_ID}.coin660`,
    cost: 610,
    coin: 610,
    savingCoin: 60
  },
  {
    key: `${IAP_PRODUCT_ID}.coin1320`,
    cost: 1220,
    coin: 1220,
    savingCoin: 120
  },
  {
    key: `${IAP_PRODUCT_ID}.coin2760`,
    cost: 2440,
    coin: 2440,
    savingCoin: 360
  },
  {
    key: `${IAP_PRODUCT_ID}.coin5600`,
    cost: 4900,
    coin: 4900,
    savingCoin: 800
  },
  {
    key: `${IAP_PRODUCT_ID}.coin11800`,
    cost: 10000,
    coin: 10000,
    savingCoin: 2000
  }
]

export const IDFV_PERMISSED = [
  '44745A19-C145-4AC0-B74D-B8BA5714E67D',
  '30B61B1F-91A7-42FA-9FEB-5502D291D3BF',
  '51001DD8-A9BD-4171-BA0C-4CA32324004C',
  'EEBB57D5-1AC1-42FC-89F8-BAAA37A3A505',
  '6885e96c193fa8b4',
  'd3fbda8bef1cd487',
  '19728389-37C7-4498-8D77-BF5254DA500E'
]
