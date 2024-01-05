import './scss/app.scss'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import NotFound from './pages/NotFound';
import NotFoundProject from './pages/NotFoundProject';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import { checkIsAuthorized } from './functions/authApi';
import Forbidden from './pages/Forbidden';
import InternalServerError from './pages/InternalServerError';

import axios from 'axios';
axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true

function AuthorizedRoute({ user, isLoading }) {
  if (!user && !isLoading) {
    return <Navigate to='/login' />
  }
  return <Outlet />
}

function App() {
  const [authUser, setAuthUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkIsAuthorized().then(response => {
      if (response && response.status === 200) {
        setAuthUser(response.data)
      }
      setIsLoading(false)
    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthorizedRoute user={authUser} isLoading={isLoading} />}>
          <Route path='/project/create' element={<CreateProject authUser={authUser} setAuthUser={setAuthUser} />} />
          <Route path='/projects/:slug/edit' element={<EditProject authUser={authUser} setAuthUser={setAuthUser} />} />
          <Route path='/' element={<Home authUser={authUser} setAuthUser={setAuthUser} />} />
          <Route path='/projects/:slug' element={<Project authUser={authUser} setAuthUser={setAuthUser} />} />
          <Route path="/project-not-found" element={<NotFoundProject />} />
        </Route>
        <Route path="/register" element={<Register authUser={authUser} setAuthUser={setAuthUser} />} />
        <Route path="/login" element={<Login authUser={authUser} setAuthUser={setAuthUser} />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/internal-server-error" element={<InternalServerError />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;