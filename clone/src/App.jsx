import React, { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";

const App = () => {
  const [tasks, setTasks] = useState(null);
  const authToken = localStorage.getItem("AuthToken");  

  const getData = async () => {
    const userEmail = localStorage.getItem("Email");  
    if (!userEmail) {
      console.error("No email found in localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/todos/${userEmail}`);
      const data = await response.json();
      setTasks(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, [authToken]);

  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={"Daily Routine Tick List"} getData={getData} />
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} getData={getData} tasks={task} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
