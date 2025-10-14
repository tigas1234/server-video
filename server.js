import http from 'http'
import fs from 'fs'
const dbPath = './users.json'
function readDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return [] }}
function writeDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}
const server = http.createServer((req, res) => {
  const { method, url } = req
  res.setHeader('Content-Type', 'application/json')
  if (url === '/user' && method === 'GET') {
    const users = readDatabase()
    return res.end(JSON.stringify(users))
  }
  if (url === '/user' && method === 'POST') {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        const { name, email } = data
        
        if (!name || !email) {
          res.statusCode = 400
          return res.end(JSON.stringify({ error: 'Nome e e-mail são obrigatórios!' }))
        }
        const users = readDatabase()
        if (users.find(u => u.email === email)) {
          res.statusCode = 400
          return res.end(JSON.stringify({ error: 'E-mail já cadastrado!' }))
        }
        const newUser = {
          id: Date.now(),
          name,
          email
        }
        users.push(newUser)
        writeDatabase(users)

        res.statusCode = 201
        return res.end(JSON.stringify(newUser))

      } catch (error) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'JSON inválido no corpo da requisição.' }))
      } }) return}
  res.statusCode = 404
  res.end(JSON.stringify({ message: 'Rota não encontrada' }))
})

server.listen(3333, () => {
  console.log('🚀 Servidor rodando em http://localhost:3333')
})
