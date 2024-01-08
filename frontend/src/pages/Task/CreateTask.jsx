import React, { useEffect, useState } from 'react'
import FormTask from '../../components/FormTask'
import Header from '../../components/Header'
import { useNavigate, useParams } from 'react-router-dom';
import { getProject } from '../../functions/projectAPI';
import { handleResponse } from '../../functions/handleResponse';

const emptyFunction = () => {};

function CreateTask() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState(null)

  useEffect(() => {  
    getProject(slug).then(response => {
      handleResponse(response, navigate, () => {
        setProjectName(response.data.name)
      }, emptyFunction, () => {
        navigate('/project-not-found')
      })
    })
  }, [slug])
  
  if (!projectName) return null;
  return (
    <div className='wrapper w-full min-h-screen bg-gray-50'>
      <Header h1_text={`Create task for project "${projectName}"`}/>
      <div className="section">
        <FormTask />
      </div>
    </div>
  )
}

export default CreateTask