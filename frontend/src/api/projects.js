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

export const getProjects = async (query = {}) => {
  const config = authConfig();
  const queryString = queryStringify(query);
  return handleIsAuthConfig(
    config,
    api
      .get(root_path + (queryString ? '?' + queryString : ''), config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const getProject = async (slug) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .get(`${root_path}/${slug}`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const createProject = async (projectData) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .post(`${root_path}`, projectData, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};
export const updateProject = async (slug, projectData) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .put(`${root_path}/${slug}`, projectData, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const deleteProject = async (slug) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .delete(`${root_path}/${slug}`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const getProjectCover = async (slug) => {
  const config = authConfig();
  if (config) config.responseType = 'blob';
  return handleIsAuthConfig(
    config,
    api
      .get(`${root_path}/${slug}/cover`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const uploadProjectCover = async (slug, formData) => {
  const config = authConfig();
  if (config) config.headers['content-type'] = 'multipart/form-data';
  return handleIsAuthConfig(
    config,
    api
      .post(`${root_path}/${slug}/cover`, formData, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const changeProjectCover = async (slug, formData) => {
  const config = authConfig();
  if (config) config.headers['content-type'] = 'multipart/form-data';
  return handleIsAuthConfig(
    config,
    api
      .put(`${root_path}/${slug}/cover`, formData, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

export const deleteProjectCover = async (slug) => {
  const config = authConfig();
  return handleIsAuthConfig(
    config,
    api
      .delete(`${root_path}/${slug}/cover`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      })
  );
};

const apiProjects = {
  getAll: getProjects,
  get: getProject,
  create: createProject,
  update: updateProject,
  delete: deleteProject
};

export default apiProjects;
