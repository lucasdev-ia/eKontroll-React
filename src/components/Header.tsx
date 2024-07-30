import React from "react";
import DarkModeSwitcher from "./DarkModeSwitcher";
import logoPadrao from "../images/logo_padrao.png";
import logoDark from "../images/logo_dark.png";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="header-logo dark:hidden">
          <img src={logoPadrao} className="h-24 w-36 cursor-pointer" onClick={() => navigate('/')} /> 
        </div>
        <div className="header-logo hidden dark:inline-block">
          <img src={logoDark} className="h-24 w-36 cursor-pointer" onClick={() => navigate('/')} />
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
