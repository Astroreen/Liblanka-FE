import React from 'react';
import {useAuthContext} from "../contexts/AuthContext";
import {Navigate} from "react-router-dom";
import {RoutePath} from "./RoutePath";

type Props = {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({children}) => {
    const {isAuthenticated} = useAuthContext();

    return isAuthenticated() ? children : <Navigate to={RoutePath.HOME} replace={true}/>;
}

export default ProtectedRoute;