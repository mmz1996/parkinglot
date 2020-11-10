<template>
  <div>
    <div id="chart" style="width: 300px;height:200px;"></div>
  </div>
</template>
<script>
var echarts = require('echarts')
var myChart
export default {
  components: {},
  props: {},
  name: 'Echarts',
  data () {
    return {
      parkinginfo: [],
      sum: 0
    }
  },
  methods: {
    getParkingLot () {
      this.$axios({
        method: 'get',
        url: 'https://api.ohaiyo.vip/carport/',
        params: {
          page_size: 99,
          status: 'unoccupied'
        }
      }).then((response) => {
        console.log(response)
        this.parkinginfo.push({name: '空闲车位', value: response.data.count})
        this.getParkingLot2()
      })
    },
    getParkingLot2 () {
      this.$axios({
        method: 'get',
        url: 'https://api.ohaiyo.vip/carport/',
        params: {
          page_size: 99,
          status: 'reserved'
        }
      }).then((response) => {
        console.log(response)
        this.parkinginfo.push({name: '预定车位', value: response.data.count})
        this.getParkingLot3()
      })
    },
    getParkingLot3 () {
      this.$axios({
        method: 'get',
        url: 'https://api.ohaiyo.vip/carport/',
        params: {
          page_size: 99,
          status: 'engaged'
        }
      }).then((response) => {
        console.log(response)
        this.parkinginfo.push({name: '占用车位', value: response.data.count})
        myChart.hideLoading()
        this.sum = this.parkinginfo[0].value + this.parkinginfo[1].value + this.parkinginfo[2].value
        myChart.setOption({
          title: {
            text: '总车位数:' + this.sum,
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#0a0a0b',
              fontSize: '10'
            }
          },
          series: [{
            name: '停车信息',
            data: this.parkinginfo
          }
          ]
        })
      })
    }
  },
  mounted () {
    myChart = echarts.init(document.getElementById('chart'))
    myChart.setOption({
      legend: {
        // orient: 'vertical',
        left: 10,
        data: ['空闲车位', '预定车位', '占用车位']
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}'
      },
      color: ['#00BFFF', '#4bedda', '#ec4b5d'],
      series: [
        {
          name: '车位信息',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          data: [],
          label: {
            formatter: '{d}%'
          },
          labelLine: {
            show: true,
            smooth: 0.2,
            length: 20,
            length2: 20
          },
          emphasis: {
            label: {
              show: false,
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        }
      ]
    })
    myChart.showLoading()
    this.getParkingLot()
  }
}
</script>
<style scoped>
</style>
