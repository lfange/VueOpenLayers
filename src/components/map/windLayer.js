import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source.js'
import { TempeStyle } from '@/utils/Linestyle.js'
import { WindLayer } from 'ol-wind'

const windLayer = {
  data () {
    return {
      windLay: null
    }
  },
  mounted () {
  },
  methods: {
    // 风场加载
    initWind () {
      let _this = this
      const res = require('../json/2020050700.json')
      console.log(res)
      _this.windLay = new WindLayer(res, {
        forceRender: false,
        windOptions: {
          // colorScale: scale,
          globalAlpha: 0.8,
          velocityScale: 1 / 80,
          paths: 5000,
          width: 3, // 线的宽度
          // eslint-disable-next-line no-unused-vars
          colorScale: [
            'rgb(36,104, 180)',
            'rgb(60,157, 194)',
            'rgb(128,205,193 )',
            'rgb(151,218,168 )',
            'rgb(198,231,181)',
            'rgb(238,247,217)',
            'rgb(255,238,159)',
            'rgb(252,217,125)',
            'rgb(255,182,100)',
            'rgb(252,150,75)',
            'rgb(250,112,52)',
            'rgb(245,64,32)',
            'rgb(237,45,28)',
            'rgb(220,24,32)',
            'rgb(180,0,35)'
          ],
          // colorScale: scale,
          generateParticleOption: false
        }
        // map: map,
        // projection: 'EPSG:4326'
      })
      this.map.addLayer(_this.windLay)
    },
    // 加载要展示的风云等数据层
    addSource () {
      const dats = require('../../../static/json/data.json')
      let _this = this
      // 显示数据源
      var fees = new GeoJSON().readFeaturesFromObject(dats)
      this.source = new VectorSource({
        features: fees
      })
      var vector = new VectorLayer({
        source: _this.source,
        style: TempeStyle,
        opacity: 0.4
      })
      //  获取这个图层上面加的点线信息 this.pielayer.getSource().getFeatures()
      _this.pielayer = vector
      this.map.addLayer(_this.pielayer)
    }
  }
}
export default windLayer
