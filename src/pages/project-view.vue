<template>
  <f7-page name="project-view" ptr :ptr-mousewheel="true" @ptr:refresh="refreshPage">
    <f7-navbar>
      <f7-nav-left>
        <f7-link @click="$f7router.navigate({ name: 'projects' })">
          <i class="icon icon-back"></i>
        </f7-link>
      </f7-nav-left>
      <f7-nav-title v-if="!info || refreshing" class="skeleton-text skeleton-effect-blink">loremmm</f7-nav-title>
      <f7-nav-title v-else>{{ info.name }}</f7-nav-title>
    </f7-navbar>
    <f7-block>
      
      <f7-swiper :params="{speed:500, slidesPerView: 1.25}">
        <f7-swiper-slide>
          <action-card 
              :params="{
                title: 'Добавить функционал',
                icon: 'plus_circle_fill',
                iconSize: '34px',
                backgroundColor: 'rgb(214, 184, 205)'
              }"

              @action="$f7.popup.open('.create-issue')"
          />
        </f7-swiper-slide>

        <f7-swiper-slide>
          <action-card 
              :params="{
                title: 'Cообщить о проблеме',
                icon: 'info_circle',
                iconSize: '34px',
                backgroundColor: '#b8cad6;'
              }"

              @action="$f7.popup.open('.create-issue')"
          />
        </f7-swiper-slide>
      </f7-swiper>

      <f7-card>
        <f7-card-header :class="{'grey-bg': currentTheme === 'white'}">
          <f7-block>Информация о проекте</f7-block>
        </f7-card-header>
        <f7-card-content>
          <f7-block
            class="project-actions--text skeleton-text skeleton-effect-blink"
            v-if="!info || refreshing"
          >Loremmmmmmm</f7-block>
          <f7-block
            class="project-actions--text"
            v-else
          >{{ info.description ? info.description : 'без описания' }}</f7-block>
        </f7-card-content>
      </f7-card>

      <Charts v-if="charts.length"></Charts>
    </f7-block>

    <f7-block>
      <f7-block-title>Задачи</f7-block-title>
      <template v-if="!issues || refreshing">
        <IssueCardSkeleton v-for="issue of 4" :key="issue" />
      </template>

      <template v-else>
        <issue-card 
          v-for="(issue, index) of issues" 
          :key="index" 
          :issue="issue" 
          :apiKey="apiKey" 
        />
      </template>

      <f7-button
        v-if="!issues || refreshing"
        class="col-50 mt-10 button button-fill color-gray skeleton-text skeleton-effect-blink"
      >Loremm</f7-button>
      <f7-button
        v-else-if="issues && issues.length"
        class="col-50 mt-10 button button-fill color-purple"
        :href="'/projects/issues/'+info.id+'/'+apiKey+'/'"
      >Все Задачи</f7-button>
    </f7-block>

    <f7-block v-if="issues && issues.length === 0">
      <f7-card>
        <f7-card-header>Нет задач</f7-card-header>
      </f7-card>
    </f7-block>

    <!--Popup component-->
    <CreateIssue v-if="info" :project="info.id" :projectKey="apiKey"></CreateIssue>
  </f7-page>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CreateIssue from "@/components/popup/CreateIssue";
import ActionCard from '../components/ActionCard.vue';
import IssueCard from "../components/IssueCard.vue";
import IssueCardSkeleton from "../components/skeletons/IssueCard.vue";
import Charts from "@/components/charts/Charts";

export default {
  name: "project-view",

  components: {
    CreateIssue,
    IssueCard,
    IssueCardSkeleton,
    Charts,
    ActionCard
  },

  data() {
    return {
      refreshing: false
    };
  },

  computed: {
    ...mapState({
      apiKey: state => state.key,
      currentTheme: state => state.currentTheme,
      info: state => state.projectInfo,
      issues: state => state.previewIssues,
      charts: state => state.charts
    })
  },

  created() {
    this.refreshPage(this.$f7.ptr.done);
  },

  methods: {
    ...mapActions(["getProject", "getProjectIssues"]),

    getProjectInfo() {
      return new Promise(resolve => {
        const getProject = this.getProject(this.$f7route.params.id);
        const getSomeIssuses = this.getProjectIssues({
          id: this.$f7route.params.id,
          limit: 4,
          preview: true
        });

        Promise.all([getProject, getSomeIssuses]).then(() => {
          console.log("Content is loaded!");
          resolve();
        });
      });
    },

    refreshPage(done) {
      return new Promise(resolve => {
        this.refreshing = true;
        this.getProjectInfo().finally(() => {
          this.refreshing = false;
          done();
          resolve();
        });
      });
    }
  }
};
</script>
