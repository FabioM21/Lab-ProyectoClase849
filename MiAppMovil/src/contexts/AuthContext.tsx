import { createContext, useContext, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Alert } from "react-native";

//1. Tipado de objeto principal del contexto
type User = {
    token: string;
    email: string;
    pwd?: string;
} | null;

type AuthContextType = {
    user: User | null; 
    login: (email: string, password: string)=>  Promise<void>;
    logout: ()=> void;
}


//2. Creacion del contexto
const AuthContext = createContext<AuthContextType | null>(null);


//4. exposicion de contexto en forma de hook personalizdo 
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error ("useAuth debe usarse dentro de AuthProvider");
    return context;
}


//3. Crear el Provider: medio por el cual se maneja el estado global
export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    //inicializacion de estado con objeto y valores
    // const [user, setUser] = useState<User>({email:'mjsalinas@unitec.edu});

    //inicializacion de estado con objeto nulo(vacio)
    const [user, setUser] = useState<User>(null);

    const setUserSession = (data:any) => {
        const session = data.session; 

        if(session && session.user) {
            setUser({token: session.access_token,
            email: session.user.email,
            });
            //to-do guardar token en el almacenamiento del dispositivo
            
        }else {
            setUser(null);
        }
    }

    const login = async (email: string, password:string) => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        }); 
        
        if (error){
            Alert.alert("Error al iniciar sesion", error.message);
        }
        setUserSession(data);        
    }

    const logout = async () => {
       await supabase.auth.signOut();
       setUser(null);
    };
//to-do: implementar registro con supabase
    const register = (email:string, password:string) => {

    };
    
    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}
