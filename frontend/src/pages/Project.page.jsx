import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { BtnLink, Button } from '../components/Button.component';
import { deleteProject, getProject } from '../functions/projectAPI';
import { formatDate } from '../functions/formatDate';

function Project() {
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

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const deletedProoject = await deleteProject(project.slug);
      if (deletedProoject)
        window.location.href = '/';
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  return (
    <div className='wrapper'>
      <div className="header py-[25px]">
        <div className="container max-w-[1440px] mx-auto px-[15px] flex justify-between items-center flex-wrap gap-[20px]">
          <h1 className="grow shrink basis-0 text-gray-900 text-[38px] max-sm:text-[30px] font-bold leading-[44px] whitespace-nowrap">Read project</h1>
          <BtnLink href='/' color={'gray'}>Back to Home</BtnLink>
        </div>
      </div>
      <div className="main">
        <div className="container max-w-[1440px] mx-auto px-[15px]">
          {project ? (
            <div className="w-full p-[15px] max-sm:px-0 flex-col justify-start items-end gap-5 inline-flex">
              <div className="self-stretch text-gray-900 text-[32px] font-bold leading-9">{project.name}</div>
              <div className="self-stretch flex-col justify-start items-start gap-2.5 flex">
                <div className="text-gray-900 text-base font-bold leading-tight">Description:</div>
                <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">{project.description}</div>
              </div>
              <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                <div className="text-gray-900 text-base font-bold leading-tight">Created:</div>
                <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">{formatDate(project.created_at, 'dd.MM.yyyy (HH:mm) ')}</div>
              </div>
              {project.created_at === project.updated_at ? null : (
                <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Updated:</div>
                  <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">{formatDate(project.updated_at, 'dd.MM.yyyy (HH:mm) ')}</div>
                </div>
              )}
              <div className="justify-start items-start gap-2.5 inline-flex">
                <BtnLink href={`/projects/edit/${project.slug}`} color='gray'>Edit</BtnLink>
                <Button color='red' onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          ) : (
            <p>LOADING...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Project