import { useState } from "react";

const StatisticLine = ({ text, value }) => {
  const suffix = " %";

  return (
    <>
      <tr>
        <td>{text}</td>
        <td>
          {value} {text === "positive" ? suffix : ""}
        </td>
      </tr>
    </>
  );
};

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  if (total > 0) {
    return (
      <>
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={total} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positive} suffix=" %" />
          </tbody>
        </table>
      </>
    );
  } else {
    return <div>No feedback given yet.</div>;
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const total = good + bad + neutral;
  const average = (good * 1 + bad * -1) / total;
  const positive = (good / total) * 100;

  return (
    <>
      <div>
        <h2>Give Feedback</h2>
        <button onClick={() => setGood(() => good + 1)}>good</button>
        <button onClick={() => setNeutral(() => neutral + 1)}>neutral</button>
        <button onClick={() => setBad(() => bad + 1)}>bad</button>
      </div>
      <div>
        <h2>Statistics</h2>
        <Statistics
          average={average}
          positive={positive}
          bad={bad}
          good={good}
          neutral={neutral}
          total={total}
        />
      </div>
    </>
  );
};

export default App;
