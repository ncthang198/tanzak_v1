<template>
  <view>
    <view v-for="items in handleHtml">
      <nb-row
        :style="{ alignSelf: alignMessages(), flexWrap: 'wrap', marginTop: -10, marginBottom: 8 }"
      >
        <view v-for="item in items">
          <view v-if="isRubyTag(item)">
            <nb-subtitle :allowFontScaling="false" :style="[stylesObj.baseTextStyle, { fontSize: 8, fontWeight: '200', paddingTop: 0, alignSelf: 'center' },addStyleRt(),addStyle(item, 'style-rt')]">
              {{ item['rt'] }}
            </nb-subtitle>
            <nb-title :allowFontScaling="false" class="messages_box" :style="[stylesObj.baseTextStyle, addStyle(item), addStyleRuby()]">
              {{ item['ruby'] }}
            </nb-title>
          </view>
          <view v-else-if="isPTag(item)" :style="[stylesObj.lineStyle, addStyle(item), {paddingRight: 5}]">
            <nb-text>
              {{ item['p'] }}
            </nb-text>
          </view>
          <view v-else-if="isBrTag(item)">
            <text>{{ item['br'] }}</text>
          </view>
          <view
            v-else-if="isDash2Tag(item) && Platform.OS == 'android'"
            :style="stylesObj.centerDash"
          >
            <Dash :style="stylesObj.dash" :dashGap="0" :dashLength="26" />
          </view>
          <view v-else-if="isDash2Tag(item) && Platform.OS == 'ios'" :style="stylesObj.textMessage">
            <nb-subtitle :allowFontScaling="false" :style="[stylesObj.dash2Style.subTitle]">&nbsp;</nb-subtitle>
            <nb-title
              :allowFontScaling="false"
              class="messages_box"
              :style="[stylesObj.baseTextStyle, stylesObj.dash2Style.title]"
            >——</nb-title>
          </view>
          <view v-else>
            <view v-if="isImage(item)">
              <fast-image resizeMode="cover" :style="sizeImage(item)" :source="handleImage(item)" />
            </view>
            <view v-else>
              <view :style="stylesObj.textMessage">
                <nb-subtitle :allowFontScaling="false" :style="{fontSize: 8, paddingTop: 0 }">&nbsp;</nb-subtitle>
                <nb-title
                  :numberOfLines="0"
                  class="messages_box"
                  :style="[getDefaultStyle(item)]"
                >{{ getTextStory(item) }}</nb-title>
                <!-- <nb-title v-if="isItalicTag(item)" class="messages_box" :style="[stylesObj.baseTextStyle, stylesObj.italicStyle, addStyle(item)]">{{ item['i'] }}</nb-title> -->
                <!-- <nb-title v-if="isSpanTag(item)" class="messages_box" :style="[stylesObj.baseTextStyle, addStyle(item)]">{{ item['span'] }}</nb-title> -->
                <!-- <nb-title v-else :allowFontScaling="false" class="messages_box" :style="[stylesObj.baseTextStyle]">{{ item['type'] }}</nb-title> -->
              </view>
            </view>
          </view>
        </view>
      </nb-row>
    </view>
  </view>
