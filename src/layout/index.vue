<template>
  <div class="main">
    <div id="map" class="map" ></div>
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
    <el-button type="primary" @click="positionIcon([104.089175, 30.650451])">定位</el-button>
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
export default {
  mixins: [ initMap, popup, rendIcon, getData, cluster, windLayer ],
  data () {
    return {
      loading: false,
      popupLayer: null // 弹出框图层
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
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
</style>
