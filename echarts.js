import * as echarts from 'echarts/core';
import { TooltipComponent } from 'echarts/components';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, GaugeChart, CanvasRenderer]);

// 绑定在原型链上

// 导出 echarts
export default echarts