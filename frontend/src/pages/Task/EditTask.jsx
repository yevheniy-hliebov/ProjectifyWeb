import React, { useEffect, useState } from 'react'
import FormTask from '../../components/FormTask'
import Header from '../../components/Header'
import { useNavigate, useParams } from 'react-router-dom';
import { getProject } from '../../functions/projectAPI';
import { getTask } from '../../functions/taskApi';

function EditTask() {
  const { slug, number } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState(null)
  const [task, setTask] = useState(null)

  useEffect(() => {  
  getProject(slug).then(response => {
    if (response === "Unauthorized") {
      navigate('/login');
    } else if (response.status === 200) {
        setProjectName(response.data.name)
        getTask(slug, number).then(response => {
          if (response === "Unauthorized") {
            navigate('/login');
          } else if (response.status === 200) {
            setTask(response.data)
          } else if (response.status === 404) navigate('/task-not-found')
        })
      } else if (response.status === 404) navigate('/project-not-found')
    })
  }, [slug])
  
  if (!projectName || !task) return null;
  return (
    <div className='wrapper w-full min-h-screen bg-gray-50'>
      <Header h1_text={`Create task for project "${projectName}"`}/>
      <div className="section">
        <FormTask taskData={task} isUpdateAction={true} />
      </div>
    </div>
  )
}

export default EditTask