</template>
<script>
  import { Dimensions, Platform } from "react-native";
  import DOMParser from 'react-native-html-parser'
  import * as FileSystem from 'expo-file-system'
  import { mapGetters, mapMutations } from 'vuex'
  import Dash from 'react-native-dash';
  import FastImage from 'react-native-fast-image'


  const IS_STORY_CALLER_COLOR = '#000000'
  const NONE_STORY_CALLER_COLOR = '#000000'

  export default {
    props: ['type', 'paragraph', 'nextChapter', 'row', 'other_character', 'isStoryCaller', 'textColor'],
    components: { Dash, FastImage },
    data(){
      return {
      Platform: Platform,
      stylesObj: {
        textMessage: {
          marginLeft: Platform.OS === "android" ? 4 : -4,
          marginBottom: Platform.OS === "android" ? 5 : 0
        },
        centerDash: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        },
        dash: {
          marginLeft: Platform.OS === "android" ? 1 : -4,
          marginBottom: Platform.OS === "android" ? 5 : 0,
          marginTop: 13,
          flexDirection: 'row',
          height: 1,
          width: 25
        },
        imageCharacter: {
          height: 200,
          width: 200
        },
        imageOther: {
          marginLeft: -10,
          width: Dimensions.get('window').width - 20,
          height: Dimensions.get('window').height,
        },
        lineStyle: {
          width: Dimensions.get('window').width - 20,
          height: 0
        },
        baseTextStyle: {
          color: this.handleTextColor(),
          // color: this.isStoryCaller ? '#fff' : '#000000',
          textAlign: this.alignItemMessages(),
          fontFamily: Platform.OS === "android" ? 'Roboto' : undefined
        },
        boldStyle: {
          fontWeight: Platform.OS === "android" ? 'bold' : '900'
        },
        italicStyle: {
          fontStyle: 'italic',
          transform: Platform.OS === "ios" ? [{  scaleX: 1 }, { skewY: '0deg' }, { skewX: '-15deg' }, { scaleY: 1 }, { translateX: 1 }, { translateY: 0 }] : undefined,
          paddingRight: Platform.OS === "android" ? 2 : undefined
        },
        dash2Style: {
          subTitle: { fontSize:  Platform.OS === 'ios' ? 7 : 10 },
          title: { letterSpacing: Platform.OS === 'ios' ? undefined : -3}
        }
      },
      }
    },
    computed: {
      ...mapGetters({
        getPathFile: 'bookDetail/getPathFile',
        getDimensions: 'downloadStory/getDimensions'
      }),
      handleHtml(){
        let doc = new DOMParser.DOMParser()
        // this.paragraph = "牧<ruby style='color: #e83d0d,fontStyle: italic'>野<rt style='color: #628db6,fontStyle: italic,fontWeight: 900'>つ</rt></ruby>くしを演じた<span style='color: #628db6,fontStyle: italic,fontWeight: 900'>日々を振り返る</span>と、今はどのようなお気持ちですか？"
        // this.paragraph = "はと言っ <br> </br><span style='color: #e83d0d'>なんとかさん「こんにちは」がと言った</span>と言ったた「なん <br> </br>とかさんがと言ったた」こんこんにちはと言ったなんとかさんがと言ったこ。んにちはと言った"
        // this.paragraph = "はと言った言<dash2>はと言った</dash2>言こんにちは<dash2>はと言った</dash2><dash2>はと言った</dash2><dash2>はと言った</dash2>と言った"
        // console.log('this.paragraph ',this.paragraph )
        let text_first = this.paragraph.indexOf("<")
        if ( text_first > 0)
          this.isTextFirst(text_first)
        let par = doc.parseFromString(this.paragraph, 'text/html')
        let node = par['childNodes']
        let element = {}
        let html = []
        let html_element = []
        let slice = 0
        let row = this.row
        let index = -row
        let flag = false
        for (var i = 0; i < node['length']; i++) {
          if (node[i]['tagName'] == 'ruby') {
            for (var j =  0; j < node[i]['childNodes']['length']; j++) {
              if(node[i]['childNodes'][j]['tagName'] == 'rt'){
                element['rt'] = node[i]['childNodes'][j]['childNodes'][0]['data']
                element = this.getStyle(element, node[i]['childNodes'][j]['attributes'], 'style-rt')
              } else {
                element['ruby'] = node[i]['childNodes'][j]['data']
                element = this.getStyle(element, node[i]['attributes'])
              }
              if(element['rt'] && element['ruby']) {
                html_element.push(element)
                element = {}
              }
            }
          } else if (node[i]['tagName'] == 'img') {
            if(node[i]['attributes'][0]){
              element['img'] = node[i]['attributes'][0]['value']
              html_element.push(element)
            }
            element = {}
          } else if (node[i]['tagName'] == 'p') {
            if(node[i]['childNodes'][0]){
              element['p'] = node[i]['childNodes'][0]['data']
              element = this.getStyle(element, node[i]['attributes'])
              html_element.push(element)
            } 
            element = {}
          } else if (node[i]['tagName'] == 'br') {
            if(node[i]['childNodes'][0]){
              flag = true
              element['br'] = node[i]['childNodes'][0]['data']
              html_element.push(element)
            }
            element = {}
          } else if (node[i]['tagName'] == 'dash2') {
            if(node[i]['childNodes'][0]){
              element['dash2'] = node[i]['childNodes'][0]['data']
              html_element.push(element)
            }
            element = {}
          } else if (node[i]['tagName'] == 'b') {
            if(node[i]['childNodes'][0]){
              element['b'] = (node[i]['childNodes'][0]['data']) ? node[i]['childNodes'][0]['data'] : ( node[i]['childNodes'][0]['firstChild']['data']) ?  node[i]['childNodes'][0]['firstChild']['data'] : '' 
              element = this.getStyle(element, node[i]['attributes'])
              html_element.push(element)
            }
            element = {}
          } else if (node[i]['tagName'] == 'i') {
            if(node[i]['childNodes'][0]){
              element['i'] = (node[i]['childNodes'][0]['data']) ? node[i]['childNodes'][0]['data'] : ( node[i]['childNodes'][0]['firstChild']['data']) ?  node[i]['childNodes'][0]['firstChild']['data'] : '' 
              element = this.getStyle(element, node[i]['attributes'])
              html_element.push(element)
            }
            element = {}
          } else if (node[i]['tagName'] == 'span') {
            let html_text = (node[i]['childNodes'][0]) && node[i]['childNodes'][0]['data'] ? node[i]['childNodes'][0]['data'] : ''
            let that = this
            html_text.split('').forEach(function(object) {
              element['span'] = object
              element = that.getStyle(element, node[i]['attributes'])
              html_element.push(element)
              element = {}
            })
          } else {
            let html_text = node[i]['data']
            if(html_text.length <= 12 && text_first == -1){
              element['type'] = html_text
              html_element.push(element)
              element = {}
            } else {
              html_text.split('').forEach(function(object) {
                element['type'] = object
                html_element.push(element)
                element = {}
              })
            }
          }
        }
        if (flag == true){
          let comments = []
          let j = 0;
          let item = [];
          let isBr = false;
          for (var i = 0; i < html_element.length; i++) {
            if (html_element[i]['br']) {
              html.push(item);
              j = 0;
              item = [];
              continue;
            }
            j++
            item.push(html_element[i])
            if(this.row === 12){
              if(j === this.row){
                html.push(item);
                j = 0;
                item = [];
              }
            }else{
              if (item[item.length - 1] == html_element[html_element.length - 1]){
                html.push(item)
              }
            }
          }
          let first = ['「','『','【','（','［','｛','〈','《','‘','“'] 
          let last = ['」','』','】','）','］','｝','〉','》','’','”','！','？','!','?','・','：','；','。','、','.',',']
          for (var i = 0; i < html.length; i++) {
            let item = html[i];
            if(item.length === 1 && this.isBrTag(item[0])){
              html.splice(i, 1);
              continue;
            }
            var text_f = html[i][html[i].length - 1]
            var text_l = html[i][0]
            if(text_l === undefined || text_f === undefined){
              continue;
            }
            if(text_f["span"] || text_f["type"] || text_l["span"] || text_l["type"]){
              if((first.indexOf(text_f["span"]) > -1 || first.indexOf(text_f["type"]) > -1) && i < html.length - 1){
                html[i + 1].unshift(text_f)
                html[i].pop()
              }
              if((last.indexOf(text_l["span"]) > -1 || last.indexOf(text_l["type"]) > -1 ) && i > 0){
                // html[i - 1].push(text_l)
                // html[i].shift()
                for(let t = i; t < html.length; t++) {
                  let temp_l = html[t][0]
                  html[t - 1].push(temp_l)
                  html[t].shift()
                }
              }
            }
          }
        } else {
          if (this.row == 12) {
            let item = []
            let j = 0
            let indexEndSpecialCharacter = []
            for (var i = 0; i < html_element.length; i++) {
              item.push(html_element[i])
              if(html_element[i]['dash2'] && j != this.row - 1)
                j++
              j++
              /** start process special character  */
              let nextIndex = i + 1;
              let nextEl = (html_element[nextIndex]) ? html_element[nextIndex] : undefined
              let currentEl = html_element[i]
              let specialCharactor = ['!','?','.',':',';',','];
              if(nextEl && indexEndSpecialCharacter.indexOf(i) === -1 && specialCharactor.indexOf(this.getTextStory(nextEl)) > -1  && specialCharactor.indexOf(this.getTextStory(currentEl)) > -1 ){
                indexEndSpecialCharacter.push(nextIndex);
                j--
              }
              /** end process special character  */
              /** start process first white space  */
              if(j === 1 && this.hasWhiteSpace(this.getTextStory(currentEl)) && this.paragraph.length > this.row){
                item.splice(0, 1)
                j--
              }
              /** end process first white space  */
              if(j == this.row || i == html_element.length - 1){
                html.push(item)
                item = []
                j = 0
              }
            }
            let first = ['「','『','【','（','［','｛','〈','《','‘','“'] 
            let last = ['」','』','】','）','］','｝','〉','》','’','”','！','？','!','?','・','：','；','。','、','.',',']
            let spec2byte = ['「','『','【','（','［','｛','〈','《','」','』','】','）','］','｝','〉','》','！','？','・','：','；','。','、']
            for (var i = 0; i < html.length; i++) {
              var text_f = html[i][html[i].length - 1]
              var text_l = html[i][0]
              if(text_f === undefined || text_l === undefined){
                continue;
              }
              if(text_f["span"] || text_f["type"] || text_l["span"] || text_l["type"]){
                if((first.indexOf(text_f["span"]) > -1 || first.indexOf(text_f["type"]) > -1) && i < html.length - 1){
                  html[i + 1].unshift(text_f)
                  html[i].pop()
                }
                if((last.indexOf(text_l["span"]) > -1 || last.indexOf(text_l["type"]) > -1 ) && i > 0){
                  html[i - 1].push(text_l)
                  html[i].shift()
                }
                const nextLineObject = (i < html.length)  ? html[i + 1] : null;
                const totalMoreText = 12 - html[i].length;
                if(totalMoreText > 0 && nextLineObject){
                  for(let j = 0 ; j < totalMoreText; j ++){
                    const object_next_l = nextLineObject[0]
                    if(!object_next_l) {
                      continue;
                    }
                    const text_l_text = (object_next_l["type"] ) ? object_next_l["type"] : (object_next_l["span"] ) ? object_next_l["span"]  : undefined;
                    if(first.indexOf(text_l_text) < 0 || (first.indexOf(text_l_text) >= 0 && j < (totalMoreText-1))){
                      html[i].push(object_next_l);
                      html[i+1].shift()
                    }
                  }
                }
              }
            }
            for (var i = 0; i < html.length; i++) {
              let lastCurrentCharacter = html[i].slice(-1)[0]
              let nextItem = ( html[i+1]) ?  html[i+1] : null
              let firstNextChracter = (nextItem) ? nextItem[0] : null
             
              if(lastCurrentCharacter && firstNextChracter){
                if(spec2byte.indexOf(this.getTextStory(lastCurrentCharacter)) > -1 && spec2byte.indexOf(this.getTextStory(firstNextChracter)) > -1){
                  html[i+1].unshift(html[i].slice(html[i].length - 2)[0],html[i].slice(-1)[0])
                  html[i].pop();
                  html[i].pop();
                }
              }
            }
          } else {
            html.push(html_element)
          }
        }
        return html
      },
    },
    methods: {
      ...mapMutations({
        setStoryImage: 'stories/setStoryImage'
      }),
      hasWhiteSpace(s) {
        return /\s/g.test(s);
      },
      addStyleRuby(){
        let rubyStyle = {lineHeight: 20,alignSelf: 'center'};
        if(Platform.OS === "android"){
          rubyStyle =  {...rubyStyle, ...{paddingRight: 3, paddingLeft: 3}}
        }
        return rubyStyle;
      },
      addStyleRt(){
        let rubyStyle = {};
        if(Platform.OS === "android"){
          rubyStyle = {paddingRight: 3, paddingLeft: 4}
        }
        return rubyStyle;
      },
      detechJP(text){
        var pHiragana = "[\\u3041-\\u3096\\u309D-\\u309F]|\\uD82C\\uDC01|\\uD83C\\uDE00";
        var pKatakana = "[\\u30A1-\\u30FA\\u30FD-\\u30FF\\u31F0-\\u31FF\\u32D0-\\u32FE\\u3300-\\u3357\\uFF66-\\uFF6F\\uFF71-\\uFF9D]|\\uD82C\\uDC00";
        var pHan = "[\\u2E80-\\u2E99\\u2E9B-\\u2EF3\\u2F00-\\u2FD5\\u3005\\u3007\\u3021-\\u3029\\u3038-\\u303B\\u3400-\\u4DB5\\u4E00-\\u9FD5\\uF900-\\uFA6D\\uFA70-\\uFAD9]|[\\uD840-\\uD868\\uD86A-\\uD86C\\uD86F-\\uD872][\\uDC00-\\uDFFF]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D\\uDC20-\\uDFFF]|\\uD873[\\uDC00-\\uDEA1]|\\uD87E[\\uDC00-\\uDE1D]";
        var rx = new RegExp("^([\\w-]|" + pHiragana + "|" + pKatakana + "|" + pHan + ")+$");
        if(rx.test(text)){
          return true;
        }
        return false;
      },
      detechJPAlphabet(text){
      // const REGEX_JAPANESE = /[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]|[\u4e00-\u9faf]|[\u3400-\u4dbf]/;
        const REGEX_JAPANESE = /[\u3000-\u303f]|[\u30a0-\u30ff]|[\uff00-\uff9f]/;
        if(REGEX_JAPANESE.test(text)){
          return true;
        }
        return false;
      },
      isKatakana(text){
        const REGEX_JAPANESE = /[\u30a0-\u30ff]/;
        if(REGEX_JAPANESE.test(text)){
          return true;
        }
        return false;
      },
      getTextStory(item){        
        if(this.isBoldTag(item)){          
          return item['b']
        }else if(this.isItalicTag(item)){
          return item['i']
        }else if (this.isSpanTag(item)) {
          return item['span'] 
        }else if(this.isBrTag(item)){
          return item['br'] 
        }
        return item['type']
      },
      getDefaultStyle (item){
        let defaultStyle = {...this.stylesObj.baseTextStyle, ...this.addStyle(item), ...this.addStyleSpecial(this.getTextStory(item), item)};
        if(this.isBoldTag(item)){
          if(Platform.OS === "android"){
            defaultStyle =  {...defaultStyle, ...this.stylesObj.boldStyle, ...{lineHeight: 20}}
          }else{
            defaultStyle =  {...defaultStyle, ...this.stylesObj.boldStyle, ...this.addStyleSpecial(item['b'], item)}
          }
        }else if(this.isItalicTag(item)){
          
          defaultStyle =  {...defaultStyle, ...this.stylesObj.italicStyle, ...this.addStyleSpecial(item['i'],item)}
        }else if (this.isSpanTag(item)) {
          defaultStyle =  {...defaultStyle}
        }else{
          defaultStyle = {...defaultStyle, ...this.addStyleSpecial(item['type'],item)}
        }
        return defaultStyle;
      },
      addStyleSpecial(inputtxt, item){
        var style = {}
        const specialCharactor = ['!','？','!','?','・','：','；','。','、','.',','];
        if(specialCharactor.indexOf(inputtxt) >= 0){
         style = {lineHeight: 20}
        }else{
          if(this.isKatakana(inputtxt)){
            style = {lineHeight: 19}
          }else{
            if(this.alphanumeric(inputtxt)){
              if(this.isBoldTag(item)){
                style = {lineHeight: 20}
              }else{
                style = (Platform.OS == 'android') ?  {lineHeight: 20} : {lineHeight: 21}
              }
            }else{
              style = {lineHeight: 19}
            }
          }
        }
        return style;
      },
      getStyle(element, style, rt='style') {
        if(style.length){
          element[rt] = style[0]['value']
        }
        return element
      },
      addStyle(item, rt='style') {
        var style = {}
        if(item[rt]){
          if(item[rt].indexOf('fontStyle:') >= 0)
            style = {...style, ...this.stylesObj.italicStyle}
          if(item[rt].indexOf('fontWeight:') >= 0)
            style = {...style, ...this.stylesObj.boldStyle}
          if(item[rt].indexOf('color:') >= 0){
            var arr = item[rt].split(',')
            for (var i = 0; i < arr.length; i++) {
              if(arr[i].indexOf('color:') >= 0){
                var color = arr[i].split(' ')
                style = {...style, ...{ color: color[color.length - 1] }}
              }
            }
          }
        }
        return style
      },
      addStyleAlphanumeric(inputtxt){
        var style = {}
        if(this.alphanumeric(inputtxt)){
          if(this.detechJP(inputtxt) ){
            style = {lineHeight: 19}
          }else{
            style = {lineHeight: 20}
          }
        }
        return style;
      },
      alphanumeric(inputtxt){
        if(!inputtxt){
          return false;
        }
        var letterNumber = /^[0-9a-zA-Z]+$/;
        if((inputtxt.match(letterNumber))) {
          return true;
        }
        return false; 
      },
      isBrTag(item) {
        return (item["br"]) ? true : false
      },
      isPTag(item) {
        return (item["p"]) ? true : false
      },
      isRubyTag(item) {
        return (item["ruby"]) ? true : false
      },
      isImage(item) {
        return (item["img"]) ? true : false
      },
      isBoldTag(item) {
        return (item["b"]) ? true : false
      },
      isItalicTag(item) {
        return (item["i"]) ? true : false
      },
      isDash2Tag(item) {
        return (item["dash2"]) ? true : false
      },
      isSpanTag(item) {
        return (item["span"]) ? true : false
      },
      isTextFirst(text_first) {
        let first = this.paragraph.slice(0, text_first)
        let end = this.paragraph.slice(text_first, this.paragraph.length)
        this.paragraph = '<span>' + first + '</span>' + end
      },
      viewImage(item) {
        this.setStoryImage({url: this.handleImage(item), size: this.sizeImage(item)})
      },
      handleTextColor(){
        if(this.textColor){
          return this.textColor
        }else{
          return this.isStoryCaller ? IS_STORY_CALLER_COLOR : NONE_STORY_CALLER_COLOR
        }
      },
      handleImage(item) {
        let direct = `${FileSystem.documentDirectory}${this.getPathFile}`
        let path = (item["img"].indexOf("http") == 0) ? item["img"] : direct + item["img"]
        return { uri: path }
      },
      alignMessages() {
        return (this.other_character == 'storyteller_center') ? 'center' : 'flex-start'
      },
       alignItemMessages() {
        return (this.other_character == 'storyteller_center') ? 'center' : 'left'
      },
      sizeImage(item) {
        try {
          if (this.nextChapter) {
            return this.stylesObj.imageNextChapter
          } else if ((this.other_character && this.other_character.includes('storyteller')) || this.type == 'box') {
            // const windowWidth = Dimensions.get('window').width - 20
            let windowWidth = Dimensions.get('window').width
            let marginLeft = 0

            // if(this.type != 'box'){
            //   windowWidth = windowWidth * 0.9
            //   marginLeft = (this.other_character == 'storyteller_center') ? -13 : 0
            // }else {
            //   windowWidth = windowWidth - 20
            //   marginLeft = -12
            // }

            windowWidth = windowWidth - 36 // marginLeft: 18, marginRight: 18
            marginLeft = -13 // because of outbox padding == 13

            const originalWidth = this.getDimensions(item["img"])[0]
            const originalHeight = this.getDimensions(item["img"])[1]
            const widthChange = windowWidth / originalWidth
            const newWidth = (widthChange * originalWidth)
            const newHeight = (widthChange * originalHeight)

            return {
              width: newWidth,
              height: newHeight,
              marginTop: 10,
              marginLeft: marginLeft
            }
          } else {
            const windowWidth = (Dimensions.get('window').width - 20) * 0.7
            const originalWidth = this.getDimensions(item["img"])[0]
            const originalHeight = this.getDimensions(item["img"])[1]
            if(originalWidth <= windowWidth) {
              return {
                width: originalWidth,
                height: originalHeight,
              }
            }
            const widthChange = windowWidth / originalWidth
            const newWidth = (widthChange * originalWidth)
            const newHeight = (widthChange * originalHeight)
            return {
              width: newWidth,
              height: newHeight,
            }
          }
        } catch(err) {
          console.log('calulate dimension', err)
        }
      }
    }
  };
</script>
<style>
.messages_box {
  font-weight: 400;
  font-size: 18;
  /* fontFamily: Roboto; */
  color: #000000;
}
</style>
