import React /* ReactNode */ from "react";
import "../css/Card.css";

interface CardDataStatsProps {
  title: string;
  value: number;
  dataCadastro: string;
}

const Card: React.FC<CardDataStatsProps> = ({ title, value, dataCadastro }) => {
  return (
    <div className="h-card rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-end justify-between">
        <div>
          <div className="h-24">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              {value}
            </h4>
            <h5 className="mt-2 text-title-sm font-medium text-black dark:text-white">
              {dataCadastro}
            </h5>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
