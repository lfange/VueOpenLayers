
import Feature from 'ol/Feature'
import {Vector as VectorLayer} from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import Point from 'ol/geom/Point'
import { Style, Icon, Stroke, Fill, Text } from 'ol/style'
import { Cluster } from 'ol/source'
// import $qs from 'qs'

const iconOpArray = {
  projectType: [], // 重点监测项目列表的额数据
  typeId: [], // 监测站点梳理列表
  type: []
}
iconOpArray.typeId[1] = '../../../static/images/mipmap-xhdpi/qxz.png'
iconOpArray.typeId[2] = '../../../static/images/mipmap-xhdpi/shuifen.png'
iconOpArray.typeId[3] = '../../../static/images/mipmap-xhdpi/dizhi.png'
iconOpArray.typeId[4] = '../../../static/images/mipmap-xhdpi/shipin.png'
iconOpArray.type[1] = '../../../static/images/mipmap-xhdpi/yiyuan.png'
iconOpArray.type[2] = '../../../static/images/mipmap-xhdpi/yjbl.png'
iconOpArray.type[3] = '../../../static/images/mipmap-xhdpi/yiyuan.png'
iconOpArray.type[4] = '../../../static/images/mipmap-xhdpi/paichusuo.png'
iconOpArray.projectType[1] = '../../../static/images/mipmap-xhdpi/daolu.png'
iconOpArray.projectType[2] = '../../../static/images/mipmap-xhdpi/shuiku.png'
iconOpArray.projectType[3] = '../../../static/images/mipmap-xhdpi/shanchen.png'
iconOpArray.projectType[4] = '../../../static/images/mipmap-xhdpi/jingdian.png'

const rendIcon = {
  data () {
    return {
      IconLayer: null,
      iconFeatures: [],
      positionLayer: [],
      clustersLayer: null // 聚合层
    }
  },
  methods: {
    styleFunction (feature) {
      return new Style({
        image: new Icon({
          src: feature.values_.src
        })
      })
    },
    IconInit (data) {
      console.log('datasss', this.distance)
      let _this = this
      // 重新组装数据
      const geojsonObject = {
        type: 'FeatureCollection',
        crs: {
          type: 'Feature'
        },
        features: []
      }
      data.map(icon => {
        let type
        if (icon.type) {
          type = 'type'
        } else if (icon.typeId) {
          type = 'typeId'
        } else if (icon.projectType) {
          type = 'projectType'
        }
        // 动态添加地图需要的数据对象
        const iconType = icon.projectType || icon.typeId || icon.type
        icon.src = iconOpArray[type][iconType]
        const center = type === 'projectType' ? this.isIconFeature(icon) : [icon.lng, icon.lat]
        let obj = {
          type: 'Feature',
          properties: icon,
          geometry: {
            type: 'Point',
            coordinates: center
          }
        }
        geojsonObject.features.push(obj)
        // this.iconFeature(type, icon, index)
      })
      // 展示数据的数据源
      _this.VectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObject)
      })
      console.log('_this.VectorSource_this.VectorSource', _this.VectorSource)
      console.log('geojsonObject', geojsonObject)
      // console.log('_this.iconFeatures', _this.iconFeatures)
      _this.IconLayer = new VectorLayer({
        source: _this.VectorSource,
        style: _this.styleFunction
      })
      _this.map.addLayer(_this.IconLayer)
      this.loading = false
      // this.Cluster()
    },
    // 聚合绘制
    Cluster () {
      let _this = this
      var clusterSource = new Cluster({
        distance: parseInt(_this.distance.value, 10),
        source: _this.VectorSource
      })
      var styleCache = {}
      _this.clustersLayer = new VectorLayer({
        source: clusterSource,
        style: function (feature) {
          var size = feature.get('features').length
          var style = styleCache[size]
          var src = feature.get('features')[0].values_.src
          if (!style) {
            style = new Style({
              image: new Icon({
                src: src
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: '#fff'
                })
              })
            })
            styleCache[size] = style
          }
          return style
        }
      })
      this.map.addLayer(_this.clustersLayer)
      this.distance.addEventListener('input', function () {
        clusterSource.setDistance(parseInt(this.distance.value, 10))
      })
      // this.ClusterLayer
    },
    // 监测项目判断是点还是线
    isIconFeature (icon) {
      if (!icon.loc) return false
      let arr = icon.loc.slice(2, -2).split(',')
      arr.map((it, index) => {
        if (it.indexOf('{') > -1) {
          arr[index] = it.replace(/\{/g, '')
          it = it.substring(it.indexOf('{'))
        } else if (it.indexOf('}') > -1) {
          arr[index] = it.replace(/\}/g, '')
        }
      })
      let changeArr = []
      arr.forEach((element, index) => {
        if (arr.length > 2) {
          if (index % 2 === 0) {
            changeArr[index] = arr[index + 1]
            changeArr[index + 1] = arr[index]
          }
        } else {
          if (index % 2 === 0) {
            changeArr[index] = arr[index + 1]
            changeArr[index + 1] = arr[index]
          }
        }
      })
      console.log('changeArr', changeArr)
      return changeArr
    },
    // 每一个icon图标
    iconFeature (type, icon, index) {
      // let icons = type === 'projectType' ? JSON.parse(`[10${4 - index}.089175, 30.650451]`) : [icon.lng, icon.lat]
      let center = type === 'projectType' ? this.isIconFeature(icon) : [icon.lng, icon.lat]
      if (center.length === 0) return
      if (center.length > 2) {
        this.LineFeature(center, icon)
      } else {
        var iconFeature = new Feature({
          geometry: new Point(center),
          name: icon.projectName,
          population: 4000,
          data: Object.assign({}, icon),
          rainfall: 500
        })
        const iconType = icon.projectType || icon.typeId || icon.type
        // 每一个icon元素
        var iconStyle = new Style({
          image: new Icon({
            src: iconOpArray[type][iconType]
          })
        })
        iconFeature.setStyle(iconStyle)
        this.iconFeatures.push(iconFeature)
      }
    },
    // 画线
    LineFeature (center, incon) {
      console.log('cneter, incon', center, incon)
      var lineFeature = new Feature({
        geometry: new Point(center)
      })
      let lineStyle = new Style({
        stroke: new Stroke({
          color: 'green',
          width: 1
        })
      })
      lineFeature.setStyle(lineStyle)
      this.iconFeatures.push(lineFeature)
    },
    iconAddLayer () {
      let _this = this
      _this.map.removeLayer(_this.IconLayer)
      _this.IconLayer = null
    },
    // 位置图标显示
    positionIcon (center) {
      var iconFeature = new Feature({
        geometry: new Point(center),
        name: '当前位置',
        population: 4000,
        rainfall: 500
      })
      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          scale: 0.4,
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: '../../../static/images/dingwei.png'
        })
      })
      iconFeature.setStyle(iconStyle)
      var vectorSource = new VectorSource({
        features: [iconFeature]
      })
      this.positionLayer = new VectorLayer({
        source: vectorSource
      })
      this.map.addLayer(this.positionLayer)
    }
  }
}

export { rendIcon }
