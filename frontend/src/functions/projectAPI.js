import axios from "axios"
import { getCookie } from "./get-cookie";

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
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.post('/projects', projectData, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
}

export async function checkPermission(slug) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.get(`/projects/${slug}/permission`, { headers: { "Authorization": accessToken } }).then(response => {
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
  return axios.delete('/projects/' + slug).then(response => {
    return response;
  }).catch(err => { return err.response })
}