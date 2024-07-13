/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const Persons = ({ filteredPersons }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          {person.name}: {person.phone}
        </div>
      ))}
    </div>
  );
};

const Filter = ({ search, handleSearch }) => {
  return (
    <form>
      <div>
        search: <input value={search} onChange={handleSearch} />
      </div>
    </form>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  handleName,
  handleNumber,
}) => {
  return (
    <>
      <h3>Add A New Person:</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleName} />
        </div>
        <div>
          phone: <input type="tel" value={newNumber} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "040-123456", id: 1 },
    { name: "Ada Lovelace", phone: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", phone: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", phone: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3002/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const nameExists = persons.some((person) => person.name === newName);
    const numberExists = persons.some((person) => person.number === newNumber);

    if (nameExists) {
      alert(`${newName} already is in the phonebook!`);
      return;
    } else if (!newName) {
      alert("Please enter a name");
      return;
    }

    if (numberExists) {
      alert(
        `Sorry, that number, ${newNumber}, is already is in the phonebook!`
      );
      return;
    } else if (!newNumber) {
      alert("Please enter a number");
      return;
    }

    const personObject = {
      name: newName,
      phone: newNumber,
      id: String(persons.length + 1),
    };

    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
  };

  const handleName = (event) => {
    const newNameInputted = event.target.value;
    setNewName(newNameInputted);
  };

  const handleNumber = (event) => {
    const newNumberInputted = event.target.value;
    setNewNumber(newNumberInputted);
  };

  const handleSearch = (event) => {
    const searchInput = event.target.value;
    setSearch(searchInput);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Search the Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleName={handleName}
        handleNumber={handleNumber}
      />
      <h2>Phonebook</h2>
      <Persons filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
