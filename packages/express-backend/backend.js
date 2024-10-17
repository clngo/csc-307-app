// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

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

// Get users all users by name, job, both, or neither
app.get("/users", (req, res) => {
  const { name, job } = req.query;
    userService.getUsers(name, job)
      .then(result => {
        res.send({ users_list : result });
      })
      .catch(error => {
        res.status(500).send("Error retrieving users");
      });
  } 
);

// get user by id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  userService.findUserById(id)
    .then(result => {
      if (result) { 
        res.status(204).send(result);
      } else {
        res.status(404).send("User not found.");
      }
    })
    .catch(error => {
      res.status(500).send("Error retrieving user");
    });
});

// Post add new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateRandomId();
  userService.addUser(userToAdd)
    .then(addedUser => {
    res.status(201).json(addedUser);
  })
    .catch(error => {
    console.error(error);
    res.status(500).send("Error adding user");
  });
});

// delete user by id
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  userService.deleteUserById(id)
    .then(result => {
      if (result) { 
        res.status(204).send(result);
      } else {
        res.status(404).send("User not found.");
      }
    })
    .catch(error => {
      res.status(500).send("Error deleting user");
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
