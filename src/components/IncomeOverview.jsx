import React, { useEffect, useState } from 'react'
import { prepareIncomeLineChartData } from '../util/util';
import CustomLineChart from './CustomLineChart';
import { Plus } from 'lucide-react';

const IncomeOverview = ({transactions,onAddIncome}) => {

    const [chartData,setChartData]=useState([]);
    useEffect(()=>{
    console.log("Raw transactions passed:", transactions);

      const result =  prepareIncomeLineChartData(transactions);
      console.log("chart data",result);
      setChartData(result);

      return ()=>{};
    },[transactions]);
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-0 5">
            TRack your earninsgs overtime and analyze your income trends
          </p>
        </div>
        <button
                      onClick={onAddIncome}
                      className="add-btn"
                    >
                      <Plus size={15} className="text-lg" />
                      Add Income
                    </button>
      </div>

      <div className="mt-10">

        <CustomLineChart  data={chartData}/>
      </div>
    </div>
  );
}

export default IncomeOverview;