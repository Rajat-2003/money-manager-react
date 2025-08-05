import { Pencil } from 'lucide-react';
import React from 'react'

const CategoryList = ({categories,onEditCategory}) => {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Category sources</h4>
      </div>

      {Array.isArray(categories) && categories.length === 0 ? (
        <p className="text-gray-500">No categories added add to get started</p>
      ) : (
        <div className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.isArray(categories) &&
            categories.map((category) => (
              <div
                key={category.id}
                className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/60"
              >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-gray-100">
                  {category.icon ? (
                    <span className="text-2xl">
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="h-5 w-5"
                      />
                    </span>
                  ) : (
                    <Pencil className="text-primary" size={24} />
                  )}
                </div>

                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-md">
                      {category.name}
                    </p>

                    <p className="text-sm text-gray-400 font-md">
                      {category.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                    onClick={()=>onEditCategory(category)}
                    className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Pencil size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default CategoryList;