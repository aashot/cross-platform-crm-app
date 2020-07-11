import state from "./state";

export default {
  SET_CORDOVA_AVAILABLE(state) {
    state.isCordovaOn = true;
  },

  SET_DARK_MODE_AVAILABLE(state) {
    state.isDarkModeAvailable = true;
  },

  SET_DARK_MODE_ENABLED(state, payload) {
    state.isDarkModeEnabled = true;
    state.currentTheme = 'system';

    if (payload === 'notSystem') {
      localStorage.setItem("appTheme", "dark");
      state.currentTheme = 'dark';
    }
  },

  SET_DARK_MODE_DISABLED(state) {
    state.isDarkModeEnabled = false;
  },

  SET_SYSTEM_THEME(state) {
    state.isUsingSystemTheme = true;
  },

  DISABLE_SYSTEM_THEME(state) {
    state.isUsingSystemTheme = false;
  },

  TOGGLE_DARK_MODE(state) {
    state.isDarkModeEnabled = !state.isDarkModeEnabled;
  },

  SET_WHITE_THEME(state, payload) {
    state.currentTheme = 'white';
    state.isDarkModeEnabled = false;
    localStorage.setItem("appTheme", "white");

    if (payload === 'system') {
      state.currentTheme = 'system';
      localStorage.setItem("appTheme", "system");
    }
  },

  CLEAR_API_KEY(state) {
    state.key = null;
  },

  SET_PROJECT_INFO(state, payload) {
    state.projectInfo = payload;

    if (payload.custom_fields.length) {
      let charts = [];
      payload.custom_fields.forEach((field) => {
        if ((field.name === "pinger_urls") && field.value) {
          field.value.split("\n").forEach((string) => {
            let chart = string.split("=");
            charts.push({
              name: chart[0],
              key: chart[1]
            });
          });
        }
      });
      state.charts = charts;
    }
  },

  SET_PORJECT_ISSUES(state, {
    issues
  }) {
    state.issues = issues;
  },

  SET_PORJECT_PREVIEW_ISSUES(state, payload) {
    state.previewIssues = payload.issues;
  },

  SET_ISSUE(state, payload) {
    payload.journals = payload.journals
      .filter(item => item.notes)
      .reverse();

    payload.attachments = payload.attachments.filter(file => file.content_type);
    payload.attachments.forEach(file => {
      if (file.content_type.match(/image/g)) {
        file.imgPath = `${file.content_url}?key=${state.key}`;
      }
    })

    state.issue = payload;
  },

  SET_CHART_INFOS(state, payload) {
    state.chartInfos = payload;
  },

  /**
   * Set API Key to state
   */
  setApiKey(state, payload) {
    state.key = payload;
    localStorage.setItem('key', payload);
  },
  /**
   * Set Projects list to state
   */
  setProjectsList(state, payload) {
    const projectsCopy = JSON.parse(JSON.stringify(payload));

    projectsCopy.forEach(project => {
      if (project.custom_fields) {
        project.custom_fields.forEach(filed => {
          if (filed.name === "bg" && filed.value) {
            project.cardImg = `${filed.value}?key=${state.key}`;
          }
        });
      }
    });

    state.projects = projectsCopy;

    if (!payload.length) {
      state.key = null;
    }
  }
};