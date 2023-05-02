import { Router } from "express";
import { createEnquete, createOpcaoVoto, createVoto, getEnquete, getOpcaoVoto, getResultado } from "../controllers/votacao.controllers.js";


const votacaoRouter = Router()

votacaoRouter.post("/poll", createEnquete)
votacaoRouter.get("/poll", getEnquete)
votacaoRouter.post("/choice", createOpcaoVoto)
votacaoRouter.get("/poll/:id/choice", getOpcaoVoto)
votacaoRouter.post("/choice/:id/vote", createVoto)
votacaoRouter.get("/poll/:id/result", getResultado)

export default votacaoRouter
