export default {
    /**
     * Issue props getters
     */
    getStatuses(state) {
      return state.statuses;
    },
    getPriorities(state) {
      return state.priorities;
    },
    /**
     * Key-getter
     */
    getApiKey(state) {
      return state.key;
    },
    /**
     * Projects-array-getter
     */
    getProjects(state) {
      return state.projects;
    }
  };