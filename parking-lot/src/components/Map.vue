<template>
    <div class="com-container" @dblclick="revertMap">
      <div class="com-chart" ref="map"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Map',
  data () {
    return {
      chartInstance: null,
      allData: null,
      mapData: {}
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    },
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map, this.theme)
      // 获取中国的矢量数据
      const ret = await this.$axios.get('/static/map/china.json')
      console.log('获取地图数据成功')
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '   车场全国分布图',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          label: {
            show: true
          }
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const {data: ret} = await this.$axios.get('/static/mock/map.json')
      this.allData = ret
      console.log('mmz' + this.allData)
      this.updateChart()
    },
    async updateChart () {
      const {data: ret} = await this.$axios.get('/static/mock/map.json')
      this.allData = ret
      const dataOption = {
        series: [
          {
            data: this.allData,
            geoIndex: 0,
            type: 'map'
          }
        ],
        visualMap: {
          min: 0,
          max: 300,
          inRange: {
            color: ['white', 'blue']
          }
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style scoped>

</style>
