import { projectList, stieList, basicList } from '@/api/map'

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
    // 监测站点列表
    StationList (params) {
      // let params = {type: 1}
      return new Promise((resolve, reject) => {
        stieList(params).then(res => {
          // 删除图层从新绘制
          this.res = res
          console.log('resres', res)
          resolve(res.data.data)
        })
      })
    },
    // 重点监测项目数据列表
    ProjectList (params) {
      // let params = {type: 1}
      return new Promise((resolve, reject) => {
        projectList(params).then(res => {
          this.res = res
          console.log('projectType', res.data.data)
          resolve(res.data.data)
        })
      })
    },
    // 基础数据列表
    BaseList (params) {
      // let params = { type: 1 }
      return new Promise((resolve, reject) => {
        basicList(params).then(res => {
          this.res = res
          // console.log('showBaseList', res.data.data)
          resolve(res.data.data)
        })
      })
    },
    // 控制所有数据 前端请求数据的方式
    async waitData1 () {
      this.iconAddLayer() // 删除之前的站点信息
      this.loading = true
      const data = []
      try {
        if (this.appGetParams.station) {
          var typeId = await this.StationList(this.appGetParams.station) // 监测站点列表
          if (typeId && typeId.length !== 0) data.push(...typeId)
        }
        if (this.appGetParams.projectList) {
          var projectType = await this.ProjectList() // 项目列表
          if (projectType && projectType.length !== 0) data.push(...projectType)
        }
        if (this.appGetParams.baseList) {
          var type = await this.BaseList() // 基础数据列表
          if (type && type.length !== 0) data.push(...type)
        }
        if (data) this.IconInit(data)
      } catch (err) {
        this.loading = false
      }
    },
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
