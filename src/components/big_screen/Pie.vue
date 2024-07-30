<template>
    <div class="pie">
        <!-- <p>{{ message }}</p>      -->
      <dv-border-box-1 title="dv-border-box-11" :color="['#BFD3FF']" style="height: 100%; width: 100%;">
        <div class="title">
            <span>发动机状态</span>
        </div>
        <div class="percentage2">
            <div class="p1">发动机当前温度：{{ engineTemperature }}</div>
            <div class="p1">峰值转速：{{ peakSpeed }}</div>
            <div class="p1">额定功率：{{ ratedPower }}</div>
            <div class="p1">额定扭矩：{{ ratedTorque }}</div>
            <div class="p1">额定电压：{{ ratedVoltage }}</div>
            <div class="p1">传感器状态：{{ sensor }}</div>
            <div class="p1">设备状态：{{ status }}</div>
            <div class="p1">当前时间：{{ time }}</div>
        </div>
    </dv-border-box-1>
    </div>
</template>

<script>
import { sendWebsocket, closeWebsocket } from '/websocket.js'
export default {
    name: "xs-pie",
    data() {
        return {
            engineTemperature: '',
            peakSpeed: '',
            ratedPower: '',
            ratedTorque: '',
            ratedVoltage: '',
            sensor: '',
            status: '',
            time: ''
        };
    },
    beforeDestroy () {
        closeWebsocket()
    },
    mounted() {
        this.initChart();
        this.getData();
    },
    created() {
        sendWebsocket('ws://61.171.112.204:8090//ws?sectionId=999', this.wsMessage)
      },
    methods: {
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.pie_ref);
        },
        async getData() {
            await this.updateChart();
        },
        wsMessage (data) {
            console.log(data)
            const dataJson = data
            this.engineTemperature = data.data.engineTemperature
            this.peakSpeed = data.data.peakSpeed
            this.ratedPower = data.data.ratedPower
            this.ratedTorque = data.data.ratedTorque
            this.ratedVoltage = data.data.ratedVoltage
            this.sensor = data.data.sensor
            this.status = data.data.status
            this.time = data.data.date
            // 这里写拿到数据后的业务代码
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
            // this.pieActive()
        }
    },
}
</script>

<style scoped>
.pie {
    width: 420px;
    height: 400px;
    overflow: hidden;
    position: relative;
    padding: 1px;
    margin: 10px;
    top: 600px;
    right: 0px;
    left:0px;
    
}
.pie .title{
    position: absolute;
    text-align: center;
    width: 100%;
}
.pie .title span{
    font-size: 25px;
    color: #ffffff;
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