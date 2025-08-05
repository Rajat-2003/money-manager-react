import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard';
import UseUser from '../hooks/UseUser';
import { Plus } from 'lucide-react';
import CategoryList from '../components/CategoryList';
import axiosConfig from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import Modal from '../components/Modal';
import AddCategoryForm from '../components/AddCategoryForm';
import toast from 'react-hot-toast';

const Category = () => {
  UseUser();
  const [loading,setLoading]=useState(false);
  const [categoryData,setCategoryData]=useState(false);

  const [openAddCategoryModel, setOpenAddCategoryModel] = useState(false);

  const [openEditCategoryModel, setOpenEditCategoryModel] = useState(false);
 const [selectedCategory,setSelectedCategory]=useState(null);
  const fetchCategoryDetails=async()=>{
    if(loading) return;

    setLoading(true);

    try {
    const response =  await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
    if(response.status===200)
    {
      console.log(response.data);
      setCategoryData(response.data);

    }
      
    } catch (error) {
      console.error("semething went worng ");
      
    }finally{
      setLoading(false);
    }

  }


  useEffect(()=>{
    fetchCategoryDetails();

  },[])

  const handleAddCategory=async(category)=>{

    const {name,type,icon}=category;

    if(!name.trim())
    {
      toast.error("Category Name is required");
      return;
    }

    // check category already exist
    const isDuplicate =categoryData.some((category)=>{
     return  category.name.toLowerCase()===name.trim().toLowerCase();
    })

    if(isDuplicate)
    {
      toast.error("Category with this name already exist");
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
        name,
        type,
        icon,
      });
      if(response.status===201)
      {
        toast.success("Category added successfully");
        setOpenAddCategoryModel(false);
        fetchCategoryDetails();
      }
    } catch (error) {
      console.error('Error in adding category',error);
      toast.error(error.response?.data?.message || "Failed to add category");
      
      
    }
  }


  const handleEditCategory=(categoryToEdit)=>{

    setSelectedCategory(categoryToEdit);
    setOpenEditCategoryModel(true);
  }


  const handleUpdateCategory=async(updatedCategory)=>{
  const {id,name,type,icon}=updatedCategory;
  if(!name.trim())
  {
    toast.error("Category name is required");
    return;
  }

  if(!id)
  {
    toast.error("Category ID is missing for update");
    return ;
  }

  try {
  await  axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id),{name,type,icon})
    setOpenEditCategoryModel(false);
    setSelectedCategory(null);
    toast.success("Category added successfully");
    fetchCategoryDetails();


  } catch (error) {
    console.error("error updating the category");

    
  }
  
  }

  return (
    <Dashboard activeMenu="Category">
      <div className="my-5 mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">All categories</h2>

          <button
            onClick={() => setOpenAddCategoryModel(true)}
            className="add-btn flex items-center gap-1"
          >
            <Plus size={15} />
            Add category
          </button>
        </div>

        <CategoryList
          categories={categoryData}
          onEditCategory={handleEditCategory}
        />

        <Modal
          isOpen={openAddCategoryModel}
          onClose={() => setOpenAddCategoryModel(false)}
          title="Add category"
        >
          <AddCategoryForm onAddCategory={handleAddCategory} />
        </Modal>

        <Modal
         
          onClose={() => {
            setOpenEditCategoryModel(false);
            setSelectedCategory(null);
          }}
          isOpen={openEditCategoryModel}
          title="Update category"
        >
          <AddCategoryForm
          initialCategoryData={selectedCategory}
          onAddCategory={handleUpdateCategory}
          isEditing={true}
          />
        </Modal>
      </div>
    </Dashboard>
  );
}

export default Category;