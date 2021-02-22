import express from 'express';

const app = express();

//Get => Busca
//Post => Salvar
//Put => Alterar
//Delete => Deletar
//Patch => Alterar especifica

// http://localhost:3333/users

app.get("/", (request, response) => {
    return response.json({ message: "Hello Word - NLW04 "});
});

// 1 param => Rota(Recurso API)
// 2 param => request, response

app.post("/", (request, response) => {
    //Recebeu os dadoos para salvar
    return response.json({message: "Os dados foram salvos com sucessoo" });
});

app.listen(3333, () => console.log("Server is running!"));