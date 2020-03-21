import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/admin/authority/page',
    method: 'POST',
    params
  })
}

export function saveOauth(params) {
  return request({
    url: '/admin/authority/save',
    method: 'post',
    data: params
  })
}

export function updateOauth(params) {
  return request({
    url: '/admin/authority/update',
    method: 'post',
    data: params
  })
}

export function deleteOauth(id) {
  return request({
    url: `/admin/authority/delete/${id}`,
    method: 'delete'
  })
}

