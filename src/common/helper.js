import DeviceInfo from 'react-native-device-info';
import Constants from 'expo-constants'
import {Platform, Dimensions, PixelRatio, Image} from 'react-native'

const WIDTHSCREEN = Dimensions.get('window').width

export function removeElementFromArray(array, element) {
  if (array.includes(element)) {
    array.splice(array.indexOf(element), 1)
  }
  return array
}

export function ParseAuthorData(authors) {
  var array = authors;
  var output = [];
  if(array) {
    array.forEach(function(item) {
      var existing = output.filter(function(v, i) {
        return v.role_name == item.role_name;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].name = output[existingIndex].name.concat(item.name);
      } else {
        let newItem = {}
        if (typeof item.name == 'string')
          newItem = {name: [item.name], role_name: item.role_name}
        output.push(newItem);
      }
    });
  }
  return output
}

/**
*   @param:
 *    height: height need to set
        type: number
 *    smallImage: real size of image, format: "100x200" => height x width
        type: string
      maxBookImage: max size of book image
    @return: size of image need to set
 */
export function getRatioWidthFromHeight(height, smallImage, maxBookImage = null) {
  sizeOfImage = smallImage.split("x")
  ratio = height / sizeOfImage[1]
  width = ratio * sizeOfImage[0]
  if (maxBookImage != null && width > maxBookImage) width = maxBookImage
  return { width, height }
}

export function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function isUnpublish (unPublishDate) {
  let showTime = unPublishDate.getTime() - Date.now()
  return showTime < 1
}

export function writeLog(axios, params) {
  // axios.get('/api/logs/write', { params: {...params, device: Constants.deviceName + '=' + DeviceInfo.getUniqueID()} })
  axios.post('/api/logs/write_debug', {...params, device: Constants.deviceName + '=' + DeviceInfo.getUniqueId() })
}

export function normalize(size) {
  const SCALE = WIDTHSCREEN/320
  const newSize = size*SCALE
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }
}

export function getHeightImage(src, marginLeft, marginRight){ 
  const{width, height} = Image.resolveAssetSource(src);
  heightImage = height/width * (WIDTHSCREEN - marginLeft - marginRight)
  return heightImage
}
