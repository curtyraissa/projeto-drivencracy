import { db } from "../database/database.config.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { opcaoDeVotoSchema, enqueteSchema } from "../schemas/schemas.js";

export async function createEnquete(req, res) {
  const { title, expireAt } = req.body;

  const validation = enqueteSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

  if (!expireAt) {
    expireAt = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");
  }

  try {
    await db.collection("enquete").insertOne({ title, expireAt });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getEnquete(req, res) {
  try {
    const enquetes = await db.collection("enquete").find().toArray();
    res.send(enquetes);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createOpcaoVoto(req, res) {
  const { title, pollId } = req.body;

  const validation = opcaoDeVotoSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    return res.status(422).send(errors);
  }

  try {
    const enquete = await db
      .collection("enquete")
      .findOne({ _id: new ObjectId(pollId) });
    if (!enquete) return res.sendStatus(404);

    const opcaoExiste = await db.collection("opcaoDeVoto").findOne({ title });
    if (opcaoExiste) {
      return res.sendStatus(409);
    }

    if (dayjs(enquete.expireAt).isBefore(dayjs())) {
      return res.sendStatus(403);
    }

    await db.collection("opcaoDeVoto").insertOne({ title, pollId });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getOpcaoVoto(req, res) {
  const { id } = req.params;
  try {
    const enquete = await db
      .collection("enquete")
      .findOne({ _id: new ObjectId(id) });
    if (!enquete) return res.sendStatus(404);

    const opcaoDeVoto = await db
      .collection("opcaoDeVoto")
      .find({ pollId: id })
      .toArray();
    res.send(opcaoDeVoto);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createVoto(req, res) {
  const { id } = req.params;
  try {
    console.log(id);

    const opcaoDeVoto = await db
      .collection("opcaoDeVoto")
      .findOne({ _id: new ObjectId(id) });
    if (!opcaoDeVoto) return res.sendStatus(404);
    console.log("opcao ", opcaoDeVoto.title);

    const enquete = await db
      .collection("enquete")
      .findOne({ _id: new ObjectId(opcaoDeVoto.pollId) });
    if (dayjs(enquete.expireAt).isBefore(dayjs())) {
      return res.sendStatus(403);
    }
    console.log(enquete.title);

    const voto = await db
      .collection("voto")
      .insertOne({
        createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
        choiceId: id,
      });
    res.status(201).send(voto);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getResultado(req, res) {
  const { id } = req.params;
  try {
    const enquete = await db
      .collection("enquete")
      .findOne({ _id: new ObjectId(id) });
    if (!enquete) return res.sendStatus(404);

    const opcoes = await db
      .collection("opcaoDeVoto")
      .find({ pollId: id })
      .toArray();

    let results = []

      for (let opcao of opcoes) {
        console.log("id1: ", opcao._id,"id2: ", opcao._id.toString(), " opcao ", opcao)
        const votos = await db.collection("voto").find({choiceId: opcao._id.toString()}).toArray();
        console.log("votos ", votos)
        let result = {id: opcao._id, title: opcao.title, votes: votos.length}
        results.push(result)
      }
      console.log("sorted ", results.sort((a, b) => a.votes - b.votes));
    // const retorno = {
    //   _id: enquete._id,
    //   title: enquete.title,
    //   expireAt: enquete.expireAt,
    //   result: {
    //     title: "Javascript",
    //     votes: 487,
    //   },
    // };

    res.status(201).send(results)
  } catch (err) {
    res.status(500).send(err.message);
  }
}
