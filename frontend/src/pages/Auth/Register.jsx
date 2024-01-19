import { useContext, useState } from 'react';
import Container from '../../components/Container';
import Input from '../../components/form-components/Input';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/form-components/Button';
import { register } from '../../api/auth';
import { AuthContext } from '../../App';

const emptyUser = {
  username: '',
  email: '',
  password: ''
};

function Register() {
  const navigate = useNavigate();
  const setAuthUser = useContext(AuthContext)[1];
  const [user, setUser] = useState(emptyUser);
  const [errors, setErrors] = useState(emptyUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors(emptyUser);
    if (user?.username !== '' && user?.password !== '' && user?.password !== '') {
      register(user).then((res) => {
        if (!res || res.status === 500) {
          navigate('/500');
        } else if (res) {
          if (res.status === 201) {
            navigate('/');
            setAuthUser(res.data);
          } else if (res.status === 400) {
            setErrors((prevErros) => ({
              ...prevErros,
              ...res.data.errors
            }));
          }
        }
      });
    }
  };

  return (
    <Container className="h-screen flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] p-[30px] bg-gray-100 rounded-[20px] shadow-[0_3px_10px_rgb(0,0,0,0.5)] flex-col justify-center items-center gap-[15px] inline-flex"
      >
        <div className="text-black text-[28px] font-bold leading-9">Registration</div>
        <Input
          label="Username"
          name="username"
          placeholder="Enter the username..."
          inputValue={user.username}
          onChange={handleChange}
          error={errors.username}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter the email..."
          inputValue={user.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter the password..."
          inputValue={user.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="w-[400px] h-5 justify-center items-center gap-2.5 inline-flex">
          <div className="text-gray-500 text-sm font-normal leading-tight">
            Already have an account?
          </div>
          <Link to="/login" className="text-gray-500 text-sm font-normal underline leading-tight">
            Log In
          </Link>
        </div>

        <Button type="submit" className="w-[150px]" color="blue">
          Sign Up
        </Button>
      </form>
    </Container>
  );
}

export default Register;
