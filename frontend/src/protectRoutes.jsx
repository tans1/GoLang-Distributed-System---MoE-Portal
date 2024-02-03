import React from 'react'
import { useLocation } from "react-router";
import { Outlet, Navigate } from 'react-router-dom'

export default function ProtectRoutes() {
    const auth = false;

    // const location = useLocation();
    return(
        auth ? <Outlet/> : <Navigate to="/login" replace  />
    )
}
