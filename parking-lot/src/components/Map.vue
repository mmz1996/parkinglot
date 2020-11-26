<template>
    <div class="com-container" @dblclick="revertMap">
      <div class="com-chart" ref="map"></div>
    </div>
</template>

<script>
import {getProvinceMapInfo} from '../utils/map_utils'
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
      this.chartInstance = this.$echarts.init(this.$refs.map, 'chalk')
      // 获取中国的矢量数据
      const ret = await this.$axios.get('http://localhost:8080/static/map/china.json')
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
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async arg => {
        console.log('点击成功')
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(provinceInfo)
        const ret = await this.$axios.get('http://localhost:8080' + provinceInfo.path)
        if (!this.mapData[provinceInfo.key]) {
          this.mapData[provinceInfo.key] = ret.data
          console.log(ret)
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData () {
      const {data: ret} = await this.$axios.get('http://127.0.0.1:8888/api/map')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        return {
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
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
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>
