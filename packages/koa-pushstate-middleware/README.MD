## koa-pushstate-middleware

`yarn add koa-pushstate-middleware`

Aiming to provide a static file middleware redirecting all html requests to the specified html (if not specified, defaults to index.htm).

export default ({directory, defer = false, test = /[\s\S]/, resolveFilePath = defaultResolveFilePath}) => {


```
import Koa from 'koa'
import pushstate from 'koa-pushstate-middleware;

const app = new Koa()

const opts = {
  // ...
}

app.use(pushstate(opts)

// ...
```

### opts
```
{
  directory, // directory has no defaults
  defer = false, 
  test = /[\s\S]/, 
  resolveFilePath = defaultResolveFilePath,
  indexHtml = 'index.html'
}
```

`directory`: files to be served from, must be provided.

`indexHtml`: redirecting all html requests to

`defer`: if true, this middleware will call `await next()` first.

`test`: 
```
const reqPath = ctx.path
if (typeof test === 'string' && !reqPath.startsWith(test))
  return await next()
if (test instanceof RegExp && !test.test(reqPath))
  return await next()
```

`resolveFilePath`: determine file path depends on `reqPath`

```
const defaultResolveFilePath = (reqPath, directory) => {
  const paths = ensureNoSlash(reqPath).split('/')

  return path.resolve(directory, ...paths)
}
```

