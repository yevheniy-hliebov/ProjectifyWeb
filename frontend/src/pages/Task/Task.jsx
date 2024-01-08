import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import { formatDate } from '../../functions/formatDate';
import Header from '../../components/Header';
import Container from '../../components/Container';
import { NotificationContext } from '../../components/Notifications';
import { deleteTask, getTask, getTasks } from '../../functions/taskApi';
import { handleResponse } from '../../functions/handleResponse';

const emptyFunction = () => { };

function Task() {
  const navigate = useNavigate();
  const [notificationsParams, setNotificationsParams] = useContext(NotificationContext)
  const { slug, number } = useParams();
  const [task, setTask] = useState(null)

  useEffect(() => {
    getTask(slug, number).then(response => {
      handleResponse(response, navigate, () => {
        setTask(response.data)
      }, emptyFunction, () => {
        navigate('/task-not-found')
      })
    })
  }, [slug])

  const handleDeleteTask = async (e, taskData) => {
    e.preventDefault();
    deleteTask(slug, taskData.number).then(response => {
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
        navigate('/projects/' + slug)
      })
    })
  }

  if (!task) return;

  return (
    <div className='wrapper w-full min-h-screen bg-gray-50'>
      <Header h1_text={'Read task'} btn_link={{ link: '/', color: 'gray', children: 'Back to Home' }} />
      <div className="main">
        <Container>
          {task ? (
            <div className="w-full p-[15px] max-sm:px-0 flex-col justify-start gap-5 inline-flex">
              <h2 className="self-stretch text-gray-900 text-[32px] font-bold leading-9">{task.name}</h2>
              {task.description !== '' ? (
                <div className="self-stretch flex-col justify-start items-start gap-2.5 flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Description:</div>
                  <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">{task.description}</div>
                </div>
              ) : null}
              {task.status !== '' ? (
                <div className="self-stretch justify-start items-start gap-2.5 flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Status:</div>
                  <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">{task.status}</div>
                </div>
              ) : null}
              {task.priority !== '' ? (
                <div className="self-stretch justify-start items-start gap-2.5 flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Priority:</div>
                  <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">{task.priority}</div>
                </div>
              ) : null}
              {task.start_date !== '' ? (
                <div className="self-stretch justify-start items-start gap-2.5 flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Start date:</div>
                  <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">{task.start_date}</div>
                </div>
              ) : null}
              {task.end_date !== '' ? (
                <div className="self-stretch justify-start items-start gap-2.5 flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">End date:</div>
                  <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">{task.end_date}</div>
                </div>
              ) : null}
              <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                <div className="text-gray-900 text-base font-bold leading-tight">Created:</div>
                <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">{formatDate(task.createdAt, 'yyyy-MM-dd (HH:mm)')}</div>
              </div>
              {task.createdAt === task.updatedAt ? null : (
                <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Updated:</div>
                  <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">{formatDate(task.updatedAt, 'yyyy-MM-dd (HH:mm)')}</div>
                </div>
              )}
              <div className="flex items-center justify-end gap-[10px]">
                <Button link={`/projects/${slug}/tasks/${number}/edit`} color='gray'>Edit</Button>
                <Button color='red' onClick={(e) => { handleDeleteTask(e, task) }}>Delete</Button>
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

export default Task