import Overlay from 'ol/Overlay'
import { toStringHDMS } from 'ol/coordinate'
import { toLonLat } from 'ol/proj'

const popup = {
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
        _this.popupLayer.setPosition(undefined)
        closer.blur()
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
          var coordinates = feature.getGeometry().getCoordinates()
          _this.popupLayer.setPosition(coordinates)
        }
      })
    }
  }
}

export default popup
