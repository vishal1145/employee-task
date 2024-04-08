import React, { useState ,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const ResetPasswordPage = () => {

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleResetPassword = async () => {
    try {
      if (!token) {
        // Handle case where token is not provided
        toast.error('Token is missing');
        return;
      }
  
      // Send a request to reset password with token
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/resetpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });
  
      // Handle the response
      if (response.ok) {
        // Password reset successful
        toast.success('Password reset successful');
      } else {
        // Password reset failed
        const data = await response.json();
        toast.error(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred while resetting your password');
    }
  };
  
  // This function will parse the token from the URL params
  const parseTokenFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  };

  // Call parseTokenFromURL on component mount
  useEffect(() => {
    parseTokenFromURL();
  }, []);

  return (
    <>
      <div className="container">
        <h2>Reset Password</h2>
        <form>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </form>
        <div className="mt-3">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // transition:Bounce
      />
    </>
  );
};

export default ResetPasswordPage;
