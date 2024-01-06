const express = require("express");
const uuid = require("uuid");
const port = 3002;
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors())


// - query params => meusite.com/users?name=rodolfo&age=28   // filtrar
/*
app.get("/users", (request, response) => {
  console.log(request.query);

  const { name, age } = request.query;

  return response.json({ name, age }); // === ({name: name, age: age})
});

app.listen(port, () => {
  console.log(`🚀 Server starte runnung on ${port}`)
})

*/

//- route params => /users/2    // buscar, deletar ou atualizar algo especifico
/*
 app.get("/users/:id", (request, response) => {
  const { id } = request.params;
  console.log(id);

  return response.json({ id });
});

app.listen(port, () => {
  console.log(`🚀 Server starte runnung on ${port}`)
})


*/

//- Request body => {"name":"rodolfo", "age":}

/* 

app.get("/users", (request, response) => {

  const { name, age } = request.body 

  return response.json({ name, age })
});
*/
app.listen(port, () => {
  console.log(`🚀 Server starte runnung on ${port}`);
});

/*
GET -  buscar informação
POST - criar informação no back end
PUT / PATCH - alterar/ atualizar informaçao ''
DELETE - deletar informação

-middleware - inteceptador, parar ou alterar dados da requisição

 */

const users = [];

const checkUserId = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "user not found" });
  }

  request.userIndex = index;
  request.userId = id;
  next();
};

app.get("/users", (request, response) => {
  return response.json(users);
});

//TRY / CATCH

app.post("/users", (request, response) => {
  try {
    const { name, age } = request.body;
    // if (age < 18) throw new Error("Only allower users over 18 years old");
    const user = { id: uuid.v4(), name, age };

    users.push(user);

    return response.status(201).json(users);
  } catch (err) {
    return response.status(400).json({ Error: err.message });
  } finally {
    console.log('terminou tudo')
  }
});

app.put("/users/:id", checkUserId, (request, response) => {
  const { name, age } = request.body;
  const index = request.userIndex;
  const id = request.userId;
  const updatedUser = { id, name, age };

  users[index] = updatedUser;

  return response.json(updatedUser);
});

app.delete("/users/:id", checkUserId, (request, response) => {
  const index = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json(users);
});
