<template>
  <div class="pie2">
      <!-- <p>{{ message }}</p>      -->
    <dv-border-box-1 :color="['#BFD3FF']" style="height: 100%; width: 100%;">
      <div class="percentage1" ref="pie_ref1">   
      </div>
      <!-- <div class="percentage2">
          <div class="p1">发动机当前温度：{{ temperature }}</div>
          <div class="p1">额定功率：{{ Ratedpower }}</div>
          <div class="p1">峰值转速：{{ Peakspeed }}</div>
          <div class="p1">额定扭矩：{{ Ratedtorque }}</div>
          <div class="p1">单缸排量：{{ Singlecylinder }}</div>
          <div class="p1">机油消耗率：{{ Oilconsumption_rate }}</div>
          <div class="p1">气缸数：{{ Numcylinders }}</div>
      </div> -->
  </dv-border-box-1>
  </div>
</template>

<script>
export default {
  name: "xs-pie",
  data() {
      return {
          chartInstance: null,
          temperature: '55.5℃',
          ratedPower: '55.55kw',
          peakSpeed: '500rps',
          atedtorque: '10000N·m',
          Singlecylinder: '200000',
          Oilconsumption_rate: '200000',
          Numcylinders: '200000'
      };
  },
  mounted() {
      this.initChart();
      this.getData();
  },
  methods: {
      initChart() {
          this.chartInstance = this.$echarts.init(this.$refs.pie_ref1);
      },
      async getData() {
          await this.updateChart();
      },
      updateChart() {
          const options = {
              title: {
                  text: '参数',
                  x: 'center',
                  y: 'top',
                  textStyle: {
                      color: "#fff", // 主标题文字的颜色。
                  },
              },
          };

          this.chartInstance.setOption(options);
      },
  },
}
</script>

<style scoped>
.pie2 {
  width: 420px;
  height: 360px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 75px;
  left:1400px;
}


.percentage1{
width: 100%;
/* height: 100px; */
}

.percentage2{
width: 100%;
height: 300px;
top: 20px;
/* text-align: left; */
position: absolute;
padding: 20px;
}

.p1{
  font-size: 25px;
  /* text-align: left; */
  color: #ffffff;
  left:20px;
  top:20px;
}
</style>