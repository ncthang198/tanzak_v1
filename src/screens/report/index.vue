<template>
  <view :style="{flex: 1, backgroundColor: 'white'}">
    <header-image
      :navigation="navigation"
      :goBack=true
      iconBack='close'
      :main="{text: '通報'}"/>

    <view v-if="showOverlay" class='overlay' :style="{height: heightScreen}" />
    <scroll-view>
    <!-- page content -->
    <view :style="{padding: 15, marginTop: 20}">
      <view class="r-story-title section">
        <text class='label-font'>ストーリー名</text>
        <text class='input-font'>{{ storyTitle }}</text>
      </view>

      <view class='r-options section'>
        <text class='label-font'>問題の種類</text>
        <tanzak-select
          :options="r_type_options"
          :handleParentCallBack="handleReportType"
          placeholder="通報理由を選択してください" />
      </view>

      <view class='r-content section'>
        <text class='label-font'>具体的な内容</text>
        <view class='input-wrapper'>
          <text-input
            class='input-inner'
            :multiline="true"
            :numberOfLines="4"
            :placeholder="selectedReportPlaceholder"
            :onChangeText="text => onChangeText(text)" />
        </view>

      </view>

      <view class='r-desc'>
        <text class='label-font note'>内容が不明瞭な場合は対応できない場合がありますので、詳しい内容をご記入お願いします。</text>
      </view>

      <view class='r-submit section'>
        <nb-button
          :onPress="() => handleSendMailClick()"
          :style="{backgroundColor: '#225e84', marginTop: 10, marginBottom: 8, paddingHorizontal: 10,  alignItems: 'center', justifyContent: 'center'}">
          <text :numberOfLines=1 :class="'text-button'">送信する</text>
        </nb-button>
      </view>

      <view class='r-note'>
        <text class='label-font note'>こちらのフォームは作品別のご意見をいただく場所であり、課金の不具合などアプリ全体に関わる不具合については設定画面のお問い合わせよりご連絡ください。</text>
      </view>
    </view>
    <!-- page content -->
    </scroll-view>

    <inform-modal
      :body="informBody"
      :title="informTitle"
      :isVisible="showInformModal"
    />

  </view>
</template>
<script>
import HeaderImage from "../../components/share/HeaderImage.vue"
import TanzakSelect from "../../components/input/tazak-select"
import InformModal from '../../components/share/tanzak-modal'
import DeviceInfo from 'react-native-device-info'
import { Platform, Dimensions } from 'react-native'

export default {
  props: ['navigation'],
  components: { HeaderImage, TanzakSelect, InformModal },
  data() {
    return {
      heightScreen: Dimensions.get('window').height,
      r_type_options: [
        '発話者間違い',
        '文字の間違い（誤字脱字脱文）',
        '画像の不具合',
        'Cancel'
      ],
      r_type_placeholders: [
        '間違いと思われる発話者名とその文章、正しいと思われる発話者名をご記入ください。',
        '誤字脱字と思われる文章、発話者、その理由などをご記入ください。',
        '画像が表示されないなど、該当箇所と具体的な不具合の内容をご記入ください。'
      ],
      selectedReportType: null,
      selectedReportPlaceholder: null,
      storyTitle: null,
      storyID: null,
      reportContent: null,
      showInformModal: false,
      showOverlay: false,
      informTitle: null,
      informBody: null
    }
  },

  created() {
    this.storyTitle = this.navigation.getParam('story_title')
    this.storyID = this.navigation.getParam('story_id')
  },

  methods: {
    onChangeText(text){
      this.reportContent = text
    },

    goBackAndReload(){
      this.navigation.goBack()
    },

    handleReportType(selected_index){
      this.selectedReportType = selected_index
      this.selectedReportPlaceholder = this.r_type_placeholders[selected_index]
    },

    formInvalid(){
      return this.selectedReportType == null || this.reportContent == null
    },

    showModal(title, body){
      this.showInformModal = true
      this.informTitle = title
      this.informBody = body
      this.showOverlay = true
    },

    closeModal(){
      this.showInformModal = false
      this.showOverlay = false
    },

    async handleSendMailClick(){
        if(this.formInvalid()){
          this.showModal('エラー', '具体的な内容を入力してください')

          setTimeout(() => {
            this.closeModal()
          }, 1000);
          return
        }

        data =  {
          report_type: this.r_type_options[this.selectedReportType],
          report_message: this.reportContent,
          idfv: DeviceInfo.getUniqueId(),
          os: Platform.OS,
          app_version: DeviceInfo.getVersion(),
          story_title: this.storyTitle,
          story_id: this.storyID
        }

        this.axios.post(`/api/feedbacks/report_story`, {
          report: JSON.stringify(data)
        }).then( async function (res) {
        }).catch(function (error) {});

        this.showModal('', `送信完了しました\nご協力ありがとうございます。`)

        setTimeout(() => {
          this.closeModal()
          this.navigation.goBack()
        }, 2000);
    }
  }
}
</script>

<style>
  .section {
    margin-bottom: 30
  }
  .text_header {
    color: #fff;
  }
  .text-button {
    fontWeight: bold;
    fontSize: 17;
    color: #fff;
  }
  .input-wrapper {
    border-width: 1;
    border-color: #c9c7c1;
    border-radius: 8;
    height: 80;
  }
  .input-inner {
    height: 80;
    padding-left: 10;
    padding-right: 10
  }
  .label-font {
    font-size: 12;
    color: #717171;
    margin-bottom: 5;

  }
  .note {
    line-height: 17
  }
  .input-font {
    font-size: 15
  }
  .overlay {
    flex: 1;
    position: absolute;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0.5;
    background-color: black;
    z-index: 10
  }

</style>
