import request from '@/utils/request'

export function listRole(params) {
  return request({
    url: '/admin/role/page',
    method: 'post',
    params
  })
}

export function createRole(params) {
  return request({
    url: '/admin/role/save',
    method: 'post',
    data: params
  })
}

export function updateRole(params) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: params
  })
}

export function deleteRole(id) {
  return request({
    url: `/admin/role/delete/${id}`,
    method: 'delete'
  })
}

export function getRoleAuth(id) {
  return request({
    url: '/admin/role/getRoleAuth',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saveRoleAuth(params) {
  return request({
    url: '/admin/role/saveRoleAuth',
    method: 'post',
    data: params
  })
}

export function getRoleAll() {
  return request({
    url: '/admin/role/all',
    method: 'get'
  })
}

