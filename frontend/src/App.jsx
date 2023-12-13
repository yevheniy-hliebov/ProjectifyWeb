import './scss/app.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';

import axios from 'axios';
axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/projects/:slug' element={<Project />} />
        <Route path='/project/create' element={<CreateProject />} />
        <Route path='/projects/:slug/edit' element={<EditProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;