export default function(component) {
  try {
    switch (component) {
      case 'Layout':
        return require('@/layout').default
      default:
        return require('@/views/' + component + '/index').default
    }
  } catch (e) {
    return import('@/views/404')
  }
}
