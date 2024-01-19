import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../Container';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import { createTask, updateTask } from '../../api/tasks';
import useNotification from '../../hook/useNotification';
import Select from './Select';

const emptyTask = {
  name: '',
  description: '',
  status: '',
  priority: '',
  start_date: '',
  end_date: ''
};

function FormTask({ taskData = null, isEditTask = false, oldSlug = null, oldNumber = null }) {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [task, setTask] = useState(taskData ? taskData : emptyTask);
  const [errors, setErrors] = useState(emptyTask);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let res = undefined;
    if (!isEditTask) {
      res = await createTask(oldSlug, task);
    } else {
      res = await updateTask(oldSlug, oldNumber, task);
    }
    if (res?.status === 201 || res?.status === 200) {
      addNotification(
        `Task "${res.data.name}" was ${isEditTask ? 'updated' : 'created'} successfully.`,
        res?.status
      );
      navigate('/projects/' + oldSlug);
    } else if (res?.status === 400) {
      setErrors((prevErrors) => ({ ...prevErrors, ...res.data.errors }));
      addNotification(res.data.message, res?.status);
    } else if (res?.status === 401) {
      navigate('/login');
    } else if (res?.status === 404) {
      addNotification(res.data.message, res?.status);
    } else if (res.status === 500) {
      addNotification('Failed to delete: Internal server error', 500);
      navigate('/500');
    }
  };

  return (
    <div className="pb-4">
      <Container>
        <form className="w-full min-sm:px-[15px] flex flex-col gap-[20px]" onSubmit={handleSubmit}>
          <Input
            label="Name task"
            inputValue={task.name}
            name="name"
            placeholder="Enter the name of the task..."
            onChange={handleChange}
            error={errors.name}
          />
          <Textarea
            label="Description"
            inputValue={task.description}
            name="description"
            placeholder="Enter the description of the task..."
            onChange={handleChange}
            error={errors.description}
            maxLength={500}
          />

          <div className="max-w-xs flex flex-col gap-3">
            <Select
              label="Status"
              inputValue={task.status}
              name="status"
              placeholder="--Choose an option--"
              listOptions={['Not started', 'In progress', 'Done']}
              onChange={handleChange}
              error={errors.status}
            />
            <Select
              label="Priority"
              inputValue={task.priority}
              name="priority"
              placeholder="--Choose an option--"
              listOptions={['Low', 'Medium', 'High']}
              onChange={handleChange}
              error={errors.priority}
            />

            <Input
              label="Start date"
              type="date"
              placeholder="Enter the start date"
              inputValue={task.start_date}
              name="start_date"
              onChange={handleChange}
              error={errors.start_date}
            />
            <Input
              label="End date"
              type="date"
              placeholder="Enter the end date"
              inputValue={task.end_date}
              name="end_date"
              onChange={handleChange}
              error={errors.end_date}
            />
          </div>

          <div className="flex justify-end items-center gap-[10px]">
            <Button link="/" color="gray">
              Cancel
            </Button>
            <Button color="green" type="submit">
              {!isEditTask ? 'Create' : 'Save'}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default FormTask;
