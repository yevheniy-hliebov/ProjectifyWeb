import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import { deleteProject, getProject } from '../../functions/projectAPI';
import { formatDate } from '../../functions/formatDate';
import Header from '../../components/Header';
import Container from '../../components/Container';
import { NotificationContext } from '../../components/Notifications';
import { deleteTask, getTasks } from '../../functions/taskApi';
import { handleResponse } from '../../functions/handleResponse';

const emptyFunction = () => { };

function Project() {
  const navigate = useNavigate();
  const [notificationsParams, setNotificationsParams] = useContext(NotificationContext)
  const { slug } = useParams();
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([]);

  const [query, setQuery] = useState({
    sortBy: 'newest',
    searchText: ''
  })

  useEffect(() => {
    getProject(slug).then(response => {
      handleResponse(response, navigate, () => {
        setProject(response.data);
      }, emptyFunction, () => { navigate('/project-not-found') })
    })
  }, [slug])

  async function getAndSetTasks(query) {
    getTasks(slug, query.searchText, query.sortBy).then(response => {
      handleResponse(response, navigate, () => {
        setTasks(response.data.tasks)
      }, () => { setTasks([]) }, () => { setTasks([]) })
    })
  }

  useEffect(() => {
    getAndSetTasks(query);
  }, [query])

  const handleDelete = async (e) => {
    e.preventDefault();
    deleteProject(project.slug).then(response => {
      handleResponse(response, navigate, emptyFunction, emptyFunction, () => {
        setNotificationsParams([...notificationsParams, {
          title: `Error!`,
          message: `Failed to delete project "${project.name}".`,
          status: "error",
        }])
      }, () => {
        setNotificationsParams([...notificationsParams, {
          title: `Succefully deleted!`,
          message: `Project "${project.name}" was deleted successfully.`,
          status: "success",
        }])
        navigate('/')
      })
    })
  }

  const handleDeleteTask = async (e, taskData) => {
    e.preventDefault();
    deleteTask(project.slug, taskData.number).then(response => {
      handleResponse(response, navigate, emptyFunction, emptyFunction, () => {
        setNotificationsParams([...notificationsParams, {
          title: `Error!`,
          message: `Failed to delete task "${taskData.name}".`,
          status: "error",
        }])
      }, () => {
        setNotificationsParams([...notificationsParams, {
          title: `Succefully deleted!`,
          message: `Task "${taskData.name}" was deleted successfully.`,
          status: "success",
        }])
        getAndSetTasks(query)
      })
    })
  }

  const handleSearch = (e) => {
    setQuery(prevQuery => ({
      ...prevQuery,
      searchText: e.target.value,
    }))
  }

  const handleSort = (e) => {
    setQuery(prevQuery => ({
      ...prevQuery,
      sortBy: e.target.value,
    }))
  }

  if (!project) return;

  return (
    <div className='wrapper w-full min-h-screen bg-gray-50'>
      <Header h1_text={'Read project'} btn_link={{ link: '/', color: 'gray', children: 'Back to Home' }} />
      <div className="main">
        <Container>
          {project ? (
            <div className="w-full p-[15px] max-sm:px-0 flex-col justify-start gap-5 inline-flex">
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
              <div className="w-full flex justify-between">
                <Button link={`/projects/${project.slug}/add-task`} color='blue'>Add task</Button>

                <div className="flex items-center gap-[10px]">
                  <Button link={`/projects/${project.slug}/edit`} color='gray'>Edit</Button>
                  <Button color='red' onClick={handleDelete}>Delete</Button>
                </div>
              </div>

              {(tasks.length !== 0 || query.searchText.length !== 0) ? (
                <>
                  <h2 className="self-stretch text-gray-900 text-[32px] font-bold leading-9">Tasks</h2>
                  <div className="flex justify-between items-center max-[400px]:flex-wrap gap-[20px]">
                    <input type="text" placeholder='Search'
                      onChange={handleSearch} value={query.searchText}
                      className="max-w-[400px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] 
              text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight" />

                    <select
                      onChange={handleSort} value={query.sortBy}
                      className="min-[400px]:max-w-[200px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] 
              text-base font-normal text-gray-900">
                      <option value="newest">Newest to oldest</option>
                      <option value="oldest">Oldest to newest</option>
                      <option value="alphabetical">Alphabetical</option>
                      <option value="reverseAlphabetical">Reverse alphabetical</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <table className="w-full table-auto">
                      <thead>
                        <tr>
                          <th className='border border-gray-500'>Name</th>
                          <th className='border border-gray-500'>Description</th>
                          <th className='border border-gray-500'>Status</th>
                          <th className='border border-gray-500'>Priority</th>
                          <th className='border border-gray-500'>Start date</th>
                          <th className='border border-gray-500'>End date</th>
                          <th className='border border-gray-500'>Created</th>
                          <th className='border border-gray-500'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task, index) => {
                          return (
                            <tr key={index}>
                              <td className='border border-gray-500'><Link to={`/projects/${project.slug}/tasks/${task.number}`} className='hover:text-blue-600 active:hover:text-blue-700'>{task.name}</Link></td>
                              <td className='border border-gray-500'>{task.description}</td>
                              <td className='border border-gray-500 text-center'>{task.status}</td>
                              <td className='border border-gray-500 text-center'>{task.priority}</td>
                              <td className='border border-gray-500 text-center'>{task.start_date}</td>
                              <td className='border border-gray-500 text-center'>{task.end_date}</td>
                              <td className='border border-gray-500 text-center'>{formatDate(task.createdAt, 'yyyy-MM-dd (HH:mm)')}</td>
                              <td className='border border-gray-500 text-center'>
                                <div className="flex justify-center items-center gap-[10px]">
                                  <Button link={`/projects/${project.slug}/tasks/${task.number}/edit`} color='gray'>Edit</Button>
                                  <Button color='red' onClick={(e) => { handleDeleteTask(e, task) }}>Delete</Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
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