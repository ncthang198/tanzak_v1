<template>
  <modal :animationType="'slide'" :transparent="true" :visible="modalVisible">
    <view
      :style="{ flex: 1, justifyContent: 'center', alignItems: 'center' }"
    >
      <view
        v-if="modalVisible"
        :style="{
          width: imageHorizontal ? widthScreen * 0.9 : widthScreen * 0.8,
          borderRadius: 10,
        }"
      >
        <touchable-opacity
          :onPress="
            () => {
              handleNavigation();
            }
          "
        >
          <image-background
            :style="{
              width: imageHorizontal ? widthScreen * 0.9 : widthScreen * 0.8,
              height: imageHorizontal
                ? (widthScreen * 0.9) / ratioPopup
                : (widthScreen * 0.8) / ratioPopup,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              overflow: 'hidden',
            }"
            :source="{ uri: popupState.img_url.url }"
          >
          </image-background>
          <view
            :onPress="
              () => {
                handleNavigation();
              }
            "
            :style="{
              height: 55,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#165E83',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }"
          >
            <text
              v-if="popupState.popup_type == 'external_url'"
              :style="{ fontSize: 18, fontWeight: 'bold', color: 'white' }"
              >詳細を見る</text
            >
            <text
              v-if="popupState.popup_type == 'internal_url'"
              :style="{ fontSize: 18, fontWeight: 'bold', color: 'white' }"
              >作品を読</text
            >
          </view>
        </touchable-opacity>
      </view>
      <view :style="{ justifyContent: 'center', alignItems: 'center' }">
        <touchable-opacity
          :style="{ position: 'relative', bottom: -10 }"
          :onPress="
            () => {
              hideModal();
            }
          "
        >
          <image :source="ic_close_button" :style="{ width: 30, height: 30 }" />
        </touchable-opacity>
      </view>
    </view>
  </modal>
</template>
<script>
import {
  Modal,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Share,
  ImageBackground,
  Linking,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import AppLogo from "../../../assets/icon_app.png";
import { mapGetters, mapMutations, mapActions } from "vuex";
import * as LocalStoreData from "../../localstore/story.js";
import SpecificIcon from "../../../assets/images/book-search-3.png";
import SettingModeIcon from "../../../assets/images/settings-2.png";
import ShareIcon from "../../../assets/images/export.png";

import ic_close from "../../../assets/images/btnClose.png";
export default {
  props: ["navigation"],
  components: {
    Modal,
    AirbnbRating,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
  },
  data() {
    return {
      widthScreen: Dimensions.get("window").width,
      heightScreen: Dimensions.get("window").height,
      modalVisible: false,
      popupState: null,
      appLogo: AppLogo,
      star: 0,
      disable: true,
      opacity: 0.4,
      specificIcon: SpecificIcon,
      settingModeIcon: SettingModeIcon,
      shareIcon: ShareIcon,
      ic_close_button: ic_close,
      OneLink: {
        Staging: "https://tanzak.onelink.me/M8Pn/af854e3d", // for local vs staging test
        Production: "https://tanzak.onelink.me/FWVh/19d649a9",
      },
      imageHorizontal: false,
      ratioPopup: 1,
    };
  },
  computed: {
    ...mapGetters({
      nextChapterData: "downloadStory/getNextChapter",
    }),
  },
  async mounted() {
    this.fetchTopApi();
  },
  methods: {
    ...mapActions({
      updateExternalLink: "user/updateExternalLink",
      updateShowWebview: "user/updateShowWebview",
    }),
    fetchTopApi() {
      this.axios
        .get("/api/top")
        .then(({ data: res }) => {
          let popupData = res.data.popup;
          if (popupData.length>0) {
            console.log(popupData[0], "popupData12131")
            Image.getSize(popupData[0].img_url.url, (width, height) => {
              let ratio = width / height;
              if (ratio > 1) {
                this.imageHorizontal = true;
              }
              this.ratioPopup = ratio;
              this.popupState = popupData[0];
              this.showModal();
            });
          }
        })
        .catch((error) => {
          console.log("error top api", error);
        });
    },
    handleNavigation() {
      this.axios
        .put(`/api/popups/${this.popupState.id}/update_click_numbers`)
        .then((res) => {
          if (this.popupState.popup_type == "internal_url") {
            this.navigation.navigate("BookDetail", {
              id: this.popupState.jump_to,
            });
            this.hideModal();
          } else if (this.popupState.popup_type == "external_url") {
            this.updateExternalLink(this.popupState.jump_to);
            this.updateShowWebview(true);
            // Linking.openURL(this.popupState.jump_to)
            this.hideModal();
          }
        })
        .catch((error) => {
          console.log("error top api", error);
        });
    },
    showModal() {
      this.modalVisible = true;
    },
    hideModal() {
      this.modalVisible = false;
    },
    optionStory() {},
    optionScroll() {},
    async handleShare() {
      try {
        const result = await Share.share({
          // message for local vs staging test
          // message: `| サクッと読めるベストセラー小説アプリ『TanZak』| https://tanzak.onelink.me/M8Pn/af854e3d?book_id=${this.bookId}&af_force_deeplink=true`

          // message for honban
          message: `| サクッと読めるベストセラー小説アプリ『TanZak』| ${this.OneLink.Production}?book_id=${this.bookId}&af_force_deeplink=true`,
        });
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>
<style>

</style>
