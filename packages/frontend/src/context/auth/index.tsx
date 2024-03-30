import { createContext, useContext, useEffect, useReducer } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

export const AuthContext = createContext<any>(null)

export const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        case "AUTH_IS_READY":
            return { ...state, user: action.payload, authIsReady: true };
        default:
            return state;
    }
};


export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch({ type: "AUTH_IS_READY", payload: user });
          });
          return unsubscribe;
    },[])

    return (<AuthContext.Provider value={{ ...state, dispatch }}>
        {children}
    </AuthContext.Provider>)
}

export const useAuth = () => {
    return useContext(AuthContext)
}