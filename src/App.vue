<template>
  <root>
    <image-background :source="getSplash()" resizeMode="cover" :style="{flex: 1}" v-if="isSplash">

    </image-background>
    <app-navigation v-else ref="stackrouter" :onNavigationStateChange="handleState"></app-navigation>
    <modal-rating
        ref="modalRating"
      />
  </root>
</template>

<script>
import React from "react";
import { Image, ImageBackground, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import SettingIcon from '../assets/top/t_setting.png'
import HomeIcon from '../assets/top/t_home.png'
import TagIcon from '../assets/top/t_tag.png'
import SettingActiveIcon from '../assets/top/t_setting_active.png'
import HomeActiveIcon from '../assets/top/t_home_active.png'
import TagActiveIcon from '../assets/top/t_tag_active.png'
import RankingIcon from "../assets/top/t_ranking.png"
import RankingActiveIcon from "../assets/top/t_ranking_active.png"
import SearchIcon from "../assets/top/t_search.png"
import SearchIconActive from "../assets/top/t_search_active.png"
import app_splash from "../assets/images/app_splash.png";
import app_splash2 from "../assets/images/app_spash2.png";
import app_splash3 from "../assets/images/app_spash3.png";

import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom, NavigationActions} from "vue-native-router";
import { Root } from "native-base";
import HomeScreen from "./screens/home/index.vue";
import TagsScreen from "./screens/tags/index.vue";
import BookDetailScreen from "./screens/book-detail/index.vue";
import TagDetailScreen from "./screens/tag-detail/index.vue";
import SettingScreen from "./screens/setting/index.vue";
import IconWithBadge from "./Icon-With-Badge.js";
import StoryScreen from "./screens/stories/index.vue";

// scroll 
import ScrollScreen from './screens/scroll/index.vue'

import WebtoonScreen from "./screens/webtoon/index.vue";
import FooterBackground from '../assets/top/bg_footer.png'
import CoinShop from "./screens/coin-shop/index.vue";
import EndStoryScreen from "./screens/end-story/index.vue"
import ReportScreen from "./screens/report/index.vue"
import PremiumPlanScreen from "./screens/premium-plan/index.vue"

import { mapMutations, mapGetters, mapActions } from 'vuex'
import Ranking from "../src/screens/ranking/index.vue"
import NavigationService from "./services/NavigationService.js";
import DeviceInfo from 'react-native-device-info';
import ModalRating from './components/share/ModalRating';
import * as LocalStoreData from './localstore/story.js';


const SettingIconWithBadge = props => {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  return <IconWithBadge {...props} badgeCount={3} />;
};

const FadeTransaction = (index, position) => {
  const sceneRange = [index - 1, index]
  const outputOpacity = [0,1]
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputOpacity
  })

  return { opacity: transition }
}

const BottomTransition = (index, position, height) => {
  const sceneRange = [index - 1, index, index + 1]
  const outputHeight = [height, 0, 0]
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputHeight
  })

  return {
    transform: [{ translateY: transition }]
  }
}

const NavigationConfig = () => {
  return {
    screenInterpolator: (sceneProps) => {
      const position = sceneProps.position
      const scene = sceneProps.scene
      const index = scene.index
      const height = sceneProps.layout.initHeight

      // return FadeTransaction(index, position)
      return BottomTransition(index, position, height)
    }
  }
}

const HomeStack =  StackNavigator(
  {
    Home: HomeScreen,
    BookDetail: BookDetailScreen,
    TagDetail: TagDetailScreen,
    CoinShop,
    PremiumPlanScreen
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    navigationOptions: {
      title: 'ホーム',
    },
  }
);

const TagStack =  StackNavigator(
  {
    Tags: TagsScreen,
    BookDetail: BookDetailScreen,
    TagDetail: TagDetailScreen,
    CoinShop
  },
  {
    initialRouteName: "Tags",
    headerMode: "none",
    navigationOptions: {
      title: '検索',
    },
  }
);

const SetingStack =  StackNavigator(
  {
    Settings: SettingScreen,
    CoinShop
  },
  {
    initialRouteName: "Settings",
    headerMode: "none",
    navigationOptions: {
      title: '設定',
    },
  }
);

const RankingStack =  StackNavigator(
  {
    Ranking: Ranking,
    BookDetail: BookDetailScreen,
  },
  {
    initialRouteName: "Ranking",
    headerMode: "none",
    navigationOptions: {
      title: 'ランキング',
    },
  }
);

const TabNav = TabNavigator(
  {
    Home: HomeStack,
    Ranking: RankingStack,
    Tags: TagStack,
    Settings: SetingStack
  },
  {
    initialRouteName: "Home",
    tabBarPosition: "bottom",
    tabBarComponent: TabBarBottom,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showLabel: true,
      style: {
        height: 50,
        fontSize: 10
      }
    },
    navigationOptions: ({ navigation }) => ({
      tabBarOptions: {
        keyboardHidesTabBar: true,
      },
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let backgroundFooter = FooterBackground
        let IconComponent = Ionicons;
        let iconName;
        let align;
        if (routeName === 'Home') {
          iconName = focused ? HomeActiveIcon : HomeIcon
          align = 'flex-end'
        } else if (routeName === 'Settings') {
          iconName = focused ? SettingActiveIcon : SettingIcon
          align = 'flex-start'
          }
       else if (routeName === "Ranking") {
          iconName = focused ? RankingActiveIcon : RankingIcon
        }
        else {
          iconName = focused ? SearchIconActive : SearchIcon 
          align = 'center'
        }
        return (
            <View style={{ borderWidth: 0}}>
              <Image source={iconName} style={{width: 25, height: 25,  alignSelf: align, resizeMode: "contain"}} />
            </View>
          );
      }
    })
  }
);
const AppNavigation = StackNavigator(
  {
    Tabs: TabNav,
    Story: StoryScreen,
    Webtoon: WebtoonScreen,
    Scroll: ScrollScreen,
    TagDetail: TagDetailScreen,
    BookDetail: BookDetailScreen,
    EndStoryScreen,
    ReportScreen,
    Webtoon: WebtoonScreen,    
  },
  {
    initialRouteName: "Tabs",
    headerMode: "none",
    mode: 'modal',
    transitionConfig: NavigationConfig
  }
);

