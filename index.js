const express = require('express')
const app = express()
const port = 3000

app.post('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/', (req, res) => {
    res.send('api integration')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})