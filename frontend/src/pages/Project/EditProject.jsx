import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import FormProject from '../../components/FormProject'
import { useNavigate, useParams } from 'react-router-dom';
import { getProject } from '../../functions/projectAPI';
import { handleResponse } from '../../functions/handleResponse';

function EditProject() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [project, setProject] = useState(null)

  useEffect(() => {
    getProject(slug).then(response => {
      handleResponse(response, navigate, () => {
        setProject(response.data)
      })
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