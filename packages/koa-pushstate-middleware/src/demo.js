import Koa from 'koa'
import path from 'path'
import pushState from './index'

const app = new Koa()

app.use(pushState(path.join(process.cwd(), 'public'), pushState.defaultResolveFilePath, {
  setHeaders: (res, path, stat) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
  },
  index: path.join(process.cwd(), 'public', 'index.html'),
  fallthrough: false
}))

app.listen(5000, '0.0.0.0')
