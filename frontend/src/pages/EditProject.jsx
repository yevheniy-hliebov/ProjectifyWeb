import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import FormProject from '../components/FormProject'
import { useNavigate, useParams } from 'react-router-dom';
import { checkPermission, getProject } from '../functions/projectAPI';

function EditProject({ authUser, setAuthUser }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [project, setProject] = useState(null)

  useEffect(() => {
    checkPermission(slug).then(response => {
      if (response === "Unauthorized") {
        navigate('/login');
      }
      else if (response && response.status === 403) {
        navigate('/forbidden')
      } else if (response && response.status === 404) {
        navigate('/project-not-found')
      } else if (response) {
        getProject(slug).then(response => {
          if (response && response.status === 200) setProject(response.data)
          if (response && response.status === 404) navigate('/project-not-found')
        })
      }
    })
  }, [slug])

  if (!project) return;

  return (
    <div className='wrapper w-full min-h-screen bg-gray-50'>
      <Header h1_text={'Edit project'} authUser={authUser} setAuthUser={setAuthUser} />
      <div className="section">
        <FormProject projectData={project} isUpdateAction={true} />
      </div>
    </div>
  )
}

export default EditProject