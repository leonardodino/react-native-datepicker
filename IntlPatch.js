const hasIntlSupport = () => {
  // order here is important. don't change.
  // [WTF]: android crashes even inside try-catch block.

  if (!global.Intl) return false

  const date = new Date()

  try {
    date.toLocaleDateString()
    date.toLocaleTimeString()
    date.toLocaleString()
  } catch (e) {
    return false
  }

  return true
}

if (!hasIntlSupport()) {
  require('intl')
  require('intl/locale-data/jsonp/en')
}
