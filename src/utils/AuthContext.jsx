import { createContext, useState, useEffect, useContext } from 'react';
import appwriteService from '../appwrite/config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        getUsersOnLoad();
    }, [])

    const getUsersOnLoad = async () => {
        try {
            const userData = await appwriteService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error(error)
        }
        setLoading(false);
    }

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault();
        
        const session = await appwriteService.loginAccount(credentials.email, credentials.password);

        if (session) {
            const userData = await appwriteService.getCurrentUser();
            setUser(userData);
            navigate('/');
        }
    }

    const handleUserLogout = async () => {
        await appwriteService.logoutAccount();
        setUser(null);
    }

    const contextData = {
        user,
        handleUserLogin,
        handleUserLogout,
    }

    return <AuthContext.Provider value={contextData}>
        {loading ? <h1 className='loading'>Loading...</h1> : children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext;