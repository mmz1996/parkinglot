<template>
  <div class="wrapper">
    <div class="echart">
      <Echarts/>
    </div>
    <div class="swith-group">
      <el-switch
        class="swithItem"
        v-model="markersShow"
        active-text="显示停车场"
        @change="pakinglotChange">
      </el-switch>
      <el-switch
        class="swithItem"
        style="display: block"
        v-model="mapStyleChange"
        active-text="地 图 样 式"
        @change="changeMapStyle">
      </el-switch>
    </div>
    <div id="container" tabindex="0">
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import Echarts from './amap/Echarts'
import {linePath1, linePath2, linePath3, path1} from '../assets/js/carport'
var map
var parkinglotLayer
var overlayGoup
var curlotLayer
export default {
  components: {Echarts},
  name: 'Amap',
  data () {
    return {
      mapStyleChange: false,
      markersShow: true,
      overlayGoupShow: false,
      icons: [
        {
          type: 'image',
          image: require('../assets/carparking1.png'),
          size: [24, 24]
        },
        {
          type: 'image',
          image: require('../assets/carparking2.png'),
          size: [24, 24]
        },
        {
          type: 'image',
          image: require('../assets/carparking3.png'),
          size: [24, 24]
        },
        {
          type: 'image',
          image: require('../assets/carparking4.png'),
          size: [24, 24]
        }
      ]
    }
  },
  mounted () {
    // 初始化高德地图
    let that = this
    AMapLoader.load({
      'key': '66daccd4bbdb3e53c6b6f03e4135f259',
      // 申请好的Web端开发者Key，首次调用 load 时必填
      'version': '2.0',
      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      'plugins': ['AMap.Scale', 'AMap.ToolBar', 'AMap.MapType', 'AMap.HawkEye', 'AMap.Geolocation'],
      // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      'AMapUI': {
        // 是否加载 AMapUI，缺省不加载
        'version': '1.1',
        // AMapUI 缺省 1.1
        'plugins': []
        // 需要加载的 AMapUI ui插件
      }
    }).then((AMap) => {
      map = new AMap.Map('container', {
        zoom: 17,
        center: [125.27902, 43.822074],
        viewMode: '3D',
        pitch: 65,
        rotation: 20,
        resizeEnable: true
      })
      map.addControl(new AMap.Scale())
      map.addControl(new AMap.ToolBar())
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          zoomToAccuracy: true,
          showButton: false
        })
        map.addControl(geolocation)
      })
      // 绑定地图事件
      map.on('click', that.mapClick)
      map.on('complete', that.mapComplete)
      map.on('zoomend', that.zoomChange)
    }).catch(e => {
      console.log(e)
    })
  },
  methods: {
    mapComplete () {
      console.log('地图加载完毕')
      this.showParkinglot()
      this.addOverlayGoup()
    },
    // 添加覆盖群组用于显示停车场区域。
    addOverlayGoup () {
      AMapLoader.load({}).then((AMap) => {
        let polygon = new AMap.Polygon({
          path: path1,
          fillColor: '#fff',
          borderWeight: 2,
          strokeColor: 'red',
          zoom: [15, 22]
        })
        let polyline = new AMap.Polyline({
          path: linePath2,
          strokeColor: 'red',
          strokeWeight: 8,
          zoom: [15, 22]
        })
        let polyline2 = new AMap.Polyline({
          path: linePath1,
          strokeColor: 'red',
          strokeWeight: 8,
          zoom: [15, 22]
        })
        let polyline3 = new AMap.Polyline({
          path: linePath3,
          strokeColor: 'red',
          strokeWeight: 8,
          zoom: [15, 22]
        })
        let polygonPath = [
          [
            ['125.277720', '43.821790'],
            ['125.278375', '43.821975'],
            ['125.278440', '43.821864'],
            ['125.277780', '43.821682']
          ]
        ]
        let polygon2 = new AMap.Polygon({
          path: polygonPath,
          fillColor: '#fff',
          borderWeight: 2,
          strokeColor: 'red',
          zoom: [15, 22]
        })
        // 覆盖物群组
        overlayGoup = new AMap.OverlayGroup([polygon, polygon2, polyline, polyline2, polyline3])
        map.add(overlayGoup)
      })
      this.overlayGoupShow = true
    },
    zoomChange (e) {
      let zoom = map.getZoom()

      console.log(zoom)
    },
    // 地图点击事件
    mapClick (e) {
      console.log(e)
    },
    // 标记点点击事件
    markerClike (e) {
      console.log(e, '标记点事件')
    },
    // 根据空余车位数量获取相应标记图标
    getIcon (sumNum, spaceNum) {
      // sumNum 总车位数
      // spaceNum 空余车位数
      if (spaceNum === 0) {
        return this.icons[3]
      }
      switch (parseInt(sumNum / spaceNum)) {
        case 1: {
          return this.icons[0]
        }
        case 2: {
          return this.icons[1]
        }
        default:
          return this.icons[2]
      }
    },
    // 标记点鼠标移入事件
    markerMouseOver (e) {
      // 添加实时标记点，显示停车场车位实时信息。
      let curposition = e.target._position
      this.$axios({
        methods: 'get',
        url: 'https://api.ohaiyo.vip/parkinglot/',
        params: {
          id: e.target._opts.extData.id
        }
      }).then((response) => {
        let that = this
        let spaceNumber = response.data.results[0].space_num
        let sumNumber = response.data.results[0].sum_num
        let spaceNum = '空闲车位 ' + spaceNumber + ' 个'
        AMapLoader.load(response, curposition).then((AMap) => {
          let icon = this.getIcon(sumNumber, spaceNumber)
          // 标记文本样式
          var textStyle = {
            fontSize: 12,
            fontWeight: 'normal',
            fillColor: '#0077b6',
            strokeColor: '#fff',
            strokeWidth: 2,
            fold: true,
            padding: '2.5'
          }
          let labelMarker = new AMap.LabelMarker({
            name: '当前停车场车位数量',
            position: curposition,
            zooms: [10, 20],
            opacity: 1,
            zIndex: 20,
            fold: true,
            icon: icon,
            text: {
              content: spaceNum,
              style: textStyle
            }
          })
          // 绑定鼠标事件
          labelMarker.on('mouseout', that.markerMouseOut)
          curlotLayer = new AMap.LabelsLayer({
            zooms: [3, 20],
            zIndex: 2000,
            allowCollision: true
          })
          curlotLayer.add(labelMarker)
          map.add(curlotLayer)
        })
      })
    },
    // 实时标记点鼠标移除事件
    markerMouseOut (e) {
      // 移除实时标记点
      map.remove(e.target._parent)
    },
    // 更改地图样式
    changeMapStyle () {
      if (this.mapStyleChange) {
        map.setMapStyle('amap://styles/939e2aedfffcb34a50bf00de88696a59')
        console.log('更改地图')
      } else {
        map.setMapStyle('amap://styles/normal')
        console.log('更改地图')
      }
    },
    pakinglotChange () {
      if (this.markersShow) {
        this.showParkinglot()
        this.addOverlayGoup()
      } else {
        this.clearParkinglot()
        this.clearOverlayGoup()
      }
    },
    // 清除标记点
    clearParkinglot () {
      map.remove(parkinglotLayer)
    },
    clearOverlayGoup () {
      if (this.overlayGoupShow !== false) {
        this.overlayGoupShow = false
        map.remove(overlayGoup)
      }
    },
    // 显示标记点
    showParkinglot () {
      this.$axios({
        method: 'get',
        url: 'https://api.ohaiyo.vip/parkinglot/',
        params: {
          page_size: 99
        }
      }).then((response) => {
        console.log(response)
        let that = this
        AMapLoader.load(response).then((AMap) => {
          // 标记图标
          // 标记文本样式
          var textStyle = {
            fontSize: 12,
            fontWeight: 'normal',
            fillColor: '#0077b6',
            strokeColor: '#fff',
            strokeWidth: 2,
            fold: true,
            padding: '2.5'
          }
          var markers = []
          // 新建标记点
          for (let i = 0; i < response.data.count; i++) {
            let curResponse = response.data.results[i]
            let icon = this.getIcon(curResponse.sum_num, curResponse.space_num)
            let curData = {
              name: curResponse.id,
              extData: {
                id: curResponse.id,
                space_num: curResponse.space_num
              },
              position: [curResponse.longitude, curResponse.latitude],
              zooms: [10, 20],
              opacity: 1,
              zIndex: 10,
              fold: true,
              icon: icon,
              text: {
                content: curResponse.name,
                style: textStyle
              }
            }
            let labelMarker = new AMap.LabelMarker(curData)
            // 绑定事件
            labelMarker.on('click', that.markerClike)
            labelMarker.on('mouseover', that.markerMouseOver)
            labelMarker.on('mouserout', that.markerMouseOut)
            markers.push(labelMarker)
          }
          // 新建标记图层
          parkinglotLayer = new AMap.LabelsLayer({
            zooms: [3, 20],
            zIndex: 1000,
            allowCollision: true
          })
          parkinglotLayer.add(markers)
          map.add(parkinglotLayer)
        }).catch(e => {
          console.log(e)
        })
      }).catch((response) => {
        console.log(response)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.amap-geolocation{
  bottom: 20px;
  right: 30px;
}
.wrapper {
  height: 100%;
  position: relative;
}
#container {
  height: 100%;
}
.swith-group {
  padding: 5px;
  border-radius: 6px;
  border: solid 1px #e6e6e6;
  width: 150px;
  top: 20px;
  right: 20px;
  background-color: rgb(250, 249, 249);
  position: absolute;
  z-index: 9999;
}
.echart {
    top: 20px;
    left: 20px;
    position: absolute;
    z-index: 9999;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.8);
}
.swithItem {
  margin:0 0 2px 0;
}
</style>
