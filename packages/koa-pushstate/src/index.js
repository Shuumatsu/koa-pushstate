#!/usr/bin/env node

import Koa from 'koa'
import https from 'https'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import detect from 'detect-port'
import pushState from 'koa-pushstate-middleware'
import prompt from 'react-dev-utils/prompt'

const app = new Koa()
const opts = {
  key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem'))
}

const root = process.argv[2] || '.'
app.use(root, pushState.defaultResolveFilePath, {
  setHeaders: (res, path, stat) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
  },
  index: path.join(root, 'index.html'),
  fallthrough: false
})

const server = https.createServer(opts, app.callback())
const runServer = port => {
  server.listen(port, '0.0.0.0')
  console.log(chalk.yellow(`Server is running https://localhost:${port}`))
}

detect(5000).then(port => {
  if (port === 5000) {
    runServer(port)
    return
  }

  const question = chalk.yellow(`Default port 5000 is in use. Change to another port?`)

  prompt(question, true).then(change => {
    change && runServer(port)
  })
})