import React, { useEffect, useState } from 'react'
import Container from './Container'
import Button from './Button'
import slugify from '../functions/slugify'
import { validationProjectData } from '../functions/validation'
import { createProject, updateProject } from '../functions/projectAPI'

function FormProject({ projectData = null, isUpdateAction = false }) {
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
        if (response.status === 201 || response.status === 200) {
          window.location.replace('/projects/' + response.data.slug);
        } else {
          response.data.errors.forEach(error => {
            setErrors({
              ...errors,
              [`${error.field}`]: error.message
            })
          });
        }
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
    e.target.style.height = "";
    e.target.style.height = (e.target.scrollHeight + 2) + "px";

    const description = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      description: description
    }))
  }

  return (
    <Container>
      <form className='w-full min-sm:px-[15px] flex flex-col gap-[20px]' onSubmit={handleSubmit}>
        <div className="field-block flex flex-col gap-[10px]">
          <label className="w-full text-gray-900 text-base font-bold leading-tight">Name project</label>
          <input type="text" placeholder='Write the name of the project...' value={formData.name} onChange={handleName}
            className={`w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] ${errors.name && 'border-red-500'} 
              text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight`} />
          {formData.slug && (
            <div className="text-gray-500 text-sm font-normal leading-tight" title='Must be unique'>Slug: <b>{formData.slug}</b></div>
          )}
          {errors.name && (
            <div className="text-red-500 text-sm font-normal leading-tight">{errors.name}</div>
          )}
        </div>
        <div className="field-block flex flex-col gap-[10px]">
          <label className="w-full text-gray-900 text-base font-bold leading-tight">Description</label>
          <textarea
            className={`min-h-[120px] resize-none w-full p-[10px] border border-gray-500 focus:outline-blue-400 ${(formData.description.length > 1500 || errors.description) && 'border-red-500'} rounded-[3px] 
              text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight`}
            value={formData.description}
            onChange={handleDecription}
            placeholder="Write the description of the project..."
          />
          <div className="flex jb gap-[20px] flex-col-reverse">
            <div className={`self-end ${formData.description.length > 1500 ? 'text-red-500' : 'text-gray-500'} text-sm font-normal leading-tight`}>{formData.description.length}/1500</div>
            {errors.description && (
              <div className="text-red-500 text-sm font-normal leading-tight">{errors.description}</div>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center gap-[10px]">
          <Button link='/' color='gray'>Cancel</Button>
          <Button color='green' type='submit'>{!isUpdateAction ? 'Create' : 'Save'}</Button>
        </div>
      </form>
    </Container>
  )
}

export default FormProject