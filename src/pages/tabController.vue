<template>
  <f7-page :page-content="false">
    <f7-toolbar tabbar bottom>
      <f7-link tab-link="#tab-1" tab-link-active>Home</f7-link>
      <f7-link data-view="current" tab-link="#tab-2">Settings</f7-link>
    </f7-toolbar>

    <!-- <f7-tabs swipeable> -->
    <f7-tabs swipeable>
      <f7-tab id="tab-1" class="page-content ptr-content" tab-active ref="homeTab">
        <f7-view id="view-home" name="home" main tab tab-active url="/home"></f7-view>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <f7-view id="view-settings" name="settings" main tab tab-active url="/settings/"></f7-view>
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
export default {
  name: "tabController"
};
</script>