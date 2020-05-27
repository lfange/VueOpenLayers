<template>
  <div class="main">
    <div id="map" class="map" ></div>
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
    <blockMenu :menuArr="menuArr" @itemClick="itemClick" @menuClick="menuClick" class="blockScss"/>
    <el-button type="primary" @click="positionIcon([104.089175, 30.650451])">定位</el-button>
    <el-button type="primary" @click="reomovelayer([104.089175, 30.650451])">定位</el-button>
  </div>
</template>
<script>
import 'ol/ol.css'
import initMap from '@/components/map/initMap' // 加载地图底图
import popup from '@/components/map/popup'
import rendIcon from '@/components/map/icon'
import getData from '@/components/map/getData'
import cluster from '@/components/map/cluster'
import windLayer from '@/components/map/windLayer'
import blockMenu from '@/components/block-menu'
export default {
  components: {
    blockMenu
  },
  mixins: [ initMap, popup, rendIcon, getData, cluster, windLayer ],
  data () {
    return {
      loading: false,
      menuArr: [
        {
          title: '监测站',
          icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
          menuId: 1,
          children: [
            {
              name: '气象监测站',
              icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
              itemId: 1
            },
            {
              name: '水文监测站',
              icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
              itemId: 2
            },
            {
              name: '地质监测站',
              icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
              itemId: 3
            },
            {
              name: '视频监测站',
              icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
              itemId: 4
            }
          ]
        },
        {
          title: '项目',
          icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
          menuId: 2,
          children: [
            {
              name: '道路',
              icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
              itemId: 1
            },
            {
              name: '水库',
              icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
              itemId: 2
            },
            {
              name: '山坡',
              icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
              itemId: 3
            },
            {
              name: '景点',
              icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
              itemId: 4
            }
          ]
        },
        {
          title: '行政区域',
          icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
          menuId: 3
        },
        {
          title: '基础信息',
          icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
          menuId: 4
        },
        {
          title: '地图信息',
          icon: require('../../static/images/mipmap-mdpi/dingwei.png'),
          menuId: 5
        }
      ],
      popupLayer: null // 弹出框图层
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    itemClick (i) {
      console.log('i', i)
    },
    menuClick (i) {
      console.log('menuClick', i)
    }
  }
}
</script>
<style>
  .map {
    width: 100%;
    height: 60vh;
  }
  /* img {
    filter: grayscale(100%)!important;
    -webkit-filter: grayscale(100%)!important;
  } */
  .main {
    position: relative;
  }
  .ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
  }
  .ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }
  .ol-popup-closer:after {
    content: "✖";
  }
  .blockScss {
    width: 80px;
    position: fixed;
    top: 20%;
    left: 5%;
  }
</style>
