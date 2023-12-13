import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import FormProject from '../components/FormProject'
import { useParams } from 'react-router-dom';
import { getProject } from '../functions/projectAPI';

function EditProject() {
  const { slug } = useParams();
  const [project, setProject] = useState(null)

  useEffect(() => {
    getProject(slug).then(response => {
      if (response.status === 200) setProject(response.data)
      if (response.status === 404) window.location.replace('/project-not-found')
      })
  }, [slug])

  if (!project) return;

  return (
    <div className='wrapper w-full min-h-screen bg-gray-50'>
      <Header h1_text={'Edit project'} />
      <div className="section">
        <FormProject projectData={project} isUpdateAction={true} />
      </div>
    </div>
  )
}

export default EditProject