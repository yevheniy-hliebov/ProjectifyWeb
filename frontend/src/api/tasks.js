import { queryStringify } from '../modules/query-stringify';
import api from './api';
import { authConfig, responseUnauthorized } from './auth';

const root_path = 'projects';

const handleIsAuthConfig = (authConfig, fun) => {
  if (authConfig) {
    return fun;
  } else {
    return responseUnauthorized;
  }
};

export const getTasks = async (slug, query = {}) => {
  const config = authConfig();
  const queryString = queryStringify(query);
  return handleIsAuthConfig(
    config,
    api
      .get(`${root_path}/${slug}/tasks` + (queryString ? '?' + queryString : ''), config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const getTask = async (slug, number) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .get(`${root_path}/${slug}/tasks/${number}`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const createTask = async (slug, TaskData) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .post(`${root_path}/${slug}/tasks`, TaskData, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};
export const updateTask = async (slug, number, TaskData) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .put(`${root_path}/${slug}/tasks/${number}`, TaskData, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const deleteTask = async (slug, number) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .delete(`${root_path}/${slug}/tasks/${number}`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const getTaskCover = async (slug, number) => {
  const config = authConfig();
  if (config) config.responseType = 'blob';
  return handleIsAuthConfig(
    config,
    api
      .get(`${root_path}/${slug}/tasks/${number}/cover`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const uploadTaskCover = async (slug, number, formData) => {
  const config = authConfig();
  if (config) config.headers['content-type'] = 'multipart/form-data';
  return handleIsAuthConfig(
    config,
    api
      .post(`${root_path}/${slug}/tasks/${number}/cover`, formData, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const changeTaskCover = async (slug, number, formData) => {
  const config = authConfig();
  if (config) config.headers['content-type'] = 'multipart/form-data';
  return handleIsAuthConfig(
    config,
    api
      .put(`${root_path}/${slug}/tasks/${number}/cover`, formData, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const deleteTaskCover = async (slug, number) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .delete(`${root_path}/${slug}/tasks/${number}/cover`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

const apiTasks = {
  getAll: getTasks,
  get: getTask,
  create: createTask,
  update: updateTask,
  delete: deleteTask
};

export default apiTasks;
