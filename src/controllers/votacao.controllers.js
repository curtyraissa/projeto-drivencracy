import { db } from "../database/database.config.js"
import dayjs from "dayjs"
import { ObjectId } from "mongodb"

export async function createEnquete(req, res){
    const {title, expireAt} = req.body
    if(!expireAt){
        expireAt = dayjs().add(30, 'day').format("YYYY-MM-DD HH:mm")
    }
    try {
        await db.collection("enquete").insertOne({title, expireAt})
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getEnquete(req, res){
    try {

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createOpcaoVoto(req, res){
    const {title, pollId} = req.body

    try {
        await db.collection("opcaoDeVoto").insertOne({title, PollId})
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getOpcaoVoto(req, res){
    try {

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createVoto(req, res){
    const {id} =req.params
    try {
        await db.collection("voto").insertOne({createdAt: dayjs().format("YYYY-MM-DD HH:mm"), choiceId: id})
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getResultado(req, res){
    try {

    } catch (err) {
        res.status(500).send(err.message)
    }
}