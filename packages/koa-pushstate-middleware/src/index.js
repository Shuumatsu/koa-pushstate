import path from 'path'
import send from 'send'

const defaultResolveFilePath = (root, reqPath) => path.join(root, reqPath).toLowerCase()

const middleware = (root, resolveFilePath, opts) => {
  root = path.resolve(root)

  if (!root)
    throw new Error('koa-pushstate-middleware: root is required')

  if (typeof resolveFilePath !== 'function')
    throw new Error('koa-pushstate-middleware: resolveFilePath option should be a function')

  return async (ctx, next) => {
    const { setHeaders, fallthrough, index } = opts

    const req = ctx.request
    const res = ctx.response

    // method not allowed
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (fallthrough)
        return next()

      res.status = 405
      res.set({
        'Allow': 'GET, HEAD',
        'Content-Length': '0'
      })
      return
    }

    const normalizedPath = path.normalize(req.path)
    let filepath = resolveFilePath(root, normalizedPath)
    let ext = path.extname(filepath)

    if (ext === '' || ext === '.html') {
      filepath = path.resolve(root, index)
      ext = '.html'
    }

    res.type = ext
    const stream = send(req, filepath, opts)

    setHeaders && stream.on('headers', setHeaders)

    let forwardError = false
    stream.on('file', () => {
      // once file is determined, always forward error
      forwardError = true
    })

    stream.on('error', err => {
      if (forwardError || err.statusCode >= 500)
        throw err

      next()
    })

    res.body = stream
  }
}

middleware.defaultResolveFilePath = defaultResolveFilePath

export default middleware