import { createContext, useState , useEffect} from "react";

export const AuthContext = createContext();

const AuthProvider = ({children}) =>{
    const [user , setUser] =  useState(
        JSON.parse(localStorage.getItem("User"))  || null
    );

    useEffect(() => {
        try{
            localStorage.setItem("User",JSON.stringify(user))
        }catch(error){
            localStorage.removeItem("User");
        }
    }, [user])

    const contextValue = {
        user,
        login(User){
            setUser(User)
        },
        logout(){
            setUser(null)
        },
        isLogged(){
            return !! user;
        },
        typeUser(){
            return user.tipouser;
        }
    }
    return <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
}

export default AuthProvider ; 