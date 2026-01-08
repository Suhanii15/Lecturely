import { createContext, useState, useEffect} from "react";

export const AuthContext=createContext(null);

const AuthProvider=({children})=>{
      const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    try{
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken && savedUser !== "undefined") {
        setUser(savedUser);
        setToken(savedToken);


      }
    
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    }
  }, []);
const loginUser = (userData, token) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

  };

  
      
    return(
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>

    );
}


export default AuthProvider