import React, { useState } from 'react'
import TickIcon from '../components/TickIcon'
import ProgressBar from '../components/ProgressBar'
import Modal from './Modal'

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * ListItem component represents a single task item in a list.
 * It displays the task's title, associated progress, and provides
 * options to delete or edit the task.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.tasks - The task data including title, progress, and id.
/*******  ea4c94bb-ec75-4385-915a-65e2d495aec1  *******/
const ListItem = ({ tasks, getData }) => {
  const [showModal, setShowModal] = useState(false);

  const deleteTodo = async () => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${tasks.id}`, {
        method: 'DELETE'
      });
      if (response.status === 200) {
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <li className='list-item'>
      <div className="info-container">
        <TickIcon />
        <p className='task-title'>{tasks.title}</p>
        <ProgressBar {...tasks} />
      </div>
      <div className="button-container">
        <button className='delete' onClick={deleteTodo}>DELETE</button>
        <button className='edit' onClick={() => setShowModal(true)}>EDIT</button>
      </div>
      {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} tasks={tasks} />}
    </li>
  )
}

export default ListItem;
