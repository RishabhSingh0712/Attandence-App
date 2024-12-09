import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null); // Clear error message after 5 seconds
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
    setErrorMessage(null); // Clear error message when input changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formIsValid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      formIsValid = false;
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      formIsValid = false;
      newErrors.password = 'Password is required';
    }

    if (formIsValid) {
      try {
        const data = {
          Email: formData.email,
          Password: formData.password,
        };
        const response = await axios.post('http://127.0.0.1:5000/api/user/login', data);
        if (response.status === 201) {
          window.localStorage.setItem('token', response.data.token);
          const userInfoString = JSON.stringify(response.data.user_info);
          window.localStorage.setItem('user_info', userInfoString);
          setSuccessMessage('Congratulations, login successful!!');
          setLoading(false);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setErrorMessage('Error, login failed!!'); // Set error message
          setLoading(false);
        }
      } catch (error) {
        setErrorMessage('User not found or password incorrect'); // Set error message
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Employee Login</h2>
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Success! </strong>
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error! </strong>
            <span>{errorMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress color="inherit" size={24} /> : 'Login'}
          </Button>
          <p className="text-center mt-4">
            New Employee?{" "}
            <Link to="/Registerpage" className="text-blue-500">
              Register Here
            </Link>
            {/* forget password code */}
            <br />
            <Link to="/forget-password" className="text-blue-500">
              Reset Password
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
