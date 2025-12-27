import { Navigate, Outlet } from 'react-router'
// import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {

    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>Checking authentication...</p>
            </div>
        );

    }
        /*    const [isAuth, setIsAuth] = useState(null);
       
       
           useEffect(()=>{
               fetch("http://localhost:5000/auth/profile", {
                   method: 'GET',
                   credentials: "include",
               })
               .then(res => {
                   if (res.ok) {
                       setIsAuth(true);
                   } else {
                       setIsAuth(false);
                   }
               })
           }, [])
       
           if(isAuth === null) return <p>checking authentication</p>; */
        return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;


    }