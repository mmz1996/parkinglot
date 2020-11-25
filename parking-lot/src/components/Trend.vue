<template>
  <div class="com-container">
    <div class="com-chart" ref="trend"  style="width: 100%;height: 100%">

    </div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  data () {
    return {
      chartInstance: null,
      allData: null
    }
  },
  methods: {
    initChart () {
      const chart = this.$refs.trend
      this.chartInstance = this.$echarts.init(chart, 'chalk')
      const initOption = {
        title: {
          text: '   车场收益走势图',
          textStyle: {
            fontSize: 33
          },
          left: 20,
          top: 20
        },
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const {data: ret} = await this.$axios.get('http://127.0.0.1:8888/api/trend')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 类目轴数据
      const timeArr = this.allData.common.month
      // y轴数据
      const valueArr = this.allData.map.data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,[
              {
                color: colorArr1[index],
                offset: 0
              },
              {
                color: colorArr2[index],
                offset: 1
              }
            ])
          }
        }
      })
      //  图例的数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('reisze', this.screenAdapter)
  }
}
</script>

<style scoped>

</style>
