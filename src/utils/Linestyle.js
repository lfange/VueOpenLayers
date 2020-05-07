import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text } from 'ol/style.js'

// 温度颜色
const getTempeColor = function (size) {
  let color = ''
  if (size < -30) {
    color = 'rgb(11,39,149)'
  } else if (size > -30 && size <= -25) {
    color = 'rgb(11,67,196)'
  } else if (size > -25 && size <= -20) {
    color = 'rgb(24,108,213)'
  } else if (size > -20 && size <= -15) {
    color = 'rgb(50,147,244)'
  } else if (size > -15 && size <= -10) {
    color = 'rgb(101,184,246)'
  } else if (size > -10 && size <= -5) {
    color = 'rgb(151,207,244)'
  } else if (size > -5 && size <= 0) {
    color = 'rgb(192,231,249)'
  } else if (size > 0 && size <= 5) {
    color = 'rgb(233,255,255)'
  } else if (size > 5 && size <= 10) {
    color = 'rgb(255,255,200)'
  } else if (size > 10 && size <= 15) {
    color = 'rgb(251,241,160)'
  } else if (size > 15 && size <= 20) {
    color = 'rgb(255,228,121)'
  } else if (size > 20 && size <= 25) {
    color = 'rgb(255,204,79)'
  } else if (size > 25 && size <= 30) {
    color = 'rgb(242,155,2)'
  } else if (size > 30 && size <= 35) {
    color = 'rgb(240,118,9)'
  } else if (size > 35 && size <= 40) {
    color = 'rgb(231,75,30)'
  } else if (size > 40 && size <= 45) {
    color = 'rgb(169,3,16)'
  } else if (size > 45 && size < 50) {
    color = 'rgb(102,0,22)'
  } else if (size > 55) {
    color = 'rgb(170,0,13)'
  }
  return color
}
// 温度颜色绘制
export function TempeStyle (feature) {
  const tempeVetor = new Style({
    stroke: new Stroke({
      color: getTempeColor(feature.getProperties().lvalue),
      lineDash: [4],
      width: 2,
      opacity: 0.3
    }),
    fill: new Fill({
      color: getTempeColor(feature.getProperties().lvalue)
    })
  })

  return tempeVetor
}

// 划线默认样式
const defaultStyle = new Style({
  // 填充颜色;
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  // 线颜色
  stroke: new Stroke({
    color: '#ffcc33',
    width: 4
  }),
  image: new Icon({
    imgSize: [10, 10],
    src: './static/img/point.jpg'
  }),
  images: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: '#ffcc33'
    })
  }),
  text: new Text({
    textAlign: 'center',
    // offsetY: offY,
    // offsetX: offX,
    textBaseline: 'middle',
    font: '12px Calibri,sans-serif',
    overflow: true,
    fill: new Fill({
      color: 'white'
    })
  })
})

// 选择选中过后样式;
const selectStyle = new Style({
  fill: new Fill({
    color: 'green'
  }),
  stroke: new Stroke({
    color: 'red',
    width: 4
  }),
  image: new Icon({
    imgSize: [20, 20],
    src: './static/img/point.png'
  }),
  images: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: 'red'
    })
  })
})

const normalstyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  stroke: new Stroke({
    color: '#ffcc33',
    width: 4
  }),
  image: new Icon({
    src: './static/img/point.jpg'
  }),
  images: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#ffcc33'
    })
  })
})
const highlightstyle = new Style({
  stroke: new Stroke({
    color: 'rgb(255,0,0,0.5)',
    width: 4
  }),
  fill: new Fill({
    color: 'red'
  }),
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: 'red'
    })
  })
})

export { defaultStyle, selectStyle, normalstyle, highlightstyle }
