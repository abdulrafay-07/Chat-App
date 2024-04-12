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
                    <h3>Welcome {user.name}</h3>
                    <div className='header-link'>
                        <IoIosLogOut onClick={handleUserLogout} />
                    </div>
                </>
            ) : (
                <Link to='/login'>Login</Link>
            )}
        </div>
    )
}

export default Header;