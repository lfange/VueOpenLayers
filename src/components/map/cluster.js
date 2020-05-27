import {createEmpty, getWidth, getHeight, extend} from 'ol/extent'
import {Vector as VectorLayer} from 'ol/layer'
import {Cluster} from 'ol/source'
import {Circle as CircleStyle, Fill, Stroke, Style, Text, RegularShape, Icon} from 'ol/style'

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
        color: '#fff'
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
          source: _this.VectorSource
        }),
        style: _this.clusStyleFunction
      })
      console.log('this.clustLayer', _this.VectorSource)
      this.map.addLayer(this.clustLayer)
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
              color: [255, 153, 0, Math.min(0.8, 0.4 + (size / _this.maxFeatureCount))]
            })
          }),
          text: new Text({
            text: size.toString(),
            fill: _this.textFill,
            stroke: _this.textStroke
          })
        })
      } else {
        console.log('feature', feature)
        var originalFeature = feature.get('features')[0]
        console.log('originalFeature', originalFeature)
        style = new Style({
          image: new Icon({
            src: originalFeature.values_.src
          })
        })
      }
      return style
    },
    createEarthquakeStyle (feature) {
      let _this = this
      // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
      // standards-violating <magnitude> tag in each Placemark.  We extract it
      // from the Placemark's name instead.
      var name = feature.get('name')
      var magnitude = parseFloat(name.substr(2))
      var radius = 5 + 20 * (magnitude - 5)

      return new Style({
        geometry: feature.getGeometry(),
        image: new RegularShape({
          radius1: radius,
          radius2: 3,
          points: 5,
          angle: Math.PI,
          fill: _this.earthquakeFill,
          stroke: _this.earthquakeStroke
        })
      })
    }
  }
}
export default cluster
