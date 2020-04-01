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
    url: '/admin/authority',
    method: 'post',
    data: params
  })
}

export function updateOauth(params) {
  return request({
    url: '/admin/authority',
    method: 'put',
    data: params
  })
}

export function deleteOauth(id) {
  return request({
    url: `/admin/authority/${id}`,
    method: 'delete'
  })
}

