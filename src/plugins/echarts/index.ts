import type {
  BarSeriesOption,
  LineSeriesOption,
  MapSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
} from 'echarts/charts'
import type {
  DataZoomComponentOption,
  GraphicComponentOption,
  GridComponentOption,
  LegendComponentOption,
  MarkPointComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import { BarChart, LineChart, MapChart, PieChart, ScatterChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { registerMap, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import chinaMap from './china.json'

use([
  LineChart,
  PieChart,
  BarChart,
  MapChart,
  ScatterChart,
  DataZoomComponent,
  GridComponent,
  CanvasRenderer,
  GraphicComponent,
  TooltipComponent,
  LegendComponent,
  MarkPointComponent,
  VisualMapComponent,
  TitleComponent,
])
declare type RegisterMapParams = Parameters<typeof registerMap>
registerMap('china', chinaMap as RegisterMapParams[1])

export type OptionType = ComposeOption<
  | BarSeriesOption
  | DataZoomComponentOption
  | GraphicComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
  | MapSeriesOption
  | MarkPointComponentOption
  | PieSeriesOption
  | ScatterSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | VisualMapComponentOption
>
export const mapFeaturesArr: Array<{ adcode: number; center: [number, number]; name: string }> =
  chinaMap.features
    .filter((item) => item.properties.name !== '')
    .map((item) => {
      return {
        adcode: item.properties.adcode as number,
        center: item.properties.center as [number, number],
        name: item.properties.name,
      }
    })
export default VChart
