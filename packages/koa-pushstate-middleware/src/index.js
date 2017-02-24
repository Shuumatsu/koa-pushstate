import path from 'path'
import fs from 'fs'
import mime from 'mime-types'
import {
  fileStats,
  ensureNoSlash
} from 'koa-pushstate-utils'
import _debug from 'debug'
const debug = _debug('koa-pushstate-middleware')

const defaultResolveFilePath = (reqPath, directory) => {
  const paths = ensureNoSlash(reqPath).split('/')

  return path.resolve(directory, ...paths)
}

export default ({directory, indexHtml = 'index.html', defer = false, test = /[\s\S]/, resolveFilePath = defaultResolveFilePath}) => {
  if (!directory)
    throw new Error('koa-pushstate-middleware: directory option is required')

  if (typeof path !== 'string' && !path instanceof RegExp)
    throw new Error('koa-pushstate-middleware: path option should be a string or regx')

  if (typeof resolveFilePath !== 'function')
    throw new Error('koa-pushstate-middleware: resolveFilePath option should be a function')

  return async (ctx, next) => {
    debug(`ctx.path: ${ctx.path}`)

    const reqPath = ctx.path
    if (typeof test === 'string' && !reqPath.startsWith(test))
      return await next()
    if (test instanceof RegExp && !test.test(reqPath))
      return await next()

    if (defer)
      await next()

    const req = ctx.request
    const resp = ctx.response

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      resp.status = 403
      resp.set('Allow', 'GET, HEAD')
      resp.set('Content-Length', '0')
      return
    }

    let filepath = resolveFilePath(reqPath, directory)
    let ext = path.extname(filepath)

    if (ext === '' || ext === '.html') {
      filepath = path.resolve(directory, indexHtml)
      ext = '.html'
    }

    debug(`filepath: ${filepath}`)

    // detect file
    let stats, gzPath
    try {
      stats = await fileStats(`${filepath}.gz`)
      gzPath = `${filepath}.gz`
    } catch (err) {
      debug(`try to serve gz ver: ${err}`)
    }

    if (!stats) {
      try {
        stats = await fileStats(filepath)
      } catch (err) {
        debug(`not found: ${err}`)
        resp.status = 404
        await next()
        return
      }
    }

    filepath = gzPath || filepath

    // const type = mime.lookup(filepath)
    // const charset = mime.charsets.lookup(type)
    // resp.set('Content-Type', `${type}${charset ? `; charset=${charset}` : ''}`)
    resp.set('Content-Type', mime.contentType(ext))
    resp.set('Content-Length', stats.size)

    // write to resp
    resp.body = fs.createReadStream(filepath)

    if (!defer)
      await next()
  }
}