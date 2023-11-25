import './scss/app.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.page';

import axios from 'axios';
axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
