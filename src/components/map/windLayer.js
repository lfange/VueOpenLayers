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
    const people = [
      { name: 'Tom', age: 25, city: 'Chengdu' },
      { name: 'Tom', age: 37, city: 'Chengdu' },
      { name: 'Jerry', age: 35, city: 'Beijing' },
      { name: 'Frank', age: 45, city: 'Shanghai' },
      { name: 'Frank', age: 32, city: 'Shanghai' }
    ]
    console.log(this.getAge(people))
  },
  methods: {
    getAge (people) {
      const counyAge = {}
      const average = []
      people.map(man => {
        counyAge[man.city] ? counyAge[man.city].push(man.age) : counyAge[man.city] = [man.age]
      })
      for (let man in counyAge) {
        let totolAge = counyAge[man].reduce(function (prev, cur) {
          return prev + cur
        })
        average.push({'city': man, average: totolAge / counyAge[man].length})
      }
      return average
    },
    // 风场加载
    initWind () {
      let _this = this
      const res = require('../json/2020050700.json')
      console.log(res)
      _this.windLay = new WindLayer(res, {
        forceRender: false,
        windOptions: {
          // colorScale: scale,
          velocityScale: 1 / 200,
          paths: 5000,
          // eslint-disable-next-line no-unused-vars
          colorScale: () => {
            // console.log(m);
            return '#ff473c'
          },
          width: 30,
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
    },
    reomovelayer () {
      console.log(this.map)
      this.map.removeLayer(this.windLay)
    }
  }
}
export default windLayer
