<template>
  <view>
    <nb-button transparent :onPress="showModal" :style="styleImage">
      <image
        resizeMode="contain"
        :style="{ alignSelf: styleImage.alignItems, width: 15, height: 25 }"
        :source="source"
      />
    </nb-button>
    <modal-option ref="modalOption" 
     :navigation="navigation"
     :currentStory="CurrentStory"
     :storyDetail="StoryDetail"
     :stories="Stories"
     :previous="PreviousRoute"
     :read="Read"
     :related_books="related_books"
     />
  </view>
</template>

<script>
import Config from "../../common/Config.js";
import { Share, Platform } from "react-native";
import ModalOption from "./ModalOption";

export default {
  props: ["type", "bookId", "styleProps","navigation","CurrentStory","StoryDetail","Stories","PreviousRoute","Read","related_books", "newModeReading"],
  components: { ModalOption },
  data() {
    return {
      source: null,
      Config: Config,
      styleImage: null,
      OneLink: {
        Staging: "https://tanzak.onelink.me/M8Pn/af854e3d", // for local vs staging test
        Production: "https://tanzak.onelink.me/FWVh/19d649a9",
      },      
    };
  },
  created() {
    if (!this.styleProps) {
      this.styleImage = { alignSelf: "flex-end" };
    } else {
      this.styleImage = this.styleProps;
    }
    if (this.type == "black") {
      this.source = require("../../../assets/images/up_black.png");
    } else {
      this.source = require("../../../assets/images/share_icon_2.png");
    }

    if(this.newModeReading){
      this.source = require("../../../assets/images/menu_option.png");
    }
  },
  methods: {
    async showModal() {
      if(this.newModeReading){
        //show modal
        this.$refs.modalOption.showModal();
      }else{
        try {
          const result = await Share.share({
          // message for local vs staging test
          // message: `| サクッと読めるベストセラー小説アプリ『TanZak』| https://tanzak.onelink.me/M8Pn/af854e3d?book_id=${this.bookId}&af_force_deeplink=true`

          // message for honban
          message: `| サクッと読めるベストセラー小説アプリ『TanZak』| ${this.OneLink.Production}?book_id=${this.bookId}&af_force_deeplink=true`
        })
        } catch (error) {
          alert(error.message)
        }
      }
    },
    },
};
</script>
