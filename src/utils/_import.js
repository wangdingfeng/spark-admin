export default function(component) {
  switch (component) {
    case 'Layout':
      return require('@/layout').default
    default:
      return require('@/views/' + component + '/index').default
  }
}
