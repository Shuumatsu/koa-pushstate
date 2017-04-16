## koa-pushstate-middleware

`yarn add koa-pushstate-middleware`

Aiming to provide a static file middleware redirecting all html requests to the specified html (if not specified, defaults to index.htm).

export default (root, resolveFilePath, opts) => {
}


```
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

```

`resolveFilePath`: determine file path depends on `reqPath`

```
const defaultResolveFilePath = (root, reqPath) => path.join(root, reqPath).toLowerCase()
```

