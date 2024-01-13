import { TaskDto } from "../types/task.type";
import { validateDate } from "./date.validation";

export function TaskValidation(taskDto: TaskDto, method = 'create') {
  const isUpdate = method === 'update';
  const { name, description, status, priority, start_date, end_date, number } = taskDto;

  const errors: Record<string, string> = {};

  function setError(field: any, fieldName: string, validationHandle) {
    const errorMessage = validationHandle(field);
    if (errorMessage !== undefined) {
      errors[fieldName] = errorMessage;
    }
  }

  if (isUpdate) {
    if ('name' in taskDto) {
      setError(name, 'name', validateName);
    }
  } else {
    setError(name, 'name', validateName);
  }

  if ('description' in taskDto) {
    setError(description, 'description', validateDescription);
  }
  if ('status' in taskDto) {
    setError(status, 'status', validateStatus);
  }
  if ('priority' in taskDto) {
    setError(priority, 'priority', validatePriority);
  }
  if ('start_date' in taskDto) {
    if (!validateDate(start_date)) {
      errors.start_date = 'Invalid start date entered for the task'
    }
  }
  if ('end_date' in taskDto) {
    if (!validateDate(end_date)) {
      errors.end_date = 'Invalid end date entered for the task'
    }
  }
  if ('end_date' in taskDto) {
    if (!isNaN(number)) {
      errors.number = 'Task number must be numeric'
    }
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

function validateName(name: any) {
  let nameField = '';
  if (name === undefined || name === null) {
    nameField = 'The name of the task must be string'
  } else {
    if (name.length === 0) {
      nameField = 'The name of the task is required';
    } else if (name.length < 3) {
      nameField = 'The name of the task is less than 3 characters';
    } else if (name.length > 50) {
      nameField = 'The name of the task is longer than 50 characters';
    }
  }
  return nameField !== '' ? nameField : undefined;
}

function validateDescription(description: any) {
  let descriptionField = '';
  if (description === undefined || description === null) {
    descriptionField = 'The description of the task must be string'
  } else {
    if (description.length > 500) {
      descriptionField = 'The description of the task is longer than 500 characters';
    }
  }
  return descriptionField !== '' ? descriptionField : undefined;
}

function validateStatus(status: any) {
  let statusField = '';
  let index = undefined;
  const validStatuses = ['Not started', 'In progress', 'Done'];
  validStatuses.forEach((validStatus, i) => {
    if (validStatus.toLowerCase() === status.toLowerCase()) {
      index = i;
    }
  });
  if (index === undefined){
    statusField = 'Invalid status entered for the task';
  }
  return statusField !== '' ? statusField : undefined;
}

function validatePriority(priority: any) {
  let priorityField = '';
  let index = undefined;
  const validPriorities = ['Low', 'Medium', 'High'];
  validPriorities.forEach((validPriority, i) => {
    if (validPriority.toLowerCase() === priority.toLowerCase()) {
      index = i;
    }
  });
  if (index === undefined){
    priorityField = 'Invalid priority entered for the task';
  }
  return priorityField !== '' ? priorityField : undefined;
}

