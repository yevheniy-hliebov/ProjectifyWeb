import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/section-components/Header';
import Button from '../../components/form-components/Button';
import FormTask from '../../components/form-components/FormTask';

function CreateTask() {
  const { slug } = useParams();
  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      <Header title="Create task" buttons={<Button link="/">Home</Button>} />
      <div className="section">
        <FormTask oldSlug={slug} />
      </div>
    </div>
  );
}

export default CreateTask;
