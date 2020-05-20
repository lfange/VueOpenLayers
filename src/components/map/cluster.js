import {createEmpty, getWidth, getHeight, extend} from 'ol/extent'
import {Vector as VectorLayer} from 'ol/layer'
import {Cluster} from 'ol/source'
import {Circle as CircleStyle, Fill, Stroke, Style, Icon, Text} from 'ol/style'
import { TempeStyle, rainStyle, areaStyle } from '@/utils/Linestyle.js'

const cluster = {
  data () {
    return {
      earthquakeFill: new Fill({
        color: 'rgba(255, 153, 0, 0.8)'
      }),
      earthquakeStroke: new Stroke({
        color: 'rgba(255, 204, 0, 0.2)',
        width: 1
      }),
      textFill: new Fill({
        color: '#409EFF'
      }),
      textStroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.6)',
        width: 3
      }),
      invisibleFill: new Fill({
        color: 'rgba(255, 255, 255, 0.01)'
      }),
      currentResolution: null,
      maxFeatureCount: null,
      clustLayer: null
    }
  },
  mounted () {
    // this.initCluter()
  },
  methods: {
    initCluter () {
      let _this = this
      this.clustLayer = new VectorLayer({
        source: new Cluster({
          distance: 40,
          source: _this.clusterVetSource,
          geometryFunction: _this.geometryFunction
        }),
        style: _this.clusStyleFunction
      })
      this.map.addLayer(this.clustLayer)
    },
    romoveCulstLayer () {
      if (this.clustLayer) this.map.removeLayer(this.clustLayer)
      if (this.IconLayer) this.map.removeLayer(this.IconLayer)
      if (this.pielayer) this.map.removeLayer(this.pielayer)
    },
    geometryFunction (feature) {
      if (feature.getGeometry().getType() === 'LineString') {
        return null
      }
      return feature.getGeometry()
    },
    calculateClusterInfo (resolution) {
      let _this = this
      _this.maxFeatureCount = 0
      var features = this.clustLayer.getSource().getFeatures()
      var feature, radius
      for (var i = features.length - 1; i >= 0; --i) {
        feature = features[i]
        var originalFeatures = feature.get('features')
        var extent = createEmpty()
        let j = (void 0)
        let jj = (void 0)
        for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
          extend(extent, originalFeatures[j].getGeometry().getExtent())
        }
        _this.maxFeatureCount = Math.max(_this.maxFeatureCount, jj)
        radius = 0.25 * (getWidth(extent) + getHeight(extent)) / resolution

        feature.set('radius', radius)
      }
    },
    // 聚合样式
    clusStyleFunction (feature, resolution) {
      let _this = this
      if (resolution !== _this.currentResolution) {
        _this.calculateClusterInfo(resolution)
        _this.currentResolution = resolution
      }
      var style
      var size = feature.get('features').length

      if (size > 1) {
        style = new Style({
          image: new CircleStyle({
            radius: feature.get('radius'),
            fill: new Fill({
              color: [209, 231, 254, Math.min(0.8, 0.4 + (size / _this.maxFeatureCount))]
            })
          }),
          text: new Text({
            font: '14px sans-serif',
            text: size.toString(),
            fill: _this.textFill
            // stroke: _this.textStroke
          })
        })
      } else {
        var originalFeature = feature.get('features')[0]
        style = this.styleFunction(originalFeature)
      }
      return style
    },
    // 聚合状态选中样式设置
    selectStyleFunction (feature) {
      // if (feature.getGeometry().getType() !== 'Point') return feature
      let _this = this
      var styles = [new Style({
        image: new CircleStyle({
          radius: feature.get('radius'),
          fill: _this.invisibleFill
        })
      })]
      var originalFeatures = feature.get('features')
      if (originalFeatures) {
        var originalFeature
        for (var i = originalFeatures.length - 1; i >= 0; --i) {
          originalFeature = originalFeatures[i]
          styles.push(_this.styleFunction(originalFeature))
          // styles.push(_this.createEarthquakeStyle(originalFeature))
        }
      } else {
        // 聚合状态，不是聚合图层的线做处理
        if (feature.values_.name === 'warning') {
          styles.push(new Style({
            image: new Icon({
              scale: 1.5,
              src: '/static/images/mipmap-xhdpi/xianqing.png'
            })
          }))
        } else if (feature.values_.name === '点击位置') {
          styles.push(new Style({
            image: new Icon({
              scale: 0.8,
              src: '/static/images/setIcon.png'
            })
          }))
        } else if (feature.values_.name === '模式预报') {
          styles.push(_this.modelStyle(feature))
        } else if (feature.values_.hvalue || feature.values_.hvalue === 0) {
          const styleFuntion = this.factorType === 1 ? TempeStyle : rainStyle
          // 等值线温度选择样式
          styles.push(styleFuntion(feature))
        } else if (feature.getGeometry().getType() === 'MultiPolygon') { // 行政区域
          styles.push(areaStyle(feature))
        } else {
          styles.push(_this.styleFunction(feature))
        }
      }

      return styles
    },
    createEarthquakeStyle (feature) {
      return new Style({
        geometry: feature.getGeometry(),
        image: new Icon({
          src: feature.values_.src
        })
      })
    }
  }
}
export default cluster
