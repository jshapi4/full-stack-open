/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import personService from "./services/personService";

const Footer = () => {
  const footerStyle = {
    color: "grey",
    fontStyle: "italic",
    fontSize: 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "2.5rem",
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>Phonebook app, JShap 2024</em>
    </div>
  );
};

const Persons = ({ filteredPersons, handleDelete }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          {person.name}: {person.phone}
          <button onClick={() => handleDelete(person.id, person.name)}>
            delete
          </button>
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

const Notification = ({ successMessage, errorMessage }) => {
  return (
    <>
      {successMessage && <div className="success">{successMessage}</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((initialPersons) => {
      console.log("promise fulfilled");
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const nameExists = persons.some((person) => person.name === newName);
    const numberExists = persons.some((person) => person.number === newNumber);

    if (nameExists) {
      if (
        window.confirm(
          `${newName} already is in the phonebook, replace the old number with a new one?`
        )
      ) {
        const personToUpdate = persons.find(
          (person) => person.name === newName
        );
        const updatedPerson = { ...personToUpdate, phone: newNumber };
        console.log(personToUpdate);
        console.log(updatedPerson);
        personService
          .update(personToUpdate.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== personToUpdate.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setSuccessMessage(
              `Updated ${returnedPerson.name}'s number successfully.`
            );
            setTimeout(() => setSuccessMessage(""), 5000);
          })
          .catch((error) => {
            console.error("Failed to update person:", error);
          });
      }
      return;
    }

    if (!newName) {
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
      //id: String(persons.length + 1), //let the server assign an id
    };

    personService
      .create(personObject)
      .then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setNewName("");
        setNewNumber("");
        setSuccessMessage(`Added ${newPerson.name} successfully.`);
        setTimeout(() => setSuccessMessage(""), 5000);
      })
      .catch((error) => {
        console.log("failed to add person:", error);
        setErrorMessage(`Failed to add ${newName}`);
        setTimeout(() => setErrorMessage(""), 5000);
      });
  };

  const handleName = (event) => {
    const newNameInputted = event.target.value;
    setNewName(newNameInputted);
  };

  const handleNumber = (event) => {
    const newNumberInputted = event.target.value;
    setNewNumber(newNumberInputted);
  };

  const handleDelete = (id, name) => {
    console.log(id, name);
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      personService
        .del(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setErrorMessage(
            `Failed to delete ${name} from the phonebook. Information has already been removed from the server. Error: ${error}`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
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
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleName={handleName}
        handleNumber={handleNumber}
      />
      <h2>Phonebook</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
      <Footer />
    </div>
  );
};

export default App;
