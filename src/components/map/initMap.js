import Map from 'ol/Map'
import View from 'ol/View'
import { Tile as TileLayer } from 'ol/layer'
import XYZ from 'ol/source/XYZ'

const initMap = {
  data () {
    return {
      map: null,
      // 在线瓦片地图地址
      // url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=7',
      // url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      // url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
      // url: 'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      // url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      url: '/static/openStreetMapsichuan/{z}/{x}/{y}.png', // 加载离线瓦片地图
      // url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      // url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2Vya2VyIiwiYSI6ImNrM3U2dDN4dDBhankzaXFtYmNtNnBpMWIifQ.Tkd_IOzl1ZPaD3jTn68B3A',
      // url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      // url: 'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=7',
      // url: 'https://b.tile.openstreetmap.org/{x}/{y/{z}.png',
      // url: 'http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x=420&y=193&z=9&s=Galil',
      // 地图View展示选项配置
      viewOptions: {
        projection: 'EPSG:4326', // 坐标系
        // center: [102.87855327334883, 29.95539168988012], // [104.089175, 30.650451]
        center: [104.089175, 30.650451], // [104.089175, 30.650451]
        zoom: 8 // 地图显示级别
        // extent: [101.9004807124176, 28.837774208959473, 103.38848561448468, 30.9210929107385], // [minX, minY, maxX, maxY]
        // minZoom: 6, // 缩放最小级别
        // maxZoom: 19 // 缩放最大级别
      },
      view: null,
      source: null,
      pielayer: null // 点线信息的图层
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    // 加载地图底图
    initMap () {
      let _this = this
      var layers = new TileLayer({
        source: new XYZ({
          url: _this.url
        })
      })
      _this.view = new View(_this.viewOptions)
      this.map = new Map({
        layers: [ layers ],
        target: 'map',
        view: _this.view
      })
      this.addSource() // 加载温度区域
      this.popup() // 地图点击相关事件
      this.initWind() // 风场加载
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
