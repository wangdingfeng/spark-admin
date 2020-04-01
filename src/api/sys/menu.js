import request from '@/utils/request'

export function listData(params) {
  return request({
    url: '/admin/menu/list',
    method: 'get',
    params
  })
}

export function saveMenu(params) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: params
  })
}

export function updateMenu(params) {
  return request({
    url: '/admin/menu',
    method: 'put',
    data: params
  })
}

export function deleteMenu(id) {
  return request({
    url: `/admin/menu/${id}`,
    method: 'delete'
  })
}

export function getMenuTree() {
  return request({
    url: `/admin/menu/tree`,
    method: 'get'
  })
}
