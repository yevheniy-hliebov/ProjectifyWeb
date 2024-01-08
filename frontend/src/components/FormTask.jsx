import React, { useContext, useEffect, useState } from 'react'
import Container from './Container'
import { NotificationContext } from './Notifications';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import { TaskValidation } from '../functions/validation';
import { createTask, updateTask } from '../functions/taskApi';
import { handleResponse } from '../functions/handleResponse';

function FormTask({ taskData = null, isUpdateAction = false }) {
  const navigate = useNavigate();
  const [notificationsParams, setNotificationsParams] = useContext(NotificationContext)
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    start_date: '',
    end_date: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    if (taskData) setFormData(taskData);
  }, [taskData])


  const handleName = (e) => {
    const name = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      name: name,
    }))
  }

  const handleDecription = (e) => {
    const description = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      description: description
    }))
  }

  const handleStartDate = (e) => {
    const start_date = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      start_date: start_date
    }))
  }

  const handleEndDate = (e) => {
    const end_date = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      end_date: end_date
    }))
  }

  const handleStatus = (e) => {
    const status = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      status: status
    }))
  }

  const handlePriority = (e) => {
    const priority = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      priority: priority
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsValidate = TaskValidation(formData);

    setErrors(errorsValidate);
    if (!Object.values(errorsValidate).some(error => error !== '')) {
      let response;
      if (!isUpdateAction) response = await createTask(formData, slug);
      else response = await updateTask(slug, taskData.number, formData);

      handleResponse(response, navigate, () => {
        setNotificationsParams([...notificationsParams, {
          title: `Success ${!isUpdateAction ? 'created' : 'updated'}!`,
          message: `Task "${formData.name}" was ${!isUpdateAction ? 'created' : 'updated'} successfully.`,
          status: "success",
        }])
        navigate('/projects/' + slug);
      }, () => {
        setNotificationsParams([...notificationsParams, {
          title: `Error!`,
          message: `Failed to ${!isUpdateAction ? 'create' : 'update'} task "${formData.name}".`,
          status: "error",
        }])
        for (const key in response.data.errors) {
          if (Object.hasOwnProperty.call(response.data.errors, key)) {
            const message = response.data.errors[key];
            setErrors(errs => ({
              ...errs,
              [key]: message
            }));
          }
        }
      })
    }
  }

  return (
    <Container>
      <form className='w-full min-sm:px-[15px] pb-7 flex flex-col gap-[20px]' onSubmit={handleSubmit}>
        <Input label='Name task' inputValue={formData.name} placeholder='Enter the name of the task...' onChange={handleName} error={errors.name} />
        <Textarea label='Description' inputValue={formData.description} placeholder='Enter the description of the task...' onChange={handleDecription} error={errors.description} maxLength={500} />

        <div className="max-w-xs flex flex-col gap-3">
          <Select label='Status' inputValue={formData.status} placeholder='--Choose an option--' listOptions={['Not started', 'In progress', 'Done']} onChange={handleStatus} error={errors.status} />
          <Select label='Priority' inputValue={formData.priority} placeholder='--Choose an option--' listOptions={['Low', 'Medium', 'High']} onChange={handlePriority} error={errors.priority} />

          <Input label='Start date' type='date' placeholder='Enter the start date' inputValue={formData.start_date} onChange={handleStartDate} error={errors.start_date} />
          <Input label='End date' type='date' placeholder='Enter the end date' inputValue={formData.end_date} onChange={handleEndDate} error={errors.end_date} />
        </div>


        <div className="flex justify-end items-center gap-[10px]">
          <Button link={`/projects/${slug}`} color='gray'>Cancel</Button>
          <Button color='green' type='submit'>{!isUpdateAction ? 'Create' : 'Save'}</Button>
        </div>
      </form>
    </Container>
  )
}

export default FormTask