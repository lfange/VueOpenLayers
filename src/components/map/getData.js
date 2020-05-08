
const getData = {
  data () {
    return {
      appisCall: 0,
      appGetParams: {
        station: null,
        projectList: null,
        baseList: 2
      }
    }
  },
  watch: {
    'appisCall' (news) {
      // alert('news' + news)
      if (news === 3) {
        this.waitData()
        this.appisCall = 0
      }
    }
  },
  methods: {
    // app直接推送地图展示数据
    async waitData () {
      this.iconAddLayer() // 删除之前的站点信息
      this.loading = true
      const data = []
      try {
        if (this.appGetParams.station) {
          const typeId = JSON.parse(this.appGetParams.station) // 监测站点列表
          if (typeId && typeId.length !== 0) data.push(...typeId)
        }
        if (this.appGetParams.projectList) {
          const projectType = JSON.parse(this.appGetParams.projectList) // 项目列表
          if (projectType && projectType.length !== 0) data.push(...projectType)
        }
        if (this.appGetParams.baseList) {
          const type = JSON.parse(this.appGetParams.baseList) // 基础数据列表
          if (type && type.length !== 0) data.push(...type)
        }
        if (data) this.IconInit(data)
      } catch (err) {
        this.loading = false
      }
    }
  }
}

export default getData
