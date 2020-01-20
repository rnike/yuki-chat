const express = require('express')()
const next = require('next')
const http = require('http').createServer(express);
 
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

const ws_server = require('./src/server')

ws_server(http); 

app.prepare().then(() => { 
    express.get('*', (req, res) => {
    return handle(req, res)
  })
  http.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})