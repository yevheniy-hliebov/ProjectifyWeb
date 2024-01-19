import './css/app.scss';
import { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuth from './hook/useAuth';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import Notifications from './components/Notifications';
import { NotificationContext } from './hook/useNotification';
import CreateProject from './pages/Project/CreateProject';
import EditProject from './pages/Project/EditProject';
import Project from './pages/Project/Project';
import Task from './pages/Task/Task';
import CreateTask from './pages/Task/CreateTask';
import EditTask from './pages/Task/EditTask';

export const AuthContext = createContext(null);

function AuthorizedRoute({ user, isLoading }) {
  if (!user && !isLoading) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

function App() {
  const { authUser, setAuthUser, isLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);

  return (
    <>
      <NotificationContext.Provider value={[notifications, setNotifications]}>
        <Notifications />
        <AuthContext.Provider value={[authUser, setAuthUser]}>
          <BrowserRouter>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route element={<AuthorizedRoute user={authUser} isLoading={isLoading} />}>
                <Route path="/" element={<Home />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/projects/:slug/edit" element={<EditProject />} />
                <Route path="/projects/:slug" element={<Project />} />
                <Route path="/projects/:slug/add-task" element={<CreateTask />} />
                <Route path="/projects/:slug/tasks/:number" element={<Task />} />
                <Route path="/projects/:slug/tasks/:number/edit" element={<EditTask />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </NotificationContext.Provider>
    </>
  );
}

export default App;
