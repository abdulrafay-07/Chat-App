import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const {user, handleUserSignup} = useAuth();

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        name: ''
    })

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [])

    const handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setCredentials({...credentials, [name]:value});
    }

    return (
        <div className='auth-container'>
            <div className='form-wrapper'>
                <form onSubmit={(e) => {handleUserSignup(e, credentials)}}>
                    <h2 className='field-heading'>
                        Sign up to create account
                    </h2>

                    <div className='field-wrapper'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            placeholder='Enter your name'
                            name='name'
                            required
                            value={credentials.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='field-wrapper'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            placeholder='Enter your email'
                            name='email'
                            required
                            value={credentials.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='field-wrapper'>
                        <label htmlFor='password'>Password:</label>
                        <input
                            type='password'
                            placeholder='Enter your password'
                            name='password'
                            required
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='field-signup-text'>
                        <p>Already have an account?&nbsp;</p>
                        <Link
                            className='auth-link'
                            to="/login"
                        >
                            Sign In
                        </Link>
                    </div>

                    <div className='field-wrapper'>
                        <input
                            className='btn btn-lg btn-main'
                            type='submit'
                            value="Sign Up"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;