const prevGetStateForActionHomeStack = AppNavigation.router.getStateForAction;
AppNavigation.router.getStateForAction = (action, state) => {

    if(
        state && action.type === 'Navigation/BACK' &&
        (state.routes[state.index].params &&
          state.routes[state.index].params.backBehavior === "GoFromStory")
      ) {

        let newRoutes = state.routes.filter(r => r.routeName !== "Story" && r.routeName !== "BookDetail");
        let newIndex = newRoutes.length - 1;

        return {
          routes: newRoutes,
          index: newIndex
        };
    } else if(
          state && state.routes[state.index].params &&
          state.routes[state.index].params.backBehavior === "GoFromBook"
        ) {

          state.routes[state.index].params.backBehavior = ""
          let newRoutes = state.routes.filter(r => r.routeName !== "Story");
          let newIndex = newRoutes.length - 1;

          return {
            routes: newRoutes,
            index: newIndex
          };
    } else if(state && state.routes[state.index].params &&
        action.type === 'Navigation/COMPLETE_TRANSITION' &&
        state.routes[state.index].routeName === 'Story' &&
          state.routes[state.index].params.backBehavior === "GoFromStory"){

        // Remove all old story screen before go to new story from next button in chat view
        let newRoutes = state.routes.filter(r => r.routeName !== "Story" || (r.routeName === "Story" && r === state.routes[state.index]));
        let newIndex = newRoutes.length - 1;

        return {
          routes: newRoutes,
          index: newIndex
        };

    }

    return prevGetStateForActionHomeStack(action, state);
};
export default {
  props: {
    navigation: { 
      type: Object
    }
  },
  data() {
    return {
      isSplash: true,
    };
  },
  components: { Root, AppNavigation, ModalRating },
  methods: {
    ...mapActions({
      incrementPageViews: 'user/incrementPageViews',
      reportReadingStoryDate: 'user/reportReadingStoryDate'
    }),
    getSplash() {
      let a = Math.floor(Math.random() * (3 - 1 + 1) ) + 1;
      switch(a) {
        case 1:
          return app_splash;
        case 2:
          return app_splash2;
        case 3:
          return app_splash3;
        default:
          return app_splash;
      }
    },
    // Tracking page view here
    async handleState(prevState, newState){
      state = newState
      let route = this.findCurrentScreen(newState)
      let pre_route = this.findCurrentScreen(prevState)
      if(route === 'Home') {
        let num = await LocalStoreData.getDataFromLocal('@NumReading');
        let rated = await LocalStoreData.getDataFromLocal('@Rated');
        rated = rated === null ? false : rated;
        if(num >= 10 && rated == false) {
          await LocalStoreData.saveDataSetting('@NumReading', 0);
          this.$refs.modalRating.showModal();
        }
      }
      this.saveTrackingPageView(route, pre_route)
    },

    findCurrentScreen(routes){
      if(routes.length < 1) { return }
      route = routes
      while(route.index !== undefined){
        route = route.routes[route.index]
      }
      return route.routeName
    },

    saveTrackingPageView(route, pre_route){
      switch(route) {
        case 'Home':
          if(route != pre_route)
            this.incrementPageViews('pv_top')
          break;
        case 'Tags':
          if(route != pre_route)
            this.incrementPageViews('pv_tags')
          break;
        case 'TagDetail':
          if(route != pre_route)
            this.incrementPageViews('pv_tag_detail')
          break;
        case 'BookDetail':
          if(route != pre_route) {
            this.incrementPageViews('pv_book_detail')
            if(pre_route == 'Home')
              this.incrementPageViews('top_book_cover_click')
          }
          break;
        case 'Story':
          if(route != pre_route) {
            this.reportReadingStoryDate()
          }
        default:
          // code block
      }
    }
  }, 
  computed: {
    ...mapGetters({
      notificationType: 'user/notificationType'
    }),
  },
  async mounted() {
    setTimeout(() => {
      this.isSplash = false
    }, 2000);
    NavigationService.setTopLevelNavigator(this.$refs.stackrouter);
  },
  watch: {
    // notificationType(newVal, oldVal){
    //   switch(newVal) {
    //     case 'book':
    //       console.log('anhnn', this.$refs.stackrouter);
    //       this.$refs.stackrouter.dispatch(NavigationActions.navigate({routeName: 'BookDetail', params: {id: "6"}}))
    //       break;
    //   }
    //   // this.currentSubscription = newVal
    // }
  },
};

</script>
