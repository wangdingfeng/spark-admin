import store from '@/store'

/**
 * 获取字典列表
 * @param code
 * @returns {*}
 */
export function getDictList(code) {
  return store.getters.dicts[code]
}

/**
 *  通过值获得label
 * @param code
 * @param value
 */
export function getDictLabel(code, value) {
  let label = ''
  try {
    const dictList = store.getters.dicts[code]
    dictList.forEach((row) => {
      if (row.value === value.toString()) {
        label = row.label
      }
    })
  } catch (err) {
    console.error(err)
  }
  return label
}

/**
 * 通过label获得值
 * @param code
 * @param label
 * @returns {string}
 */
export function getDictValue(code, label) {
  let value = ''
  try {
    const dictList = store.getters.dicts[code]
    dictList.forEach((row) => {
      if (row.label === label) {
        value = row.value
      }
    })
  } catch (err) {
    console.error(err)
  }
  return value
}
