<template>
  <modal
    :animationType="'slide'"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'flex-end', alignItems:'center', paddingBottom:30}">
      <view class="background-content" :style="{ width: widthScreen - 20, minHeight: 200, borderRadius: 10, }">        
          <view :style="{height: 50, alignItems: 'center', justifyContent: 'center', opacity:opacity}">
            <text :style="{fontWeight:'bold'}">キャッシュの削除</text>
          </view>
          <view :style="{flex:1, paddingLeft:20, paddingRight:20,   }">
            <text :style="{textAlign:'center', color:'#363737', lineHeight:20, fontSize:13}">ダウンロードしたデータのキャッシュを削除します。削除することでアプリの使用容量が削減される可能性があります。ユーザ固有のデータには影警ありません。</text>
          </view>
          <view :style="{flexDirection:'row', borderTopColor: '#91A3B1', borderTopWidth: 0.5,}">
            <touchable-opacity
            :onPress="() =>clearCache()"
            :style="{height: 50, flex:5, alignItems: 'center', justifyContent: 'center', }">
              <text :style="{color:'red',fontSize:17, }">削除する</text>          
            </touchable-opacity>          
          </view>        
      </view>
      <view class="background-content" :style="{ width: widthScreen - 20, height: 50, borderRadius: 10, marginTop:10 }">        
        <touchable-opacity
           :onPress="() =>hideModal()"
           :style="{height: 50, alignItems: 'center', justifyContent: 'center', borderLeftColor:'#91A3B1', borderLeftWidth:1} ">            
            <text :style="{ color:'#10559A', fontSize:17}">閉じる</text>
          </touchable-opacity>
        </view>
    </view>
  </modal>
</template>
<script>
import AsyncStorage from '@react-native-community/async-storage'
import { mapActions, mapGetters } from 'vuex'
  import {Modal, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Alert} from 'react-native';
  export default {
    components: {
      Modal, TouchableOpacity, TouchableWithoutFeedback
    },
     data() {
      return {
        widthScreen: Dimensions.get('window').width,
        modalVisible: false,                
        opacity: 0.4        
      }
    },
    computed: {
      ...mapGetters({
        historyReading: 'booksLocal/currentReadingSection',        
        readStories: 'booksLocal/getStories',
      })
    },    
     methods: {
       ...mapActions({
      clearCacheBook: 'booksLocal/clearCacheBook'
    }),
       showModal() {
        this.modalVisible = true
      },
      hideModal() {        
        this.modalVisible = false
      },
      async clearCache(){      
            
      let arr = {}
      this.historyReading.books.map(book=>{        
        let readStoriesList = this.readStories(book.book.id)  
        arr[book.book.id]=readStoriesList
      })      

        for (const bookId in arr) {
          if (Object.hasOwnProperty.call(arr, bookId)) {            
            arr[bookId].map(async story=>{              
              await AsyncStorage.removeItem(`@ReadingHistory:${bookId}_${story}`)        
            })
            }
          }
          setTimeout(() => {            
            Alert.alert("",'キャッシュがクリアされました')      
          }, 700);
              this.hideModal()      
         }      
  } 
}
</script>

<style>
  .background-modal {
    backgroundColor: rgba(128, 128, 128, 0.5);
  }
  .background-content {
    backgroundColor: #fff;
    borderRadius: 0.5;
  }
  .line {
     backgroundColor: rgb(196, 194, 194)
  }
  .container{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
</style>
