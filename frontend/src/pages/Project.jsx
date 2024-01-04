import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import { deleteProject, getProject } from '../functions/projectAPI';
import { formatDate } from '../functions/formatDate';
import Header from '../components/Header';
import Container from '../components/Container';

function Project({ authUser, setAuthUser }) {
  const { slug } = useParams();
  const [project, setProject] = useState(null)

  useEffect(() => {
    getProject(slug).then(response => {
      if (response.status === 200) setProject(response.data)
      if (response.status === 404) window.location.replace('/project-not-found')
    })
  }, [slug])

  const handleDelete = async (e) => {
    e.preventDefault();
    deleteProject(project.slug).then(response => {
      if (response.status === 204)  window.location.replace('/')
    })
  }

  if (!project) return;

  return (
    <div className='wrapper w-full min-h-screen bg-gray-50'>
      <Header h1_text={'Read project'} btn_link={{ link: '/', color: 'gray', children: 'Back to Home' }} authUser={authUser} setAuthUser={setAuthUser}/>
      <div className="main">
        <Container>
          {project ? (
            <div className="w-full p-[15px] max-sm:px-0 flex-col justify-start items-end gap-5 inline-flex">
              <h2 className="self-stretch text-gray-900 text-[32px] font-bold leading-9">{project.name}</h2>
              <div className="self-stretch flex-col justify-start items-start gap-2.5 flex">
                <div className="text-gray-900 text-base font-bold leading-tight">Description:</div>
                <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">{project.description}</div>
              </div>
              <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                <div className="text-gray-900 text-base font-bold leading-tight">Created:</div>
                <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">{formatDate(project.createdAt, 'dd.MM.yyyy (HH:mm) ')}</div>
              </div>
              {project.createdAt === project.updatedAt ? null : (
                <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Updated:</div>
                  <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">{formatDate(project.updatedAt, 'dd.MM.yyyy (HH:mm) ')}</div>
                </div>
              )}
              <div className="flex justify-end items-center gap-[10px]">
                <Button link={`/projects/${project.slug}/edit`} color='gray'>Edit</Button>
                <Button color='red' onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          ) : (
            <p>LOADING...</p>
          )}
        </Container>
      </div>
    </div>
  )
}

export default Project