import request from '@/utils/request'

export function listDept(params) {
  return request({
    url: '/admin/dept/list',
    method: 'get',
    params
  })
}

export function saveDept(params) {
  return request({
    url: '/admin/dept/save',
    method: 'post',
    data: params
  })
}

export function updateDept(params) {
  return request({
    url: '/admin/dept/update',
    method: 'post',
    data: params
  })
}

export function deleteDept(id) {
  return request({
    url: `/admin/dept/delete/${id}`,
    method: 'delete'
  })
}

export function getDeptTree(isRoot) {
  return request({
    url: `/admin/dept/getTree`,
    method: 'get',
    params: {
      isRoot: isRoot
    }
  })
}
