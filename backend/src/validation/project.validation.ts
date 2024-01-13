import { ProjectDto } from "../types/project.type";

export function ProjectValidation(projectDto: ProjectDto, isExistingProject: boolean, method = 'create') {
  const isUpdate = method === 'update';
  const { name, description } = projectDto;

  const errors: Record<string, string> = {};

  function setError(field: any, fieldName: string, validationHandle) {
    const errorMessage = validationHandle(field);
    if (errorMessage !== undefined) {
      errors[fieldName] = errorMessage;
    }
  }

  if (isUpdate) {
    if ('name' in projectDto) {
      setError(name, 'name', validateName);
    }
  } else {
    setError(name, 'name', validateName);
  }
  
  if (isExistingProject) {
    errors.name = 'A project with this slug already exists';
  }

  if ('description' in projectDto) {
    setError(description, 'description', validateDescription);
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
    if (description.length > 1500) {
      descriptionField = 'The description of the task is longer than 1500 characters';
    }
  }
  return descriptionField !== '' ? descriptionField : undefined;
}