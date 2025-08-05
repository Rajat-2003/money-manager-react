import { Download, LoaderCircle, Mail } from 'lucide-react';
import React, { useState } from 'react'
import TransactionInfoCard from './TransactionInfoCard';
import moment from 'moment';

const IncomeList = ({transactions,onDelete,onDownload,onEmail}) => {
 const [loading,setLoading]=useState(false);
 const handleEmail=async()=>{
  setLoading(true)
  try{

    await onEmail();
  }finally{
    setLoading(false)
  }
 }

 const handleDownload = async () => {
   setLoading(true);
   try {
    await onDownload();
   } finally {
     setLoading(false);
   }
 };
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income sources </h5>
        <div className="flex items-center justify-end gap-4">
          <button disabled={loading} onClick={handleEmail} className="card-btn">
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Emailing...
              </>
            ) : (
              <>
                <Mail size={15} className="text-base" />
                Email
              </>
            )}
          </button>

          <button
            disabled={loading}
            onClick={handleDownload}
            className="card-btn"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download size={15} className="text-base" />
                Download
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income.id}
            title={income.name}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default IncomeList;