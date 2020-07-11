<template>
  <f7-card external target="_blank" class="rounded-card">
    <f7-link :href="'/issues/'+issue.id+'/'+apiKey+'/'" class="display-block text-color-black">
      <f7-card-header strong class="issue-header">
        <div>{{issue.subject}}</div>
        <div>
          <div class="status">
            <f7-icon :f7="issue.status.name | statusIcon" size="20px"></f7-icon>
          </div>
        </div>
      </f7-card-header>
      <f7-card-content class="text-descr">
        <f7-block class="priority-indicator" :class="issue.priority.id | priorityColor"></f7-block>
        <f7-block
          v-if="issue.description"
          v-html="textFormater(issue.description)"
          class="issue-description"
        ></f7-block>
        <f7-block class="issue-description" v-else>без описания</f7-block>
      </f7-card-content>
      <f7-card-footer class="issue-footer">
        <div class="dateblock-wrap">
          <div class="dateblock">
            <f7-block class="issue-description">Создана</f7-block>
            <f7-block class="dateblock-date">{{ issue.created_on | daysFromNow }}</f7-block>
            <f7-block
              class="dateblock-time"
              v-if="daysDifFromNow(issue.created_on) <= 3"
            >в {{ issue.created_on | formatHours }}</f7-block>
          </div>
          <div class="dateblock">
            <f7-block>Обновлена</f7-block>
            <f7-block class="dateblock-date">{{ issue.created_on | daysFromNow }}</f7-block>
            <f7-block
              class="dateblock-time"
              v-if="daysDifFromNow(issue.created_on) <= 3"
            >в {{ issue.created_on | formatHours }}</f7-block>
          </div>
        </div>

        <f7-gauge
          type="circle"
          class="issue-done-ratio"
          :value="guageValue / 100"
          :value-text="guageValue ? guageValue : '0'"
          :value-font-size="15"
          value-text-color="var(--f7-button-text-color)"
          :size="60"
          :border-width="2"
          border-color="var(--f7-button-text-color)"
        ></f7-gauge>
      </f7-card-footer>
    </f7-link>
  </f7-card>
</template>

<script>
import moment from "moment";
import textile from "textile-js";

export default {
  props: {
    issue: {
      type: Object,
      required: true
    },

    apiKey: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      guageValue: 0
    };
  },

  created() {
    this.guageValue = 0;
    setTimeout(() => {
      if (this.issue) {
        this.guageValue = this.issue.done_ratio;
      }
    }, 350);
  },

  methods: {
    daysDifFromNow(date) {
      return moment().diff(date, "days");
    },

    textFormater(text) {
      if (!text.indexOf("!")) {
        return "- Изображение";
      } else {
        return textile(text);
      }
    }
  }
};
</script>

<style>
</style>