import { useState } from "react";

const Anecdote = ({ anecdote, votes }) => {
  return (
    <>
      <div>{anecdote}</div>
      <div>has {votes} votes</div>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(
    Math.floor(Math.random() * anecdotes.length)
  );
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
  const [greatest, setGreatest] = useState(0);

  const handleGreatest = (points) => {
    const maxIndex = points.indexOf(Math.max(...points));
    setGreatest(maxIndex);
  };

  const handleClick = () => {
    const randomNum = Math.floor(Math.random() * anecdotes.length);
    console.log(randomNum);
    setSelected(randomNum);
  };

  const handleVotes = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
    handleGreatest(copy);
  };

  return (
    <div>
      <h2>Anecdote of the Day</h2>
      <Anecdote anecdote={anecdotes[selected]} votes={points[selected]} />
      <div>
        <button onClick={handleVotes}>vote</button>
        <button onClick={handleClick}>next anecdote</button>
      </div>
      <h2>Anecdote with most votes</h2>
      <Anecdote anecdote={anecdotes[greatest]} votes={points[greatest]} />
    </div>
  );
};

export default App;
