// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const generateRandomId = () => {
  const letters = String.fromCharCode(...Array.from({ length: 3 }, () => Math.floor(Math.random() * 26) + 97));
  const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Generate a number and pad it to 3 digits
  return `${letters}${numbers}`; // Concatenate letters and numbers
};


const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUsersByNameAndJob = (name, job) => {
  return users.users_list.filter(
    (user) => user.name === name && user.job === job
  );
};


const addUser = (user) => {
  user.id = generateRandomId();
  users["users_list"].push(user);
  return user;
};

const deleteUser = (userId) => {
  // Check if the user exists by trying to find them
  const foundUser = findUserById(userId);

  if (foundUser) {
    users.users_list = users.users_list.filter((user) => user.id !== userId);
    return true; 
  }

  return false; 
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  if (name && job) {
    let result = findUsersByNameAndJob(name, job);
    result = { users_list : result }
    return res.send();
  }
  else {
  res.send(users);
  }
});

app.delete("/users", (req, res) => {
  const { id } = req.body;
  let result = deleteUser(id);

  if (result) {
    res.send("User was deleted");
  }
  else {
    res.status(404).send("User not found.");
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.status(201).json(userToAdd);
});

// Existing route
app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
