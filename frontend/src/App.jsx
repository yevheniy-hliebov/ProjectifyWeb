import './scss/app.scss'
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project/Project';
import CreateProject from './pages/Project/CreateProject';
import EditProject from './pages/Project/EditProject';
import NotFoundProject from './pages/Project/NotFoundProject';
import NotFound from './pages/NotFound';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import { checkIsAuthorized } from './functions/authApi';
import Forbidden from './pages/Forbidden';
import InternalServerError from './pages/InternalServerError';
import Notifications, { NotificationContext } from './components/Notifications';
import CreateTask from './pages/Task/CreateTask';

import axios from 'axios';
import EditTask from './pages/Task/EditTask';
import Task from './pages/Task/Task';
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000"
axios.defaults.withCredentials = true

export const AuthContext = createContext();

function AuthorizedRoute({ user, isLoading }) {
  if (!user && !isLoading) {
    return <Navigate to='/login' />
  }
  return <Outlet />
}

function App() {
  const [authUser, setAuthUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notificationsParams, setNotificationsParams] = useState([])

  useEffect(() => {
    checkIsAuthorized().then(response => {
      if (response && response.status === 200) {
        setAuthUser(response.data)
      }
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <NotificationContext.Provider value={[notificationsParams, setNotificationsParams]}>
        <Notifications />
        <AuthContext.Provider value={[authUser, setAuthUser]}>
          <BrowserRouter>
            <Routes>
              <Route element={<AuthorizedRoute user={authUser} isLoading={isLoading} />}>
                <Route path='/' element={<Home />} />
                <Route path='/create-project' element={<CreateProject />} />
                <Route path='/projects/:slug' element={<Project />} />
                <Route path='/projects/:slug/edit' element={<EditProject />} />
                <Route path='/projects/:slug/add-task' element={<CreateTask />} />
                <Route path='/projects/:slug/tasks/:number' element={<Task />} />
                <Route path='/projects/:slug/tasks/:number/edit' element={<EditTask />} />
                <Route path="/project-not-found" element={<NotFoundProject />} />
              </Route>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="/internal-server-error" element={<InternalServerError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </NotificationContext.Provider>
    </>
  );
}

export default App;