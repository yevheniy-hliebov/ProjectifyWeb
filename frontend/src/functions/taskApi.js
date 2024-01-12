import axios from "axios"
import { getCookie } from "./get-cookie";

export async function createTask(taskDto, project_slug) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.post(`/projects/${project_slug}/tasks`, taskDto, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
} 

export async function getTasks(project_slug, page, search = '', sort = '') {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }

  let queryParams = [];
  if (page) queryParams.push(`page=${page}`)
  if (search !== '') queryParams.push(`search=${search}`);
  if (sort !== '') queryParams.push(`sort=${sort}`);
  let query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';

  return axios.get(`/projects/${project_slug}/tasks` + query, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
} 

export async function getTask(project_slug, number) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.get(`/projects/${project_slug}/tasks/${number}`, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
} 

export async function updateTask(project_slug, number, taskDto) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.put(`/projects/${project_slug}/tasks/${number}`, taskDto, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
} 

export async function deleteTask(project_slug, number) {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return "Unauthorized"
  }
  return axios.delete(`/projects/${project_slug}/tasks/${number}`, { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => { return err.response })
} 