import React from 'react'
import Button from './Button'
import { formatDate } from '../functions/formatDate'
import { deleteProject } from '../functions/projectAPI'

function ProjectItem({ projectData, onDelete }) {
  const handleDelete  = async (e) => {
    e.preventDefault();
    deleteProject(projectData.slug).then(response => {
      if(response.status === 204) setTimeout(onDelete, 500);
    })
  }

  return (
    <div className='project flex justify-start sm:items-center max-sm:flex-col gap-[20px] max-sm:gap-2 p-[15px] max-sm:px-0 border-b border-gray-200'>
      <div className="project-detail flex-1 overflow-hidden">
        <div className="project-title flex flex-col">
          <a href={`/projects/${projectData.slug}`} className="project-link">
            <h2 className='text-gray-900 text-[32px] max-md:text-[24px] font-bold leading-9'>{projectData.name}</h2>
          </a>
          <span className='text-gray-500 font-normal'>
            {formatDate(projectData.createdAt, 'dd.MM.yyyy (HH:mm) ')}
            {projectData.createdAt === projectData.updatedAt ? '' : `, updated - ${formatDate(projectData.updatedAt, 'dd.MM.yyyy (HH:mm) ')}`}
          </span>
        </div>
        {projectData.description.length === 0 ? null :
          <div className="project-desc w-full truncate">
            {projectData.description}
          </div>
        }
      </div>

      <div className="project-actions flex gap-[10px]">
        <Button link={`/projects/${projectData.slug}/edit`} color='gray'>Edit</Button>
        <Button color='red' onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  )
}

export default ProjectItem