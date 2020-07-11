<template>
  <f7-card class="rounded-card">
    <f7-card-header strong class="issue-header">
      <div class="skeleton-text skeleton-effect-blink">Lorem ipsum dolor sit amet</div>
      <div>
        <div class="status skeleton-text skeleton-effect-blink">AA</div>
        <!-- <div class="name">{{issue.assigned_to.name ? `Назначена: ${issue.assigned_to.name}`: ""}}</div> -->
      </div>
    </f7-card-header>
    <f7-card-content class="text-descr">
      <span
        class="skeleton-text skeleton-effect-blink"
      >Lorem ipsum dolor sit amet consectetur </span>
      <div class="priority-indicator skeleton skeleton-text skeleton-effect-blink"></div>
    </f7-card-content>
    <f7-card-footer class="issue-footer">
      <div class="dateblock-wrap">
        <div class="dateblock">
          <strong>Создана</strong>
          <div class="dateblock-date skeleton-text skeleton-effect-blink">Lorem ipsum dolor</div>
        </div>
        <div class="dateblock">
          <strong>Обновлена</strong>
          <div class="dateblock-date skeleton-text skeleton-effect-blink">Lorem ipsum dolor</div>
        </div>
      </div>

      <f7-gauge
        type="circle"
        class="issue-done-ratio skeleton-text skeleton-effect-blink"
        :value="100"
        :value-text="11"
        :value-font-size="15"
        value-text-color="#8e8e93"
        :size="60"
        :border-width="2"
        border-color="#8e8e93"
      ></f7-gauge>
    </f7-card-footer>
  </f7-card>
</template>

<script>
export default {};
</script>

<style>
</style>