<template>
  <div class="percentage">
    <dv-scroll-board :rowNum=1 :config="config"/>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        config:{
          header: ['时间', '故障信息'],
          data: [
            ['2023-07-13', '发动机进口滑油温度升高'],
            ['2023-07-14', '进堆空气管道堵塞'],
            ['2023-07-15', '空气过滤器堵塞'],
            ['2023-07-16', '供电电路故障'],
            ['2023-07-17', '水耗量高于正常耗量'],
            ['2023-07-18', '氢气阀破裂'],
            ['2023-07-19', '循环水泵控制端接线松动'],
            ['2023-07-20', '冷却风扇机械故障'],
            ['2023-07-21', '循环水电导率偏高'],
            ['2023-07-22', '系统压力降低']
          ],
          headerHeight: 30,
          // headerBGC: 'transparent',
          oddRowBGC: 'transparent',
          // evenRowBGC: 'transparent',
          rowNum: 8,
          indexHeader: '',
          index: true,
          columnWidth: [60, 150, 300],
          align: ['center'],
          hoverPause: true,
          
        },
        chartInstance: null,
      };
    },

    methods: {
  
      // 实现循环高亮
      pieActive() {
        let index = 0;
        let dataLength = 5;
        let showTime = setInterval(() => {
          if (index > dataLength + 1) {
            index = 0
          }
          this.chartInstance.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: index
          })
          index++
        }, 1500)
        // 鼠标划入
        this.chartInstance.on('mouseover', () => {
          // 停止定时器，清除之前的高亮
          clearInterval(showTime)
          this.chartInstance.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: index
          })
        })
      }
    },
  }
  </script>
  
  <style scoped>

.percentage {
  width: 420px;
  height: 360px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 75px;
  right: 0px;
  left:8px;
  text-align: center;
}

.percentage1{
  width: 100%;
  height: 280px;
}
  .seller {
    width: 100%;
    height: 280px;
    overflow: hidden;
    position: relative;
    padding: 1px;
    margin: 10px;
  }

  /* .com-seller {
    padding: 10px;
    background: url(../static/img/line.png) rgba(255, 255, 255, 0.03);
    background-size: cover;
    border: 1px solid rgba(25, 186, 139, 0.17);
    width: 95%;
    height: 280px;
    overflow: hidden;
  } */
/*   
  .seller::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
    content: "";
  }
  
  .seller::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
    content: "";
  }
  
  .seller-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  
  .seller-footer::before {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-bottom: 2px solid #02a6b5;
    content: "";
  }
  
  .seller-footer::after {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-bottom: 2px solid #02a6b5;
    content: "";
  } */
  </style>