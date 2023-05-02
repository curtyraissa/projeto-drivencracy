import express from "express"
import cors from "cors"
import votacaoRouter from "./routes/votacao.routes.js"

// Criação do servidor
const app = express()

// Configurações
app.use(express.json())
app.use(cors())
app.use(votacaoRouter)

// Deixa o app escutando, à espera de requisições
const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
