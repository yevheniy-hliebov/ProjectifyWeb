import React, { useContext, useEffect, useState } from 'react'
import Container from './Container'
import Button from './Button'
import Input from './Input';
import slugify from '../functions/slugify'
import { validationProjectData } from '../functions/validation'
import { createProject, updateProject } from '../functions/projectAPI'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from './Notifications'
import Textarea from './Textarea';
import { handleResponse } from '../functions/handleResponse';

function FormProject({ projectData = null, isUpdateAction = false }) {
  const navigate = useNavigate();
  const [notificationsParams, setNotificationsParams] = useContext(NotificationContext)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: ''
  })
  const [errors, setErrors] = useState({ name: '', description: '' })

  useEffect(() => {
    if (projectData) setFormData(projectData);
  }, [projectData])

  const checkForChanges = () => {
    if (!projectData) return true
    return (
      formData.name !== projectData.name ||
      formData.description !== projectData.description ||
      formData.slug !== projectData.slug
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkForChanges()) {
      const errorsValidate = validationProjectData(formData);
      setErrors(errorsValidate);
      if (!errorsValidate.name && !errorsValidate.description) {
        let response;
        if (!isUpdateAction) response = await createProject(formData);
        else response = await updateProject(projectData.slug, formData);

        handleResponse(response, navigate, () => {
          setNotificationsParams([...notificationsParams, {
            title: `Success ${!isUpdateAction ? 'created' : 'updated'}!`,
            message: `Project "${formData.name}" was ${!isUpdateAction ? 'created' : 'updated'} successfully.`,
            status: "success",
          }])
          navigate('/projects/' + response.data.slug);
        }, () => {
          setNotificationsParams([...notificationsParams, {
            title: `Error!`,
            message: `Failed to ${!isUpdateAction ? 'create' : 'update'} project "${formData.name}".`,
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
  }

  const handleName = (e) => {
    const name = e.target.value;
    const slug = slugify(name);
    setFormData(prevData => ({
      ...prevData,
      name: name,
      slug: slug
    }))
  }

  const handleDecription = (e) => {
    const description = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      description: description
    }))
  }

  return (
    <Container>
      <form className='w-full min-sm:px-[15px] flex flex-col gap-[20px]' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-[10px]">
          <Input label='Name project' inputValue={formData.name} placeholder='Enter the name of the project...' onChange={handleName} error={errors.name} />
          {formData.slug && (
            <div className="text-gray-500 text-sm font-normal leading-tight" title='Must be unique'>Slug: <b>{formData.slug}</b></div>
          )}
        </div>
        <Textarea label='Description' inputValue={formData.description} placeholder='Write the description of the project...' onChange={handleDecription} error={errors.description} maxLength={1500}/>

        <div className="flex justify-end items-center gap-[10px]">
          <Button link='/' color='gray'>Cancel</Button>
          <Button color='green' type='submit'>{!isUpdateAction ? 'Create' : 'Save'}</Button>
        </div>
      </form>
    </Container>
  )
}

export default FormProject