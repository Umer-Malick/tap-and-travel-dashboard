/* eslint-disable no-unused-vars */
import { FaBus } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginAdmin } from '../apis/AuthenticationApi';
// import Loader from "../utils/Loader";
import { useState } from 'react';
import Loader from '../utils/Loader';
import { useDispatch } from 'react-redux';
import { initializeStore } from '../../store/initializeStore';
import Button from '../utils/components/Button';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      email: email,
      password: password,
    };
    try {
      const result = await loginAdmin(data);

      if (result.success) {
        const { data } = result;
        window.localStorage.setItem('token', data.token);
        await initializeStore(dispatch);
        setIsLoading(false);
        toast.success(data.message);
        navigate('/');
      } else {
        setIsLoading(false);
        toast.error(result.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="px-4 lg:px-0 grid grid-cols-1 md:grid-cols-2 overflow-hidden h-screen lg:bg-none bg-main">
      <div className="hidden md:block">
        <div className="h-full flex justify-center items-center">
          <img src="https://www.freeiconspng.com/uploads/bus-png-4.png" className="object-cover w-full" alt="quiz-mine" />
        </div>
      </div>

      <div className="flex justify-center max-h-screen ">
        <form className="border-primary border-solid border-2 rounded-lg h-fit my-auto p-5 w-full lg:w-2/3" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
            <FaBus className="text-3xl text-primary mr-2" />
            <span className="text-primary text-3xl text-center font-bold mb-0.5">Tap & Travel</span>
          </div>
          <h2 className="text-xl italic font-bold text-center mb-0.5">Journey Bright, Day or Night</h2>
          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="font-bold text-lg">
              Email :
            </label>
            <input
              className="border-ternary_light border-solid border-2 rounded-full px-4 py-1 focus:border-primary focus:outline-none"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter Your E-mail"
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="password" className="font-bold text-lg">
              Password :
            </label>
            <input
              className="border-ternary_light border-solid border-2 rounded-full px-4 py-1 focus:border-primary focus:outline-none"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter Your Password"
            />
          </div>

          <div className="mb-1">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
