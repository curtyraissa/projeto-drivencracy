import { db } from "../database/database.config.js"
import dayjs from "dayjs"
import { ObjectId } from "mongodb"
import { opcaoDeVotoSchema, enqueteSchema } from "../schemas/schemas.js"

export async function createEnquete(req, res){
    const {title, expireAt} = req.body

    const validation = enqueteSchema.validate(req.body, {abortEarly: false})

    if(validation.error){
        const errors = validation.error.details.map((d) => d.message)
        return res.status(422).send(errors)
    }

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
        const enquetes = await db.collection("enquete").find().toArray()
        res.send(enquetes)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createOpcaoVoto(req, res){
    const {title, pollId} = req.body

    const validation = opcaoDeVotoSchema.validate(req.body, {abortEarly: false})

    if(validation.error){
        const errors = validation.error.details.map((d) => d.message)
        return res.status(422).send(errors)
    }

    try {
        const enquete = await db.collection("enquete").findOne({_id: new ObjectId(pollId)})
        if(!enquete) return res.sendStatus(404)
    
        const opcaoExiste = await db.collection("opcaoDeVoto").findOne({title})
        if(opcaoExiste) {  return res.sendStatus(409)  }
    
        if ((dayjs(enquete.expireAt).isBefore(dayjs()))) { return res.sendStatus(403) }

        await db.collection("opcaoDeVoto").insertOne({title, pollId})
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getOpcaoVoto(req, res){
    const {id} = req.params
    try {
        const enquete = await db.collection("enquete").findOne({_id: new ObjectId(pollId)})
        if(!enquete) return res.sendStatus(404)

        const opcaoDeVoto = await db.collection("opcaoDeVoto").find({_id: new ObjectId(id)}).toArray()
        res.send(opcaoDeVoto)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createVoto(req, res){
    const {id} =req.params
    try {
        const opcaoDeVoto = await db.collection("opcaoDeVoto").findOne({_id: new ObjectId(id)})
        if(!opcaoDeVoto) return res.sendStatus(404)

        const enquete = await db.collection("enquete").findOne({_id: new ObjectId(opcaoDeVoto.id)})

        if ((dayjs(enquete.expireAt).isBefore(dayjs()))) { return res.sendStatus(403) }

        await db.collection("voto").insertOne({createdAt: dayjs().format("YYYY-MM-DD HH:mm"), choiceId: new ObjectId(id)})
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getResultado(req, res){
    const {id} = req.params
    try {
        const enquete = await db.collection("enquete").findOne({_id: new ObjectId(id)})
        if(!enquete) return res.sendStatus(404)


    } catch (err) {
        res.status(500).send(err.message)
    }
}