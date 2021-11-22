import AsyncStorage from '@react-native-community/async-storage'

export async function saveDataLocal(key, data){
  try {
    await AsyncStorage.mergeItem(key, JSON.stringify(data))
  } catch (error) {
    console.log('Error save data local')
  }
}

export async function getDataFromLocal(key){
  try {
    let value = await AsyncStorage.getItem(key)

    return JSON.parse(value)
  } catch (error) {
    console.log('Error get data local')
  }
}

export async function saveDataSetting(key, data){
  try {
    await AsyncStorage.setItem(key, data.toString())
  } catch (error) {
    console.log('Error save data local')
  }
}

export async function getDataSetting(key){
  try {
    let value = await AsyncStorage.getItem(key)
    return !!JSON.parse(value)
  } catch (error) {
    console.log('Error get data local')
  }
}