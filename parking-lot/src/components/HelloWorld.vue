<template>
  <div class="wrapper">
    <div @click="showParkinglot">标注停车场</div>
    <div @click="changeMapStyle">改变地图风格</div>
    <div @click="clearParkinglot">清除停车场标记</div>
    <div id="container" tabindex="0">
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import {linePath1, linePath2, linePath3, path1} from '../assets/js/carport'
var map
var parkinglotLayer
var overlayGoup
var spaceNumText
export default {
  name: 'HelloWorld',
  data () {
    return {
      mapStyleChanged: false,
      markersCleared: false
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
    }, linePath1, linePath2, linePath3, path1, map).then((AMap) => {
      map = new AMap.Map('container', {
        zoom: 17,
        center: [125.27942, 43.822074],
        viewMode: '3D',
        resizeEnable: true
      })
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
        strokeWeight: 10,
        zoom: [15, 22]
      })
      let polyline2 = new AMap.Polyline({
        path: linePath1,
        strokeColor: 'red',
        strokeWeight: 10,
        zoom: [15, 22]
      })
      let polyline3 = new AMap.Polyline({
        path: linePath3,
        strokeColor: 'red',
        strokeWeight: 10,
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
      map.addControl(new AMap.Scale())
      map.addControl(new AMap.ToolBar())
      map.addControl(new AMap.MapType())
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          zoomToAccuracy: true,
          showButton: false
        })
        map.addControl(geolocation)
      })
      map.add(overlayGoup)
      // 绑定地图事件
      map.on('click', that.mapClick)
    }).catch(e => {
      console.log(e)
    })
  },
  methods: {
    // 地图点击事件
    mapClick (e) {
      console.log(e)
    },
    // 标记点点击事件
    markerClike (e) {
      console.log(e, '标记点事件')
    },
    // 标记点鼠标移入事件
    markerMouseOver (e) {
      console.log('鼠标移入事件', e)
      let curposition = e.target._position
      this.$axios({
        methods: 'get',
        url: 'https://api.ohaiyo.vip/parkinglot/',
        params: {
          id: e.target._opts.extData.id
        }
      }).then((response) => {
        // 添加文本描述
        let num = response.data.results.space_num
        AMapLoader.load(response, curposition).then((AMap) => {
          var icon = new AMap.Icon({
            image: require('../assets/carparking1.png'),
            size: new AMap.Size(24, 24)
          })

          var textStyle = {
            fontSize: 12,
            fontWeight: 'normal',
            fillColor: '#22886f',
            strokeColor: '#fff',
            strokeWidth: 2,
            fold: true,
            padding: '2.5'
          }
          spaceNumText = new AMap.Marker({
            name: num,
            position: curposition,
            zooms: [10, 20],
            opacity: 1,
            zIndex: 13,
            fold: true,
            icon: icon,
            text: {
              content: num,
              style: textStyle
            }
          })
        map.add(spaceNumText)
        })
      })
    },
    // 更改地图样式
    changeMapStyle () {
      if (this.mapStyleChanged) {
        map.setMapStyle('amap://styles/normal')
        this.mapStyleChanged = false
      } else {
        map.setMapStyle('amap://styles/939e2aedfffcb34a50bf00de88696a59')
        console.log('更改地图')
        this.mapStyleChanged = true
      }
    },
    // 清除标记点
    clearParkinglot () {
      if (this.markersCleared !== true) {
        this.mapStyleChanged = true
        map.remove(parkinglotLayer)
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
          var icon = [
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
            }
          ]
          // 标记文本样式
          var textStyle = {
            fontSize: 12,
            fontWeight: 'normal',
            fillColor: '#22886f',
            strokeColor: '#fff',
            strokeWidth: 2,
            fold: true,
            padding: '2.5'
          }
          var markers = []
          // 新建标记点
          for (let i = 0; i < response.data.count; i++) {
            let curResponse = response.data.results[i]
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
              icon: icon[0],
              text: {
                content: curResponse.name,
                style: textStyle
              }
            }
            let labelMarker = new AMap.LabelMarker(curData)
            // 绑定事件
            labelMarker.on('click', that.markerClike)
            labelMarker.on('mouseover', that.markerMouseOver)
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
}
#container {
  height: 100%;
}
</style>
