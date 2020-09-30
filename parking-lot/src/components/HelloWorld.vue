<template>
  <div class="hello">
    <div id="container" tabindex="0" style="height: 400px">
    </div>
    <!-- <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul> -->
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
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
      var map = new AMap.Map('container')
      map.addControl(new AMap.Scale())
      map.addControl(new AMap.ToolBar())
      map.addControl(new AMap.MapType())
      // map.addControl(new AMap.HawkEye())
      map.add(new AMap.Maker({
        position: map.getCenter()
      }))
    }).catch(e => {
      console.log(e)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
