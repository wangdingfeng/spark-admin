export default function(component) {
  try {
    switch (component) {
      case 'Layout':
        return require('@/layout').default
      default:
        return require('@/views/' + component + '.vue').default
    }
  } catch (e) {
    return import('@/views/404')
  }
}
