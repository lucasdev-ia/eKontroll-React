import React /* ReactNode */ from "react";
import "../css/Card.css";
import Cardimg from "../images/cliente.png";/*IMAGEM*/
import BolinhaPiscando from "./GreenCircle.tsx";
interface CardDataStatsProps {
  title: string;
  value: number | string;
  dataCadastro: string | null;
  Cardimg: string;
  online: any;
}

const Card: React.FC<CardDataStatsProps> = ({ title, value, dataCadastro,Cardimg, online }) => {
  
  return (
    <div className="h-cardnew w-cardnew rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
    
     
      <div className="flex items-end justify-between">
      <img className="h-22 w-22" src={Cardimg}/>
        <div>
          <div className="h-24 w-40">
            
              <h4 className="text-xl	font-semibold text-black dark:text-white ml-7.5 mt-3">
                {value}
              </h4>
             
            
            <div className="mt-2 ml-8 w-39 h-18">
              <div className="flex items-end justify-between">
                <span className="flex-auto text-sm font-medium">{title}</span>
                <div className="flex-auto">
              <BolinhaPiscando Bolinha={online}/>
                </div>
              </div>
            </div>
            <h5 className="mt-2 text-title-sm font-medium text-black dark:text-white">
              {dataCadastro}
            </h5>
          </div>
          
        </div>
      </div>
    </div>
    
  );
};

export default Card;
