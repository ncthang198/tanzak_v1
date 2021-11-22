<template>
  <modal
    :animationType="'slide'"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center'}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 200, marginLeft: 40, justifyContent: 'center'}">
        <view :style="{alignItems: 'center'}">
          <nb-text :style="{paddingTop: 20, fontWeight: 'bold'}">{{surveyBody}}</nb-text>
          <nb-text :style="{padding: 20}">
            アンケートにご回答いただくと {{surveyCoin}} コインをプレゼント！
          </nb-text>
          <flat-list
              :data="survey"
              :keyExtractor="(item, index) => index.toString()"
              :style="{paddingBottom: 5, paddingTop: 5}"
            >
              <view render-prop-fn="renderItem"
                :style="{borderTopWidth: 0.2, borderBottomColor: '#E7E7E7'}">
                <touchable-opacity :onPress="() => answerSurvey(args.item)">
                  <view :style="{ width: widthScreen - 80, padding: 13, alignItems: 'center'}">
                    <nb-text :style="{ color: '#0794ff', fontWeight: 'bold'}"> {{ args.item.body }} </nb-text>
                  </view>
                </touchable-opacity>
              </view>
            </flat-list>
        </view>
      </view>
    </view>
  </modal>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex'
  import { Dimensions, Modal, Platform, Alert } from 'react-native'
  import { writeLog } from '../../common/helper.js'

  export default {
    components: {
      Modal
    },
    props: {
      refreshSurvey: Boolean
    },
    data() {
      return {
        widthScreen: Dimensions.get('window').width,
        modalVisible: false,
        survey: null,
        surveyCoin: null,
        surveyBody: null,
        surveyData: null,
      }
    },
    watch: {
      refreshSurvey: {
        handler: function (val) {
          if (val == true) {
            this.getSurveyData()
          }
        },
        deep: true,
      },
    },
    methods: {
      ...mapMutations({
        saveUser: 'user/saveUser',
      }),

      answerSurvey(item) {
        this.modalVisible = false
        this.update_answer_servey(item.id)
      },
      checkClose(event) {

      },
      async update_answer_servey(answer_id){
        self = this
        this.axios.post(`/api/surveys/${this.surveyData.id}/answer/`, {
          answer_id: answer_id
        }).then( async function (res) {
           self.thanksModal()
           await self.amountCurrentCoin()
        }).catch(function (error) {
          writeLog(this.axios, { event: 'answers survey', value: error, log_type: 'error' })
        });

      },

      osModal(data) {
        let self = this
        Alert.alert(
          data.body,
          `アンケートにご回答いただくと${data.coin}コインをプレゼント！`,
          data.answers.map(function(item, i){
            return ({text: item.body, onPress: () => self.update_answer_servey(item.id)})
          })
        )
      },
      thanksModal() {
        Alert.alert(
          '',
          `ご回答ありがとうございました。${this.surveyCoin}コインが届きました！`,
          [
            {text: '閉じる', onPress: () => console.log('閉じる')},
          ]
        )
      },

      async amountCurrentCoin() {
        this.axios.get('/api/coins/amount_current_coin').then( ({data: res}) => {
          this.saveUser(res.data)
        }).catch((error) => console.log("get data failed: ", error))
      },

      async getSurveyData() {
        this.axios.get('/api/survey').then( async ({data: res}) => {
          data = res.data
          this.survey = data.answers
          this.surveyCoin = data.coin
          this.surveyBody = data.body
          this.surveyData = data
          if (this.surveyData.id) {
            if (Platform.OS == "android")
              this.modalVisible = true
            else
              this.osModal(this.surveyData)

          }
        }).catch((error) => console.log("get  data failed: ", error))
      }
    },

    async mounted() {
      this.getSurveyData()
    }
  };

</script>
<style>
  .background-modal {
    backgroundColor: rgba(128, 128, 128, 0.5);
  }
  .background-content {
    backgroundColor: #ececec;
    borderRadius: 2;
  }
</style>
