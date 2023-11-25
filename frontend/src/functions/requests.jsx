import axios from "axios"
import { Redirect } from 'react-router-dom'

export function getProjects(searchText = '', sortBy = '') {
  let queryParams = [];
  if (searchText !== '') queryParams.push(`searchText=${searchText}`);
  if (sortBy !== '') queryParams.push(`sortBy=${sortBy}`);
  let query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';

  console.log(query);

  return axios.get('/projects' + query)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching projects:', error);
      throw error;
    });
}

export function deleteProject(slug) {
  axios.delete('/projects/' + slug).then(res => {
    return res.data
  }).catch(err => console.log('It was not possible to delete the project'))
}

