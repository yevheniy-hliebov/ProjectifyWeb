import axios from "axios"

export async function getProjects(searchText = '', sortBy = '') {
  let queryParams = [];
  if (searchText !== '') queryParams.push(`searchText=${searchText}`);
  if (sortBy !== '') queryParams.push(`sortBy=${sortBy}`);
  let query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';

  return axios.get('/projects' + query).then(response => {    
    return response;
  }).catch(err => { return err.response })
}

export async function getProject(slug) {
  return axios.get('/projects/' + slug).then(response => {
    return response;
  }).catch(err => { return err.response })
}

export async function createProject(projectData) {
  return axios.post('/projects', projectData).then(response => {
    return response;
  }).catch(err => { return err.response })
}

export async function updateProject(slug, projectData) {
  return axios.put('/projects/' + slug, projectData).then(response => {
    return response;
  }).catch(err => { return err.response })
}

export async function deleteProject(slug) {
  return axios.delete('/projects/' + slug).then(response => {
    return response;
  }).catch(err => { return err.response })
}