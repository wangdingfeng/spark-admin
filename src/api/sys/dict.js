import request from '@/utils/request'

export function listDict(params) {
  return request({
    url: '/admin/dict/page',
    method: 'get',
    params
  })
}

export function saveDict(params) {
  return request({
    url: '/admin/dict/save',
    method: 'post',
    data: params
  })
}

export function updateDict(params) {
  return request({
    url: '/admin/dict/update',
    method: 'post',
    data: params
  })
}

export function deleteDict(id) {
  return request({
    url: `/admin/dict/delete/${id}`,
    method: 'delete'
  })
}

export function getDictTree() {
  return request({
    url: `/admin/dict/getTree`,
    method: 'get'
  })
}
