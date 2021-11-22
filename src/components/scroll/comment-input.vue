<template>
  <view v-if="loadComment" :style="{alignItems: 'flex-start', justifyContent: 'center'}" >
    <nb-item :style="{backgroundColor: '#fff', borderRadius: 5}">
      <nb-input
        :style="{height: 40}"
        :autoFocus=true
        :maxLength=100
        :onChangeText="(text) => textComment = text"
        returnKeyType='next'
        :multiline=true
      />
      <touchable-opacity :onPress="() => handleTextComment()">
        <image resizeMode="contain" :style="{height: 20}" :source="sendIcon" />
      </touchable-opacity>
    </nb-item>
  </view>
</template>

<script>

  import SendIcon from '../../../assets/images/send_icon.png'

  export default {
    props: {
      book: Object,
      displayComment: Function,
    },
    data: {
      loadComment: false,
      textComment: '',
      sendIcon: SendIcon
    },
    mounted(){
      setTimeout(function () {
        this.loadComment = true
      }.bind(this), 100)
    },
    methods: {
      handleTextComment(){


        const comment = this.textComment.replace(/(\u00a9|\u00ae|[\u2000-\u3040\u309F-\u30A0\u30FF-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '').replace(new RegExp('\r?\n','g'), "<br>  </br>")

        if (comment && comment.length > 0) {
          this.axios.post(`/api/books/${this.book.id}/comment`, {comment: {body: comment}}).then(res => {
            this.displayComment(comment)
            this.textComment = ''
          }).catch(error => {
            console.log(error)
            this.displayComment('Error Message')
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.box-comment{
  border-radius: 5px;
  background-color: #ccc;
}
</style>
