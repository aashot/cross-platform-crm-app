<template>
  <f7-page name="home" ptr :ptr-mousewheel="true" @ptr:refresh="refreshPage">
    <!-- Top Navbar -->
    <f7-navbar class="navbar main-theme-bg" :sliding="false">
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>VIOPROJECT Кабинет клиента</f7-nav-title>
    </f7-navbar>

    <!-- Page content-->
    <f7-block v-if="apiKey && !projects.length || refreshing" class="projects-list">
      <f7-block-title large>Мои проекты</f7-block-title>
      <f7-card v-for="project in 20" :key="project" class="rounded-card skeleton-effect-blink">
        <f7-card-header class="no-border grey-bg rounded-card__header" valign="bottom"></f7-card-header>
        <f7-card-content>
          <f7-block-title large class="rounded-card--title skeleton-text">Loremmm</f7-block-title>
        </f7-card-content>
      </f7-card>
    </f7-block>

    <f7-block v-if="apiKey && projects.length && !refreshing" class="projects-list">
      <f7-block-title large>Мои проекты</f7-block-title>
      <f7-card
        class="demo-card-header-pic rounded-card"
        v-for="project in projects"
        :key="project.id"
        @click.native="$f7router.navigate({ name: 'project', params: { id: project.id, key: apiKey } })"
      >
        <div
          class="display-block text-color-black"
        >
          <f7-card-header
            class="no-border rounded-card__header"
            valign="bottom"
            :style="project.cardImg ? `background-image: url(${project.cardImg})` : 'background-color: var(--f7-bars-bg-color);'"
          ></f7-card-header>
          <f7-card-content>
            <f7-block-title class="rounded-card--title">{{project.name}}</f7-block-title>
          </f7-card-content>
        </div>
      </f7-card>
    </f7-block>

    <f7-block v-else>
      <f7-card>
        <f7-card-header>API Key is not defined</f7-card-header>
        <f7-card-content>Please open settings and insert your personal API Key from Redmine profile</f7-card-content>
      </f7-card>
    </f7-block>
  </f7-page>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "project",

  data: () => ({
    refreshing: false
  }),

  computed: {
    apiKey() {
      return this.$store.getters.getApiKey;
    },
    projects() {
      return this.$store.getters.getProjects;
    }
  },

  created() {
    this.refreshPage(this.$f7.ptr.done);
  },

  methods: {
    ...mapActions(["getProjectsList"]),

    refreshPage(done) {
      if (this.apiKey) {
        this.refreshing = true;
        this.getProjectsList(this.apiKey).then(() => {
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

<style lang="scss">
</style>