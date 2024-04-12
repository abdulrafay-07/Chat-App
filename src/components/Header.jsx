import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosLogOut } from 'react-icons/io';
import { useAuth } from '../utils/AuthContext';

const Header = () => {
    const {user, handleUserLogout} = useAuth();

    return (
        <div id='header-wrapper'>
            {user ? (
                <>
                    <h2>Welcome {user.name}</h2>
                    <IoIosLogOut onClick={handleUserLogout} className='header-link' />
                </>
            ) : (
                <Link to='/login'>Login</Link>
            )}
        </div>
    )
}

export default Header;