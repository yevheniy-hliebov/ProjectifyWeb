export function validationProjectData(projectData) {
  const errors = { name: '', description: '' };

  if (!projectData.name || projectData.name.length < 3 || projectData.name.length > 50) {
    errors.name = 'The name of the project is less than 3 characters';
  }

  if (projectData.description.length > 1500) {
    errors.description = 'The description of the project is longer than 1500 characters';
  }

  return errors;
}