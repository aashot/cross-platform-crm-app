<template>
  <!-- <f7-app :params="f7params" theme-dark> -->
  <f7-app :params="f7params" :theme-dark="isDarkModeEnabled">
    <!-- Left panel with cover effect-->
    <sidebar />

    <!-- Views/Tabs container -->
    <f7-views tabs class="safe-areas">
      <!-- Tabbar for switching views-tabs -->
      <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
      <f7-view id="projects" name="projects" main tab tab-active url="/"></f7-view>
    </f7-views>
  </f7-app>
</template>
<script>
import { Device } from "framework7/framework7-lite.esm.bundle.js";
import cordovaApp from "../js/cordova-app.js";
import routes from "../js/routes.js";
import { mapMutations, mapState } from "vuex";
import Sidebar from "../components/Sidebar.vue";

export default {
  components: {
    Sidebar
  },

  data() {
    return {
      key: null,
      savedAppTheme: localStorage.getItem("appTheme"),
      // Framework7 Parameters
      f7params: {
        id: "io.framework7.myapp", // App bundle ID
        name: "mobclient", // App name
        theme: "auto", // Automatic theme detection
        touch: {
          // Enable touch in app
          tapHold: true
        },

        // App root data
        data: function() {
          return {};
        },

        // App routes
        routes: routes,

        // Input settings
        input: {
          scrollIntoViewOnFocus: Device.cordova && !Device.electron,
          scrollIntoViewCentered: Device.cordova && !Device.electron
        },
        // Cordova Statusbar settings
        statusbar: {
          iosOverlaysWebView: true,
          androidOverlaysWebView: false
        }
      }
    };
  },

  computed: {
    ...mapState({
      isDarkModeEnabled: state => state.isDarkModeEnabled,
      currentTheme: state => state.currentTheme,
      isCordovaOn: state => state.isCordovaOn
    })
  },

  mounted() {
    this.$f7ready(f7 => {
      // Init cordova APIs (see cordova-app.js)
      if (Device.cordova) {
        cordovaApp.init(f7);
        this.SET_CORDOVA_AVAILABLE();
        this.setSystemTheme();
      }
      // Call F7 APIs here
      this.checkApiKey();
    });

    this.checkAppTheme();
  },

  methods: {
    ...mapMutations([
      "SET_CORDOVA_AVAILABLE",
      "SET_DARK_MODE_AVAILABLE",
      "SET_DARK_MODE_ENABLED",
      "SET_SYSTEM_THEME",
      "SET_WHITE_THEME"
    ]),

    /**
     * Checking API Key from local storage
     */
    checkApiKey() {
      let localKey = localStorage.getItem("key");

      if (localKey) {
        this.$store.commit("setApiKey", localKey);
        this.$store.dispatch("getProjectsList");
        this.key = localKey;
      }
    },

    setSystemTheme() {
      cordova.plugins.ThemeDetection.isAvailable(
        success => {
          if (success.value) {
            this.SET_DARK_MODE_AVAILABLE();
            if (this.currentTheme === "system") {
              this.SET_SYSTEM_THEME();
            }
          }
        },
        error => console.log(error)
      );

      cordova.plugins.ThemeDetection.isDarkModeEnabled(
        success => {
          if (success.value) {
            if (this.savedAppTheme !== 'white') {
              this.SET_DARK_MODE_ENABLED();
            }
          }
        },
        error => console.log(error)
      );
    },

    checkAppTheme() {
      if (this.savedAppTheme === 'white') {
        this.SET_WHITE_THEME();
         console.log('set white theme 1');
      }

      if (this.savedAppTheme === 'dark') {
        this.SET_DARK_MODE_ENABLED('notSystem');
      }

      if (!this.$device.cordova && this.currentTheme === 'system') {
        this.SET_WHITE_THEME();
         console.log('set white theme 2');
      }
    }
  }
};
</script>