import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../Container';
import slugifyText from '../../modules/slugify';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import { createProject, updateProject } from '../../api/projects';
import useNotification from '../../hook/useNotification';

const emptyProject = {
  name: '',
  description: ''
};

function FormProject({ projectData = null, isEditProject = false, oldSlug = null }) {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [project, setProject] = useState(projectData ? projectData : emptyProject);
  const [errors, setErrors] = useState(emptyProject);
  const slug = slugifyText(project.name);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let res = undefined;
    if (!isEditProject) {
      res = await createProject(project);
    } else {
      res = await updateProject(slug, project);
    }
    if (res?.status === 201 || res?.status === 200) {
      addNotification(
        `Project "${res.data.name}" was ${isEditProject ? 'updated' : 'created'} successfully.`,
        res?.status
      );
      navigate('/projects/' + res.data.slug);
    } else if (res?.status === 400) {
      setErrors((prevErrors) => ({ ...prevErrors, ...res.data.errors }));
      addNotification(res.data.message, res?.status);
    } else if (res?.status === 401) {
      navigate('/login');
    } else if (!res || res.status === 500) {
      addNotification('Failed to delete: Internal server error', 500);
      navigate('/500');
    }
  };

  return (
    <div>
      <Container>
        <form className="w-full min-sm:px-[15px] flex flex-col gap-[20px]" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[10px]">
            <Input
              label="Name project"
              inputValue={project.name}
              name="name"
              placeholder="Enter the name of the project..."
              onChange={handleChange}
              error={errors.name}
            />
            {slug && (
              <div
                className="text-gray-500 text-sm font-normal leading-tight"
                title="Must be unique"
              >
                Slug: <b>{slug}</b>
              </div>
            )}
          </div>
          <Textarea
            label="Description"
            inputValue={project.description}
            name="description"
            placeholder="Write the description of the project..."
            onChange={handleChange}
            error={errors.description}
            maxLength={1500}
          />

          <div className="flex justify-end items-center gap-[10px]">
            <Button link="/" color="gray">
              Cancel
            </Button>
            <Button color="green" type="submit">
              {!isEditProject ? 'Create' : 'Save'}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default FormProject;
