"use client";

import { useCallback, useEffect, useState } from "react";
import NewProductEdit from "./NewProductEdit";
import SellerProducts from "./SellerProducts";
import { Category, Product } from "@prisma/client";
import Logout from "./LogoutButton";
import { useUserAuthStore } from "@/store/auth";
import NewCategoryModal from "./NewCategoryModal";

function SellerDashboard({sellerProducts, categories}: Readonly<{sellerProducts: Product[], categories: Category[]}>) {

  const [ items, setItems ] = useState<Product[]>(sellerProducts);
  const [ newProduct, setNewProduct ] = useState<boolean>(false);
  const [ newCategory, setNewCategory ] = useState<boolean>(false);
  const [ itemToEdit, setItemToEdit ] = useState<Product | null>(null);

  const user = useUserAuthStore(state => state.user);

  const editItem = (item: Product | null) => {
    if (item) {
      setItemToEdit(item);
    } else {
      setItemToEdit(null);
    }
    setNewProduct(!newProduct);
  }

  const handleClose = useCallback(() => {
    setNewCategory(false);
  }, [setNewCategory])

  const getProducts = useCallback(async () => {
    try {
      const response = await fetch(`/api/seller/products/get?sellerId=${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        setItems(result.products);
      }
    } catch (e) {
      console.error("Network error:", e);
      alert("An error occurred while fetching products. Please try again.");
    }
  }, [setItems, user?.id])

  useEffect(() => {
    if (user)
      getProducts();
  }, [user, getProducts]);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-auto p-5 bg-zinc-900 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl mb-5 border-b-2 border-zinc-800 w-full text-center">Seller Dashboard</h1>
          <p className="text-center mb-5 text-2xl"><a className="text-blue-500 hover:text-pink-500 p-2" href="/seller/sales">View sales</a></p>
          <button onClick={() => editItem(null)} type="button" className={`w-full py-2 px-6 text-2xl ${newProduct ? "bg-green-800" : ""} border-2 border-green-800 rounded-xl disabled:bg-slate-700 disabled:border-slate-700 hover:bg-green-800 transition-colors duration-300`} disabled={newProduct}>New Product</button>
          <button onClick={() => setNewCategory(!newCategory)} type="button" className={`w-full py-2 px-6 text-2xl ${newCategory ? "bg-blue-800" : ""} border-2 border-blue-800 rounded-xl disabled:bg-slate-700 disabled:border-slate-700 hover:bg-blue-800 transition-colors duration-300`} disabled={newCategory}>New Category</button>
        </div>
        <div className="w-full relative">
          <p className="text-center">{user?.username}</p>
          <div className="w-full border-2 border-red-500 hover:bg-red-500 transition-colors duration-300 rounded-xl text-center"><Logout /></div>
          <p className="text-center py-2 rounded-xl">
            <a href={`${process.env.BASE_URL}`} className="w-full h-full p-1">Back to Home</a>
          </p>
        </div>
      </div>
      {
        newProduct
        && <NewProductEdit
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            itemToEdit={itemToEdit}
            items={items}
            setItems={setItems}
            categories={categories}
          />
      }
      {
        newCategory
        && <NewCategoryModal
            isOpen={newCategory}
            onClose={handleClose}
           />
      }
      <SellerProducts items={items} editItem={editItem} newProduct={newProduct} />
    </div>
  );
}

export default SellerDashboard;