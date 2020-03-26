import request from '@/utils/request'

export function pageDict(params) {
  return request({
    url: '/admin/dict/page',
    method: 'post',
    params
  })
}

export function pageItemDict(params) {
  return request({
    url: '/admin/dict/page/item',
    method: 'post',
    params
  })
}

export function createDict(params) {
  return request({
    url: '/admin/dict/save',
    method: 'post',
    data: params
  })
}

export function createDictItem(params) {
  return request({
    url: '/admin/dict//save/item',
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

export function updateDictItem(params) {
  return request({
    url: '/admin/dict/update/item',
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

export function deleteDictItem(id) {
  return request({
    url: `/admin/dict/delete/item/${id}`,
    method: 'delete'
  })
}
