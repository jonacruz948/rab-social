function getFileExtension(filename) {
  const parts = filename.split('.')
  return parts[parts.length - 1]
}

export const isImage = (filename) => {
  const ext = getFileExtension(filename).toLowerCase()
  if (
    ext === 'jpg' ||
    ext === 'jpeg' ||
    ext === 'gif' ||
    ext === 'bmp' ||
    ext === 'png' ||
    ext === 'webp'
  )
    return true
  return false
}

export const isVideo = (filename) => {
  const ext = getFileExtension(filename).toLowerCase()
  if (ext === 'mp4' || ext === 'avi' || ext === 'mpg' || ext === 'm4v')
    return true
  return false
}
