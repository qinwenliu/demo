<template>
  <div class="percentage">
    <dv-border-box-1 :color="['#BFD3FF']" style="height: 100%; width: 100%;">
      <div class="percentage1" ref="line_ref">
      </div>
    </dv-border-box-1>
  </div>
</template>

<script>
export default {
  name: "xs-line",
  data() {
      return {
          chartInstance: null,
      };
  },
  mounted() {
      this.initChart();
      this.getData();
  },
  methods: {
      initChart() {
          this.chartInstance = this.$echarts.init(this.$refs.line_ref);
      },
      async getData() {
          await this.updateChart();
      },
      updateChart() {
          let myColor = ["#1089E7", "#F57474", "#56D0E3", "#f8b448", "#8B78F6"];
          const options = {
              title: {
                  text: '运行状态',
                  // subtext: '在此测试',
                  x: 'center',
                  y: 'top',
                  // textAlign: 'center',
                  textStyle: {
                      // fontSize: 100,
                      color: "#fff",
                  }
              },
              tooltip: {
                          formatter: '{a} <br/>{b} : {c}%',
                      },
                      series: [
                          {
                          name: 'Pressure',
                          type: 'gauge',
                          radius:'60%',
                          center: ["35%", "45%"], 
                          progress: {
                              show: true
                          },
                          axisLabel: {            // 刻度标签。
                              show: true,             // 是否显示标签,默认 true。
                              distance: 15,            // 标签与刻度线的距离,默认 5。

                              fontSize: 8,           // 文字的字体大小,默认 5。
                              formatter: "{value}",   // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
                          },

                          detail: {
                              valueAnimation: true,
                              formatter: '{value}',
                              textStyle: {
                                  fontSize: 15,
                                  // color: "#fff",
                              }
                          },
                          title: {                // 仪表盘标题。
                              show: true,             // 是否显示标题,默认 true。
                              offsetCenter: [0,"20%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                              color: "#fff",          // 文字的颜色,默认 #333。
                              fontSize: 10,           // 文字的字体大小,默认 15。
                          },

                          data: [
                              {
                              value: 80,
                              name: '主机有效扭矩',
                              textStyle: {
                                  fontSize: 20,
                                  // color: "#fff",
                              }
                              }
                          ]
                          }
                      ]
          };

          this.chartInstance.setOption(options);

      },

  },
}
</script>

<style scoped>
.percentage {
  width: 420px;
  height: 400px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 600px;
  right: 0px;
  left:1400px;
  text-align: center;
}
.percentage1{
  width: 100%;
  height: 280px;
}
</style>