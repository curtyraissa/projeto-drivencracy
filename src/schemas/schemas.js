import joi from "joi"

//Enquete
export const enqueteSchema = joi.object({
	title: joi.string().required(), 
	// expireAt: joi.required()
})


// //Opcao de voto
// { 
// 	title: joi.string().required(), 
// 	pollId: joi.string().required(), 
// }


// //Voto
// { 
// 	createdAt: "2022-02-13 01:00", 
// 	choiceId: ObjectId("54759eb3c090d83494e2d999"), 
// }