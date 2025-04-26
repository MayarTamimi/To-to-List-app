import React, { useState } from 'react';

const Modal = ({ mode, setShowModal, tasks, getData }) => {

  mode = mode || 'create';
  const editMode = mode === 'edit' ;
  const [data, setData] = useState({
    // userEmail: editMode ? tasks.userEmail : '',
    title: editMode ? tasks.title : '',
    progress: editMode ? tasks.progress : 0,
    date: editMode ? tasks.date : new Date()
  });

  const postData = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('Email');
    console.log("postData called");
    try {
      const response = await fetch('http://localhost:3001/todos', {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, userEmail }),
      });
      console.log("response", response);
      if (response.status === 200) {
        setShowModal(false);
        getData();
      } else {
        console.log("Response status:", response.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:3001/todos/${tasks.id}`, {
            method : "PUT" ,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (response.status === 200) {
            setShowModal(false);
            getData();
        }
    }catch (err) {
        console.log(err);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className='overlay'>
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your Task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>
        <form onSubmit={editMode ? editData : postData}>
          <input required maxLength={30} placeholder='Your Task goes here' name='title' value={data.title} onChange={handleChange} />
          <br />
          <label htmlFor="range">Drag to select your current progress</label>
          <input required type='range' min='0' max='100' name='progress' value={data.progress} onChange={handleChange} />
          <input id='submit' className={mode} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Modal;


