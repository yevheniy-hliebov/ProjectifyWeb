import React, { useState } from 'react';
import Container from '../../components/Container';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import { login } from '../../functions/authApi';

function Login({ authUser, setAuthUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleUsername = (e) => {
    const username = e.target.value;
    setUser(prevUser => ({
      ...prevUser,
      username: username,
    }))
  }
  const handlePassword = (e) => {
    const password = e.target.value;
    setUser(prevUser => ({
      ...prevUser,
      password: password,
    }))
  }

  const handleForm = async (e) => {
    e.preventDefault();
    const response = await login(user);
    if (!response) {
      navigate('/internal-server-error')
    } else if (response.status === 200) {
      setAuthUser(response.data)
      navigate('/');
    } else {
      setError(response.data.message);
    }
  }

  if (authUser) {
    navigate('/')
  }

  return (
    <Container className='h-screen flex flex-col items-center justify-center'>
      <div className="w-full max-w-[460px] p-[30px] bg-gray-100 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-[20px] flex-col justify-center items-center gap-2.5 inline-flex">
        <form className="w-full flex-col justify-center items-center gap-[15px] flex" onSubmit={handleForm}>
          <div className="w-full flex-col justify-center items-center gap-[15px] flex">
            <h2 className="text-black text-[32px] font-bold leading-9">Welcome</h2>
            <Input label="Username" placeholder="Write the username" inputValue={user.username} onChange={handleUsername} />
            <Input label="Password" type='password' placeholder="Write the password" inputValue={user.password} onChange={handlePassword} />
          </div>
          { error.length > 0 && <div className="text-red-500 text-sm font-normal leading-tight">{error}</div> }
          <div className="self-stretch justify-center items-center gap-2.5 inline-flex">
            <div className="text-gray-500 text-sm font-normal leading-tight">Don't have an account?</div>
            <Link to='/register' className="text-gray-500 text-sm font-normal underline leading-tight">Sign Up</Link>
          </div>
          <div className="justify-center items-center gap-[15px] inline-flex">
            <Button color="gray" link="/">Cancel</Button>
            <Button color="blue" type='submit'>Log In</Button>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default Login