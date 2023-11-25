import React from 'react'
import { BtnLink, Button } from './Button.component'
import { formatDate } from '../functions/formatDate'
import { deleteProject } from '../functions/requests'

function ProjectItem({ projectData, onDelete }) {
	const deleteBtn = (e) => {
		e.preventDefault();
		deleteProject(projectData.slug)
    setTimeout(() => {
      onDelete();
    }, 500);
	}

	return (
		<div className='project flex justify-start items-center gap-[20px] p-[15px] border-b border-gray-200'>
			<div className="project-detail flex-1 overflow-hidden">
				<div className="project-title flex items-center gap-[10px]">
					<a href={`/projects/${projectData.slug}`} className="project-link">
						<h2 className='text-gray-900 text-[32px] font-bold leading-9'>{projectData.name}</h2>
					</a>
					<span className='text-gray-500 font-normal'>
						{`created - ${formatDate(projectData.created_at)}`}
						{projectData.created_at === projectData.updated_at ? '' : ` updated - ${formatDate(projectData.updated_at)}`}
					</span>
				</div>
				{projectData.description.length === 0 ? null :
					<div className="project-desc w-full truncate">
						{projectData.description}
					</div>
				}
			</div>

			<div className="project-actions flex gap-[10px]">
				<BtnLink href={`/projects/${projectData.slug}`} color='gray'>Edit</BtnLink>
				<Button color='red' onClick={deleteBtn}>Delete</Button>
			</div>
		</div>
	)
}

export default ProjectItem

