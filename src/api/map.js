import request from '@/utils/request'
import $qs from 'qs'

// 普通登录
export function userLogin (data) {
  return request({
    url: '/login',
    method: 'post',
    data: $qs.stringify(data)
  })
}
