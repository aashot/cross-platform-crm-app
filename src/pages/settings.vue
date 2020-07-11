<template>
  <f7-page name="settings">
    <f7-navbar title="Settings" back-link="Back"></f7-navbar>
    <f7-block-title>Profile settings</f7-block-title>
    <f7-list no-hairlines-md>
      <f7-list-input
        label="Your API key"
        type="text"
        :value="key"
        @input="key = $event.target.value"
        placeholder="Insert your API key"
      ></f7-list-input>
      <f7-block>
        <f7-button @click="saveKeyHandler" class="col-50 button button-fill color-purple">Save</f7-button>
      </f7-block>
    </f7-list>

    <f7-block-title>Тема</f7-block-title>
    <f7-list>
      <f7-list-item
        v-if="isDarkModeAvailable"
        radio
        radio-icon="start"
        title="Системная"
        name="demo-radio-start"
        :checked="systemThemeChecked"
        @change="setSystemThemeHandler"
      ></f7-list-item>

      <f7-list-item
        radio
        radio-icon="start"
        title="Светлая"
        name="demo-radio-start"
        :checked="savedAppTheme === 'white'"
        @change="setWhiteThemeHandler"
      ></f7-list-item>

      <f7-list-item
        radio
        radio-icon="start"
        title="Темня"
        name="demo-radio-start"
        :checked="savedAppTheme === 'dark'"
        @change="setDarkThemeHandler"
      ></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "settings",

  data: () => ({
    key: null,
    systemThemeChecked: false,
    savedAppTheme: localStorage.getItem("appTheme")
  }),

  computed: {
    ...mapState({
      isCordovaOn: state => state.isCordovaOn,
      isUsingSystemTheme: state => state.isUsingSystemTheme,
      isDarkModeAvailable: state => state.isDarkModeAvailable,
      currentTheme: state => state.currentTheme
    })
  },

  created() {
    if (this.isUsingSystemTheme) {
      this.systemThemeChecked = true;
    }
  },

  mounted() {
    this.checkApiKey();
  },

  methods: {
    ...mapActions(["getProjectsList"]),
    ...mapMutations([
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
        this.key = localKey;
      }
    },

    /**
     * Button click handler / Save API Key to storage
     */
    saveKeyHandler() {
      this.$store.commit('setApiKey',this.key);
      this.getProjectsList(this.key).then(() => {
        this.$f7router.navigate({ name: "projects" });
      });
    },

    setWhiteThemeHandler(event) {
      if (event.target.checked) {
        this.SET_WHITE_THEME();
      }
    },

    setDarkThemeHandler(event) {
      if (event.target.checked) {
        this.SET_DARK_MODE_ENABLED("notSystem");
      }
    },

    setSystemThemeHandler(event) {
      if (event.target.checked) {
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
              this.SET_DARK_MODE_ENABLED();
            } else {
              this.SET_WHITE_THEME('system');
            }
          },
          error => console.log(error)
        );
      }
    }
  }
};
</script>

<style lang="scss">
</style>
