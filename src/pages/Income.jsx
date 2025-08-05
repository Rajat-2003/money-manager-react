import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard.jsx';
import UseUser from "../hooks/UseUser.jsx";
import axiosConfig from '../util/axiosConfig.js';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import toast from 'react-hot-toast';
import IncomeList from '../components/IncomeList.jsx';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import AddIncomeForm from '../components/AddIncomeForm.jsx';
import { data } from 'react-router-dom';
import DeleteAlert from '../components/DeleteAlert.jsx';
import IncomeOverview from '../components/IncomeOverview.jsx';

const Income = () => {
  UseUser();
 
  const [incomeData,setIncomeData]=useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(
    {
      show:false,
      data:null,
    }
  );

  const fetchIncomeDetails=async()=>{
    if(loading) return;

    setLoading(true);

    try {
     const response= await  axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
    if(response.status===200)
    {
      console.log("income listy",response.data)
      setIncomeData(response.data);
    }

    } catch (error){
      console.error("Failed to fetch income details")
      toast.error("Failed to fetch income details")
    
      
    }
    finally{
      setLoading(false);
    }
  }

  const fetchIncomeCategories=async()=>{
    try {
      const response =await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
      if(response.status===200)
      {
        console.log("income categories ",response.data)
        setCategories(response.data)
      }
    } catch (error) {
      console.log("Failed to fetch income categories")
      toast.error("Failed to fetch income categories for this category")
    }
  }

  const handleAddIncome =async(income)=>{
    const {name,amount,date,icon,categoryId}=income;

    if(!name.trim())
    {
      toast.error("Please enter a name");
      return ;
    }
     if (!amount || isNaN(amount)|| Number(amount)<=0) {

       toast.error("Amount should be a valid number greater than 0");

       return;
     }

     if(!date)
     {
      toast.error("Please select a date");
      return;
     }
     const today =new Date().toISOString().split('T')[0];
     if(date>today)
     {
      toast.error("Date cant be in the future")
      return;
     }

     if(!categoryId)
     {
      toast.error("Please select a category")
      return;
     }

     try {
      const response  = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME,{
        name,
        amount:Number(amount),
        date,
        icon,
        categoryId
      })

      if(response.status===201)
      {
        setOpenAddIncomeModal(false)
        toast.success("Income added successfully")
        fetchIncomeDetails();
        fetchIncomeCategories();
      }
      
     } catch (error) {

      console.log("Error adding income")
      toast.error("Error in adding income")
      
     }
  }

  const deleteIncome=async(id)=>{
    
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
      setOpenDeleteAlert({show:false,data:null})
      toast.success("Income deleted successfully")
      fetchIncomeDetails();
    } catch (error) {
      toast.error("Failed to delete income")
      
    }

  }

  const handleDownloadIncomeDetails = async() => {
    try {
                    console.log(
                      "Auth token:",
                      localStorage.getItem("token") ||
                        sessionStorage.getItem("token")
                    );

              const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, {responseType: "blob"});
              let filename = "income_details.xlsx";
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", filename);
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
              window.URL.revokeObjectURL(url);
              toast.success("Download income details successfully");
          }catch(error) {
              console.error('Error downloading income details:', error);
              toast.error(error.response?.data?.message || "Failed to download income");
          }
      }
  
      const handleEmailIncomeDetails = async () => {
          try {
              const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
              if (response.status === 200) {
                  toast.success("Income details emailed successfully");
              }
          }catch(error) {
              console.error('Error emailing income details:', error);
              toast.error(error.response?.data?.message || "Failed to email income");
          }
      };

      

  useEffect(()=>{
    fetchIncomeDetails();
    fetchIncomeCategories();
  },[])



  
  
  return (
    <Dashboard activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>


            
            <IncomeOverview
            transactions={incomeData}
            onAddIncome={()=>setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList

            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({show:true,data:id})}
            onDownload={handleDownloadIncomeDetails}
            onEmail={handleEmailIncomeDetails}
          />

          

          <Modal
            isOpen={openAddIncomeModal}
            onClose={() => setOpenAddIncomeModal(false)}
            title="Add Income"
          >
            <AddIncomeForm
            onAddIncome={(income)=>handleAddIncome(income)}
            categories={categories}
            />
          </Modal>

          <Modal
          isOpen={openDeleteAlert.show}
          onClose={()=>setOpenDeleteAlert({show:false,data:null})}
          title="Delete income"
          >
          
          <DeleteAlert 
          content="Are you sure you want to delete this income details?"
          onDelete={()=>deleteIncome(openDeleteAlert.data)}
          />

          </Modal>
        </div>
      </div>
    </Dashboard>
  );
}

export default Income;