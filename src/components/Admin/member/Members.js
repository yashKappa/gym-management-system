import React from 'react';
import Form from './Add';
import MemFetch from './MemFetch';

const Members = () => {
  return (
    <div className="container">
      <h2 className="mb-4">👥 Members</h2>
      <Form />
      <MemFetch />
    </div>
  );
};

export default Members;
