import React, { useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar";
import { Items } from "../Components/Items";
import { auth } from "../firebaseConfig";

export const Home = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ nome: "", email: "" });
  const [selectedList, setSelectedList] = useState(null); 

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        nome: user.displayName || "Usuário",
        email: user.email,
      });
    }
  }, []);

  return (
    <div className='h-screen bg-gray-100 flex flex-row'>
      <Navbar 
        sidebar={navbarOpen} 
        setSidebar={setNavbarOpen} 
        userInfo={userInfo} 
        setSelectedList={setSelectedList} 
      />
      <div className={`flex-grow transition-all duration-300 ${navbarOpen ? 'w-4/5' : 'w-full'}`}>
        <Items 
          selectedList={selectedList}
          setSelectedList={setSelectedList} 
        />
      </div>
    </div>
  );
}
