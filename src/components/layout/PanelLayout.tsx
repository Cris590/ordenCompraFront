
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { TopMenu } from "../ui/top-menu/TopMenu";
import { Sidebar } from "../ui/sidebar/Sidebar";
import { Footer } from "../ui/footer/Footer";
import { useUserStore } from "../../store/user/user";


export const PanelLayout =() => {
  const [loading, setLoading] = useState(true);
  const session = useUserStore.getState().user;
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
    
      if (session?.cod_usuario) {
        setLoading(false);
      } else {
        navigate('/auth/login');
      }

    };

    checkSession();
  }, [session]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      
      <TopMenu />
      <Sidebar />
      <div className=" h-100 h-screen w-auto relative right-[-50px] mr-auto overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}