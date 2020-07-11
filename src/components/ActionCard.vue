<template>
  <f7-link @click="$emit('action')" class="project-card-link">
    <f7-card class="demo-card-header-pic project-actions">
      <f7-card-header
        class="project-actions--header"
        valign="bottom"
        :style="`background-color: ${params.backgroundColor}`"
      >
        <f7-icon v-if="params.icon" :f7="params.icon" :size="params.iconSize" color="white" class="project-actions--icon"></f7-icon>
        <f7-block class="project-actions--text">{{ params.title }}</f7-block>
      </f7-card-header>
    </f7-card>
  </f7-link>
</template>

<script>
export default {
  name: "action-card",
  props: {
    params: {
      type: Object,
      required: true
    }
  }
};
</script>

<style>
</style>