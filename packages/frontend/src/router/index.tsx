import { createBrowserRouter } from "react-router-dom"
import Home from "../modules/Home"
import Intro from "../modules/Intro"
import Dashboard from "../modules/Dashboard"

export const router = createBrowserRouter([
    {
        path: '/teste',
        element: <Intro />
    },
    {
        path: '/home',
        element: <Home /> 
    },
    {
        path: '/',
        element: <Home />
    }
])
