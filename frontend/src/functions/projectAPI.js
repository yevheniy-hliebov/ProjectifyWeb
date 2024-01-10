import axios from "axios"
import { getCookie } from "./get-cookie";

export async function getProjects(page, searchText = '', sortBy = '') {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }

  let queryParams = [];
  if (page) queryParams.push(`page=${page}`)
  if (searchText !== '') queryParams.push(`searchText=${searchText}`);
  if (sortBy !== '') queryParams.push(`sortBy=${sortBy}`);
  let query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';

  return axios.get('/projects' + query, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
}

export async function getProject(slug) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.get('/projects/' + slug, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
}

export async function createProject(projectData) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.post('/projects', projectData, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
}

export async function updateProject(slug, projectData) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.put('/projects/' + slug, projectData, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
}

export async function deleteProject(slug) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.delete('/projects/' + slug, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
}