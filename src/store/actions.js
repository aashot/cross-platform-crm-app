import axios from 'axios';
import app from '../js/app.js';

export default {
  /**
   * Request project list from url
   */
  async getProjectsList({
    commit,
    state
  }, payload) {
    return new Promise(async (resolve, reject) => {
      const key = payload || state.key;
      let url = `https://vioproject.com/projects.json?key=${key}`;

      await axios.get(url)
        .then((resp) => {
          commit('setProjectsList', resp.data.projects);
          commit('setApiKey', key);
          resolve();
        })
        .catch((err) => {
          commit('CLEAR_API_KEY');
          console.error('Error Occurred! Probably entered the wrong API key.', err);
          const notificationMessage = app.$f7.notification.create({
            title: 'Error!',
            subtitle: 'Error Occurred! Probably entered the wrong API key.',
            closeButton: true,
            closeTimeout: 2000
          })

          notificationMessage.open();

          commit('setProjectsList', []);
          reject();
        })
    })
  },

  async getProject({
    commit,
    state
  }, id) {
    const infoUrl = `https://vioproject.com/projects/${id}.json`;
    const bodyRow = {
      key: state.key
    };

    await axios.get(infoUrl, {
        params: bodyRow
      })
      .then((resp) => {
        commit('SET_PROJECT_INFO', resp.data.project);
      })
      .catch((err) => {
        console.error('An error occurred while getting information about the project!');
      });
  },

  async getProjectIssues({
    commit,
    state
  }, {
    id,
    limit,
    preview
  }) {
    const issuesUrl = `https://vioproject.com/projects/${id}/issues.json`;
    const bodyRow = {
      key: state.key
    };

    if (limit) {
      bodyRow.limit = limit;
    }

    await axios.get(issuesUrl, {
        params: bodyRow
      })
      .then((resp) => {
        if (preview) {
          commit('SET_PORJECT_PREVIEW_ISSUES', resp.data);
        } else {
          commit('SET_PORJECT_ISSUES', resp.data);
        }
      })
      .catch((err) => {
        console.error('An error occurred while getting project issues!', err);
      });
  },

  async getIssueInfo({
    commit,
    state
  }, id) {
    const infoUrl = `https://vioproject.com/issues/${id}.json`;
    const bodyRow = {
      key: state.key,
      include: ['children', 'attachments', 'relations', 'changesets', 'journals', 'watchers']
    }

    await axios.get(infoUrl, {
        params: bodyRow
      })
      .then((resp) => {
        commit('SET_ISSUE', resp.data.issue);
      })
      .catch((err) => {
        console.error('An error occurred while getting an issue!', err);
        return;
      });
  },

  async getChartInfos({
    commit,
    state
  }) {
    let chartInfos = [],
      id = 0;
    for (let chart of state.charts) {

      const chartUrl = `http://pinger.vioproject.com/json.php`;
      const bodyRow = {
        key: chart.key,
        json: 1
      }

      await axios.get(chartUrl, {
          params: bodyRow
        })
        .then((resp) => {
          id++;
          chartInfos.push({
            name: chart.name,
            chart: resp.data,
            class: `chart-${chart.key}`,
            id: id
          });
        })
        .catch((err) => {
          console.error('An error occurred while getting an chart!', err);
          return;
        });
    }
    commit('SET_CHART_INFOS', chartInfos);
  },

  async updateIssue({
    commit,
    state
  }, issue) {
    const postUrl = `https://vioproject.com/issues/${state.issue.id}.json`;
    const headers = {
      "Content-Type": "application/json",
      Origin: "*",
      Accept: "*",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      "X-Redmine-API-Key": `${state.key}`
    };

    await fetch(postUrl, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(issue)
    })
  }
};