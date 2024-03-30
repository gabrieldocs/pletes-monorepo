import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { useState } from "react"
import { auth } from "../../firebase/config"
import { useAuth } from "../auth"

export const useLogin = () => {
    const [error, setError] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const {dispatch} = useAuth()

    const provider = new GithubAuthProvider()

    const login = async () => {
        try {
            const res = await signInWithPopup(auth, provider)
        
            if(!res) {
                throw new Error("Could not complet signup")
            }

            const user = res.user 
            dispatch({type: "LOGIN", payload: user})
            console.log(user)
            setIsPending(false)
        } catch (error: any) {
            console.log(error)
            setError(error.message)
            setIsPending(false)
        }
    }

    return {login, error, isPending}
}