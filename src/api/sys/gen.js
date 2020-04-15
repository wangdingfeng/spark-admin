import request from '@/utils/request'

export function tablePage(params) {
  return request({
    url: '/admin/gen/page',
    method: 'get',
    params
  })
}

export function columnList(params) {
  return request({
    url: '/admin/gen/column',
    method: 'get',
    params
  })
}

export function downloadZip(params) {
  return request({
    url: '/admin/gen/zip',
    method: 'get',
    params
  })
}
