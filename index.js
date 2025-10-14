const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Olá! Este é um servidor Express simples.');
});
app.get('/api/info', (req, res) => {
  res.json({ app: 'simple-server', status: 'running', time: new Date().toISOString() });
});
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write('Iniciando stream...\n');
  let i = 0;
  const interval = setInterval(() => {
    i++;
    res.write(`chunk ${i}\n`);
    if (i === 5) {
      clearInterval(interval);
      res.end('Stream finalizado.\n');
    }
  }, 400);
});
app.get('/health', (req, res) => res.send('ok'));
app.listen(port, () => {
  console.log(`Server rodando em http://localhost:${port}`);
});
