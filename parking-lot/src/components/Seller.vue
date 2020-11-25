<template>
  <div class="com-container">
    <div class="com-chart" ref="seller" style="width: 100%;height: 100%">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Seller',
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共有多少页
      timerId: null // 定时器的标识
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    screenAdapter () {
      const titleFontsize = this.$refs.seller.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: 66
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontsize
            }
          }
        },
        series: [
          {
            barWidth: titleFontsize,
            itemStyle: {
              barBorderRadius: [0, titleFontsize / 2, titleFontsize / 2, 0],
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },

    // 初始化echartsInstance对象
    initChart () {
      const chart = this.$refs.seller
      this.chartInstance = this.$echarts.init(chart, 'chalk')
      const initOption = {
        title: {
          text: '   车场车位使用状况',
          textStyle: {
            fontSize: 66
          },
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 66,
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6ee5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 对图表对象进行鼠标监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    async getData () {
      const {data: ret} = await this.$axios.get('http://127.0.0.1:8888/api/seller')
      this.allData = ret
      // 对数组进行排序
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      // 每五个元素显示一页
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      console.log(this.allData)
      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 定时器
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    }

  }
}
</script>

<style scoped>
</style>
