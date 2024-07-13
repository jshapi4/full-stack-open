/* eslint-disable react/prop-types */
const Total = ({ parts }) => {
  const total = parts.reduce((accumulator, part) => {
    return (accumulator += part.exercises);
  }, 0);

  console.log("Total is getting passed", parts);
  return <h3>Total of {total} exercises</h3>;
};

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Header = ({ name }) => <h2>{name}</h2>;

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
