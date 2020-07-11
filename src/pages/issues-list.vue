<template>
  <f7-page name="issues-list" ptr :ptr-mousewheel="true" @ptr:refresh="refreshPage">
    <f7-navbar back-link="Back">
      <f7-nav-title>Все задачи</f7-nav-title>
    </f7-navbar>
    <f7-block>
      <f7-block v-if="issues && issues.length === 0">
        <f7-card>
          <f7-card-header>Нет задач</f7-card-header>
        </f7-card>
      </f7-block>

      <template v-if="!issues || refreshing">
        <IssueCardSkeleton v-for="issue of 4" :key="issue" />
      </template>

      <template v-else-if="issues || !refreshing">
        <issue-card v-for="(issue, index) of issues" :key="index" :issue="issue" :apiKey="apiKey" />
      </template>
    </f7-block>
  </f7-page>
</template>

<script>
import axios from "axios";
import { mapActions, mapState } from "vuex";
import IssueCard from "../components/IssueCard.vue";
import IssueCardSkeleton from "../components/skeletons/IssueCard.vue";

export default {
  name: "issues-list",

  components: {
    IssueCard,
    IssueCardSkeleton
  },

  data() {
    return {
      pageCount: 4,
      projId: this.$f7route.params.id,
      allowInfinitie: true,
      showPreloader: false,
      offset: 0,
      refreshing: false
    };
  },

  computed: {
    ...mapState({
      apiKey: state => state.key,
      issues: state => state.issues
    })
  },

  created() {
    this.refreshPage(this.$f7.ptr.done)
  },

  methods: {
    ...mapActions(["getProjectIssues"]),

    refreshPage(done) {
      if (this.apiKey) {
        this.refreshing = true;
        this.getProjectIssues({ id: this.projId }).finally(() => {
          this.refreshing = false;
          done();
        });
      } else {
        done();
      }
    }
  }
};
</script>