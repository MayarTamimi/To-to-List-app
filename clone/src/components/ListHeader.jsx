// ListHeader.jsx
import React, { useState } from 'react';
import Modal from './Modal';

const signOut = () => {
  console.log('sign out');
};

const ListHeader = ({ listName , getData }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='list-header'>
      <h1>{listName}</h1>
      <div className="button-container">
        <button className='create' onClick={() => setShowModal(true)}>ADD NEW</button>
        <button className='sign-out' onClick={signOut}>SIGN OUT</button>
      </div>
      {showModal && <Modal mode={"create"} setShowModal={setShowModal} getData = {getData}/>}
    </div>
  );
};

export default ListHeader;
