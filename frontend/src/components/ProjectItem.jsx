import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../modules/format-date';
import { deleteProject } from '../api/projects';
import useNotification from '../hook/useNotification';

document.addEventListener('click', (event) => {
  const optionsList = document.querySelectorAll('.options');
  if (optionsList) {
    optionsList.forEach((options) => {
      const isClickOptions = options.contains(event.target);
      if (!isClickOptions) {
        options.removeAttribute('open');
      }
    });
  }
});

function ProjectItem({ project, onDelete }) {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleDelete = () => {
    deleteProject(project.slug).then((res) => {
      if (res?.status === 204) {
        onDelete();
        addNotification(`Project "${project.name}" was successfully deleted.`, 204);
      } else if (res?.status === 404) {
        addNotification(res.data.message, res.data.statusCode);
      } else if (res?.status === 500) {
        addNotification(res.data.message, res.data.statusCode);
        navigate('/500');
      }
    });
  };

  return (
    <div className="project flex justify-start sm:items-center p-[15px] max-sm:px-0 border-b border-gray-200">
      <div className="project-detail flex-1 overflow-hidden">
        <div className="project-title flex flex-col">
          <Link to={`/projects/${project.slug}`} className="self-start">
            <h2 className="text-gray-900 text-[32px] max-md:text-[24px] font-bold leading-9">
              {project.name}
            </h2>
          </Link>
          <span className="text-gray-500 font-normal">
            {formatDate(project.createdAt, 'yyyy-MM-dd (HH:mm)')}
            {project.createdAt === project.updatedAt
              ? ''
              : `, updated - ${formatDate(project.updatedAt, 'yyyy-MM-dd (HH:mm)')}`}
          </span>
        </div>
        {project.description.length > 0 ? (
          <div className="project-desc w-full truncate">{project.description}</div>
        ) : null}
      </div>

      <div className="project-actions flex gap-[10px] self-start">
        <details className="options relative z-1 select-none">
          <summary className="list-none cursor-pointer group">
            <svg
              className="size-[30px] cursor-pointer fill-gray-900 transition-all hover:scale-105 active:scale-95"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z"
                fill="#1C1B1F"
              />
            </svg>
          </summary>
          <div className="options-content absolute top-full right-[10px] w-[120px] max-sm:w-[140px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-gray-50 z-[1] rounded-[3px] border border-gray-500">
            <ul className="flex-col justify-start items-start flex">
              <li className="w-full items-start flex hover:bg-gray-200 cursor-pointer text-gray-900 text-base font-normal leading-tight">
                <Link className="px-2.5 py-[7px] flex-1" to={`/projects/${project.slug}/edit`}>
                  Edit
                </Link>
              </li>
              <li className="w-full items-start flex hover:bg-gray-200 cursor-pointer text-gray-900 text-base font-normal leading-tight">
                <button
                  onClick={handleDelete}
                  className="text-red-500 flex-1 px-2.5 text-start py-[7px]"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </details>

        {/* <Button link={`/projects/${projectData.slug}/edit`} color='gray'>Edit</Button>
        <Button color='red' onClick={handleDelete}>Delete</Button> */}
      </div>
    </div>
  );
}

export default ProjectItem;
