import Map from 'ol/Map'
import View from 'ol/View'
import { Tile as TileLayer } from 'ol/layer'
import {getWidth, getTopLeft} from 'ol/extent'
import {get as getProjection} from 'ol/proj'
import TileWMS from 'ol/source/TileWMS'
// import OSM from 'ol/source/OSM.js'
import XYZ from 'ol/source/XYZ'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import {defaults as defaultInteractions, Select} from 'ol/interaction'

const initMap = {
  data () {
    return {
      map: null,
      // 在线瓦片地图地址
      // url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=7',
      // url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      // url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
      // url: 'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      oneUrl: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      url: 'http://map.kedalo.com:8080/geoserver/chinaosm/wms',
      // url: '/static/openStreetMapsichuan/{z}/{x}/{y}.png', // 加载离线瓦片地图
      // url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      // url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2Vya2VyIiwiYSI6ImNrM3U2dDN4dDBhankzaXFtYmNtNnBpMWIifQ.Tkd_IOzl1ZPaD3jTn68B3A',
      // url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      // url: 'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=7',
      sateurl: '"http://{a-c}.sm.mapstack.stamen.com/" + "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" + "{z}/{x}/{y}.png',
      // url: 'https://b.tile.openstreetmap.org/{x}/{y/{z}.png',
      // url: 'http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x=420&y=193&z=9&s=Galil',
      // 地图View展示选项配置
      viewOptions: {
        projection: 'EPSG:4326',
        // center: [102.87855327334883, 29.95539168988012], // [104.089175, 30.650451]
        center: [102.80782229576563, 29.99161871305035], // [104.089175, 30.650451]
        zoom: 10,
        // extent: [100.65931204699675, 27.878467612358467, 104.12786186377534, 31.210931187242686], // [minX, minY, maxX, maxY]
        // minZoom: 7,
        maxZoom: 15
      },
      view: null,
      source: null,
      baseLayer: null,
      oneLayer: null,
      pielayer: null // 点线信息的图层
    }
  },
  mounted () {
    this.initMapType()
    this.initMap()
  },
  methods: {
    initMapType () {
      let _this = this
      var projection = getProjection('EPSG:4326')
      var projectionExtent = projection.getExtent()
      var size = getWidth(projectionExtent) / 256
      var resolutions = new Array(14)
      var matrixIds = new Array(14)
      for (var z = 0; z < 14; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z)
        matrixIds[z] = z
      }
      // 普通地图底图
      _this.baseLayer = new TileLayer({
        source: new TileWMS({
          url: _this.url,
          params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            'LAYERS': 'chinaosm:osm',
            'exceptions': 'application/vnd.ogc.se_inimage',
            tilesOrigin: 8153786 + ',' + 1779502.5},
          serverType: 'geoserver',
          crossOrigin: 'anonymous'
        })
      })

      // // 卫星地图底图
      this.oneLayer = new TileLayer({
        source: new XYZ({
          url: _this.oneUrl
        })
      })

      this.satelayer = new TileLayer({
        source: new WMTS({
          attributions: '',
          url: 'http://t{0-6}.tianditu.com/img_c/wmts?tk=405a9c7a0f92da453ee4162bbc64e008',
          // url: 'http://map.kedalo.com:8080/geoserver/gwc/chinaosm/wmts',
          layer: 'img',
          matrixSet: 'c',
          format: 'tiles',
          projection: projection,
          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
          }),
          style: 'default',
          wrapX: true
        })
      })

      var wmsSource = new WMTS({
        attributions: '',
        url: 'http://map.kedalo.com:8080/geoserver/gwc/chinaosm/wmts',
        layer: '0',
        matrixSet: 'EPSG:4326',
        format: 'image/png',
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true
      })
      var wmsLayer = new TileLayer({
        source: wmsSource
      })
      console.log('wmsLayer', wmsLayer)
    },
    // 加载地图底图
    initMap () {
      let _this = this
      _this.view = new View(_this.viewOptions)
      this.map = new Map({
        // 移动端禁止地图旋转  pinchRotate
        interactions: defaultInteractions({ pinchRotate: false }).extend([new Select({
          condition: function (evt) {
            return evt.type === 'pointermove' || evt.type === 'singleclick'
          },
          style: _this.selectStyleFunction // 设置聚合状态选中样式
        })]),
        layers: [ _this.oneLayer ],
        target: 'map',
        view: _this.view
      })
      // this.addSource() // 加载温度区域
      this.popup() // 地图点击相关事件
      // this.initWind() // 风场加载
    },
    // 定位
    setPosition (center) {
      this.view.animate({
        center: center,
        duration: 1500
      })
    }
  }
}

export default initMap
