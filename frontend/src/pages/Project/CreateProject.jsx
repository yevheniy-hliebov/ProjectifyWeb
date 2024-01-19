import React from 'react';
import Header from '../../components/section-components/Header';
import Button from '../../components/form-components/Button';
import FormProject from '../../components/form-components/FormProject';

function CreateProject() {
  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      <Header title="Create project" buttons={<Button link="/">Home</Button>} />
      <div className="section">
        <FormProject />
      </div>
    </div>
  );
}

export default CreateProject;
