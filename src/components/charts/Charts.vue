<template>
  <f7-card>
    <f7-card-header>
      <f7-toolbar>
        <f7-link v-for="chart in charts" :key="chart.name" :tab-link="`#${chart.name}`" tab-link-active>{{chart.name}}</f7-link>
      </f7-toolbar>
    </f7-card-header>
    <f7-card-content>
      <f7-tabs animated>
        <f7-tab v-for="chart in charts" :key="chart.id" :id="chart.name" class="page-content" style="padding-top: 0px">
          <f7-block>
            <div style="background-color: #fff; width: 100%; height: 300px" :class="chart.class"></div>
          </f7-block>
        </f7-tab>
      </f7-tabs>
    </f7-card-content>
  </f7-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import echarts from "echarts";

export default {
  name: 'chart-list',

  computed: {
    ...mapState({
      charts: state => state.chartInfos
    })
  },

  mounted() {
    const chartInfos = this.getChartInfos();

    chartInfos.then(() => {
      console.log('Charts is loaded');
      this.initCharts()
    })
  },

  methods: {
    ...mapActions(["getChartInfos"]),

    /**
     * Init charts function
     */
    initCharts() {
      // this.$f7.preloader.show();
      this.charts.forEach((chart) => {
        this.createChart(chart);
      });
      // this.$f7.preloader.hide();
    },

    /**
     * Create chart function
     * @param {Object} chart
     */
    createChart(chart) {
      let element = document.querySelector(`.${chart.class}`);
      let currentChart = this.getChartData(chart);

      let option = {
        title: {
          left: 'center',
          text: ' ',
          subtext: ''
        },
          tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          data: currentChart.timestamp
        },
        yAxis: {
        },
        dataZoom: [{
          type: 'inside',
          throttle: 50
        }],
        series: [
          {
            name: 'Overall',
            type: 'line',
            smooth: true,
            color: '#000',
            sampling: 'max',
            symbol: false,
            areaStyle: {},
            data: currentChart.duration
          },
          {
            name: 'Compiling',
            type: 'line',
            smooth: true,
            color: 'teal',
            symbol: false,
            areaStyle: {},
            data: currentChart.timing_generation
          },
          {
            name: 'Connecting',
            type: 'line',
            smooth: true,
            color: '#eee',
            symbol: false,
            areaStyle: {},
            data: currentChart.timing_connect
          },
          {
            name: 'Lookup',
            type: 'line',
            smooth: true,
            color: '#fff',
            symbol: false,
            areaStyle: {},
            data: currentChart.timing_lookup
          },
        ]  
      }

      if (element) {
        let schart = echarts.init(element);
        schart.setOption(option);
      }
    },

    /**
     * Get chart data arrays
     * @param {Object} chart
     * @return {Object} serializedChart
     */
    getChartData(chart) {
      let timestamp = [],
          timing_connect = [],
          timing_generation = [],
          timing_lookup = [],
          duration = [];
      
      chart.chart.forEach((item) => {
        let date = new Date(item.timestamp*1000),
            time = `${date.getHours()}:${date.getMinutes()}`;
        timestamp.push(time);
        timing_connect.push(this.timingFormater(item.timing_connect));
        timing_generation.push(this.timingFormater(item.timing_generation));
        timing_lookup.push(this.timingFormater(item.timing_lookup));
        duration.push(this.timingFormater(item.duration));
      });

      let serializedChart = {
        timestamp: timestamp,
        timing_connect: timing_connect,
        timing_generation: timing_generation,
        timing_lookup: timing_lookup,
        duration: duration
      }

      console.log(serializedChart);

      return serializedChart;
    },

    /**
     * Timing formater 
     * @param {Number} timing
     * @returns {Number} formatedTiming
     */
    timingFormater(timing) {
      let number = (timing / 10000),
          formatedTiming = +number.toFixed(4);
      return formatedTiming
    }
  }
}
</script>