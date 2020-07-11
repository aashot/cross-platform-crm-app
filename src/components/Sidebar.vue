<template>
  <f7-panel left cover :swipe="true">
    <f7-view class="sidebar-panel">
      <f7-page>
        <f7-navbar title="Навигация"></f7-navbar>
        <f7-block>
          <f7-link href="/" panel-close view=".view-main">Проекты</f7-link>
        </f7-block>
        <f7-block>
          <f7-link href="/settings/" panel-close view=".view-main">Настройки</f7-link>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-panel>
</template>

<script>
export default {
  name: "sidebar"
};
</script>