import React, { useContext, useState } from 'react';
import Container from '../../components/Container';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import { validateUserDto } from '../../functions/validation';
import { register } from '../../functions/authApi';
import { AuthContext } from '../../App';

function Register() {
  const [authUser, setAuthUser] = useContext(AuthContext)
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleUsername = (e) => {
    const username = e.target.value;
    setUser(prevUser => ({
      ...prevUser,
      username: username,
    }))
  }
  const handleEmail = (e) => {
    const email = e.target.value;
    setUser(prevUser => ({
      ...prevUser,
      email: email,
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
    const errs = validateUserDto(user);
    setErrors(errs);
    if (errs.username === '' && errs.email === '' && errs.password === '') {
      const response = await register(user);
      if (response === undefined) {
        navigate('/internal-server-error')
      } else if (response.status === 201 || response.status === 200) {
        setAuthUser(response.data)
        navigate('/');
      } else {
        for (const key in response.data.errors) {
          if (Object.hasOwnProperty.call(response.data.errors, key)) {
            const message = response.data.errors[key];
            setErrors(errs => ({
              ...errs,
              [key]: message
            }));
          }
        }
      }
    }
  }

  if (authUser) {
    navigate('/')
  }

  return (
    <Container className='h-screen flex flex-col items-center justify-center'>
      <div className="w-full max-w-[460px] p-[30px] bg-gray-100 rounded-[20px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex-col justify-center items-center gap-2.5 inline-flex">
        <form className="w-full flex-col justify-center items-center gap-[15px] flex" onSubmit={handleForm}>
          <div className="w-full flex-col justify-center items-center gap-[15px] flex">
            <h2 className="text-black text-[32px] font-bold leading-9">Create Account</h2>
            <Input label="Username*" placeholder="Write the username" inputValue={user.username} onChange={handleUsername} error={errors.username}/>
            <Input label="Email*" type='email' placeholder="Write the email" inputValue={user.email} onChange={handleEmail} error={errors.email}/>
            <Input label="Password*" type='password' placeholder="Write the password" inputValue={user.password} onChange={handlePassword} error={errors.password}/>
          </div>
          <div className="self-stretch justify-center items-center gap-2.5 inline-flex">
            <div className="text-gray-500 text-sm font-normal leading-tight">Already have an account?</div>
            <Link to='/login' className="text-gray-500 text-sm font-normal underline leading-tight">Log In</Link>
          </div>
          <div className="justify-center items-center gap-[15px] inline-flex">
            <Button color="blue" type='submit'>Sign Up</Button>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default Register