import Vue from 'vue'
import Router from 'vue-router'
import Amap from '@/components/Amap'
import Management from '@/components/Management'
import Log from '@/components/Log'
import Setting from '@/components/Setting'
import Home from '@/view/Home'
import SellePage from '@/view/SellerPage'
import TrendPage from '@/view/TrendPage'
import MapPage from '@/view/MapPage'
import RankPage from '@/view/RankPage'
import HotPage from '@/view/HotPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/rankpage',
      component: RankPage
    },
    {
      path: '/hotpage',
      component: HotPage
    },
    {
      path: '/sellerpage',
      component: SellePage
    },
    {
      path: '/mappage',
      component: MapPage
    },
    {
      path: '/trendpage',
      component: TrendPage
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'amap',
          name: 'amap',
          component: Amap
        }, {
          path: 'setting',
          name: 'setting',
          component: Setting
        }, {
          path: 'log',
          name: 'log',
          component: Log
        }, {
          path: 'management',
          name: 'management',
          component: Management
        }
      ]
    }
  ]
})
