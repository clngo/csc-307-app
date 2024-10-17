// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const characterToDelete = characters[index];

    fetch(`http://localhost:8000/users/${characterToDelete._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id : characterToDelete._id }), // Include the ID in the body
    })
    .then((response) => {
      if (response.status === 204) {
        // Delete was successful, now update the state
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      } else if (response.status === 404) {
        console.error("User not found");
      } else {
        throw new Error("Failed to delete user");
      }
    })
    .catch((error) => {
      console.log(error);
    });
    
  }
  
  function updateList(person) { 
    postUser(person)
    .then((response) => {
      if (response.status === 201) {
        return response.json(); // Return the newly added user data
      } else {
        throw new Error("Failed to add user");
      }
    })
    .then((newUser) => {
      setCharacters([...characters, newUser]); // Add the new user to the state
    })
    .catch((error) => {
      console.log(error);
    })
}
  
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    return promise;
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />

    </div>
  );
  }
export default MyApp;