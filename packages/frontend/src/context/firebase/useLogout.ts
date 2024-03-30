import { signOut } from "firebase/auth"
import { auth } from "../../firebase/config"
import { useAuth } from "../auth"

export const useLogout = () => {
    const {dispatch} = useAuth();
    const logout = async () => {
        try {
            await signOut(auth)
            dispatch({type: "LOGOUT"})
            console.log("User logged out")
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return { logout }
}