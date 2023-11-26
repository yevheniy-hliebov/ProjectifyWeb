import axios from "axios"

export async function getProjects(searchText = '', sortBy = '') {
  let queryParams = [];
  if (searchText !== '') queryParams.push(`searchText=${searchText}`);
  if (sortBy !== '') queryParams.push(`sortBy=${sortBy}`);
  let query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';

  try {
    const response = await axios.get('/projects' + query);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getProject(slug) {
    try {
    const response = await axios.get('/projects/' + slug);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

export async function createProject(projectData) {
    try {
    const response = await axios.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

export async function updateProject(slug, projectData) {
    try {
    const response = await axios.put('/projects/' + slug, projectData);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

export async function deleteProject(slug) {
  try {
    const res = await axios.delete('/projects/' + slug);
    return res.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

