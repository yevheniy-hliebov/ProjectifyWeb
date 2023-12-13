import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import FormProject from '../components/FormProject'
import { useParams } from 'react-router-dom';
import { getProject } from '../functions/projectAPI';

function EditProject() {
  const { slug } = useParams();
  const [project, setProject] = useState(null)

  useEffect(() => {
    getProject(slug)
      .then(project => {
        setProject(project)
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, [slug])

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