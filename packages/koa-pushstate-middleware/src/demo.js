import Koa from 'koa'
import path from 'path'
import pushState from './index'

const app = new Koa()

app.use(pushState({ directory: path.join(process.cwd(), 'public') }))

app.listen(5000)
