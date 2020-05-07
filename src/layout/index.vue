<template>
  <div class="main">
    <div id="map" class="map" ></div>
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
    <el-button type="primary">定位</el-button>
    <button @click="waitData1">waitData1</button>
  </div>
</template>
<script>
import 'ol/ol.css'
import Overlay from 'ol/Overlay'
import { toStringHDMS } from 'ol/coordinate'
import { toLonLat } from 'ol/proj'
import initMap from '@/components/map/initMap' // 加载地图底图
import rendIcon from '@/components/map/icon'
import getData from '@/components/map/getData'
import cluster from '@/components/map/cluster'
import windLayer from '@/components/map/windLayer'
export default {
  mixins: [ initMap, rendIcon, getData, cluster, windLayer ],
  data () {
    return {
      res: null,
      loading: false,
      popupLayer: null // 弹出框样式
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    popup () {
      let _this = this
      var container = document.getElementById('popup')
      var content = document.getElementById('popup-content')
      var closer = document.getElementById('popup-closer')
      _this.popupLayer = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      })
      closer.onclick = function () {
        // _this.popupLayer.setPosition(undefined)
        // closer.blur()
        return false
      }
      _this.map.addOverlay(_this.popupLayer)
      // display popup on click
      _this.map.on('singleclick', function (evt) {
        var coordinate = evt.coordinate
        var hdms = toStringHDMS(toLonLat(coordinate))
        console.log('coordinate', coordinate)
        content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>'
        var feature = _this.map.forEachFeatureAtPixel(evt.pixel,
          function (feature) {
            return feature
          })
        if (feature) {
          console.log('feature.values_', feature.values_)
          // var coordinates = feature.getGeometry().getCoordinates()
          // _this.popupLayer.setPosition(coordinates)
        }
      })
      // change mouse cursor when over marker
      // _this.map.on('pointermove', function (e) {
      // if (e.dragging) {
      // $(element).popover('destroy')
      // return
      // }
      // var pixel = _this.map.getEventPixel(e.originalEvent)
      // var hit = _this.map.hasFeatureAtPixel(pixel)
      // _this.map.getTarget().style.cursor = hit ? 'pointer' : ''
      // })
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
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.2);
  }
  .loading p {
    width: 100px;
    margin: 50% auto 0;
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
