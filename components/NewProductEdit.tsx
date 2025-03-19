"use client";

import { Category, Product } from "@prisma/client";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { User, useUserAuthStore } from "@/store/auth";
import Modal from "./ModalLayout";
import { useLoadingStore } from "@/store/loading";

type ProductInfo = {
  id: string;
  name: string;
  desc: string;
  fullinfo: string;
  cateName: string;
  price: string;
  stock: number;
  offer: string;
  minQty: number;
  tac: boolean;
  sellerId: string;
};

const getEmptyProduct = (item: Product | null, user: User | null) => {
  if (item) {
    return {
      id: item.id,
      name: item.name,
      desc: item.desc,
      fullinfo: item.fullinfo,
      cateName: item.cateName,
      price: item.price,
      stock: item.stock,
      offer: item.offer,
      minQty: item.minQty,
      tac: true,
      sellerId: user?.id,
    }
  } else {
    return {
      id: "0",
      name: "",
      desc: "",
      fullinfo: "",
      cateName: "",
      price: '0.00',
      stock: 0,
      offer: '0.00',
      minQty: 0,
      tac: false,
      sellerId: user?.id,
    }
  }
}

function NewProductEdit({itemToEdit, newProduct, setNewProduct, items, setItems, categories}: Readonly<{itemToEdit: Product | null, newProduct: boolean, setNewProduct: React.Dispatch<React.SetStateAction<boolean>>, items: Product[], setItems: React.Dispatch<React.SetStateAction<Product[]>>, categories: Category[]}>) {

  const imageInputRef = useRef<HTMLInputElement>(null);

  const user = useUserAuthStore(state => state.user);
  const { loading, setLoading } = useLoadingStore();

  const [ product, setProduct ] = useState(getEmptyProduct(itemToEdit, user));
  const [selectedImage, setSelectedImage] = useState<string | null>(itemToEdit?.image ?? null);

  const uploadImage = async (file: string) => {
    const response = await fetch('api/seller/products/image/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file,
        productId: product?.id??null,
        oldImage: itemToEdit?.image??null,
      })
    });

    if (!response.ok) {
      alert("Image upload failed!");
    }

    const data = await response.json();

    return data.url;
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);

    const requiredFields: (keyof ProductInfo)[] = ['name', 'desc', 'cateName', 'price', 'stock', 'tac'];

    if (requiredFields.some(field => !product[field])) {
      alert("Please fill all the required fields.");
      return;
    }

    const imageUrl = selectedImage ? await uploadImage(selectedImage) : "";

    console.log("Adding image: ", imageUrl);

    try {
      const response = await fetch("/api/seller/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...product, image: imageUrl}),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Product added successfully!");

        // Reset form
        setProduct(getEmptyProduct(null, user));

        setNewProduct(false);

        // Update the upserted item.
        updateItems(result.product);
      } else {
        console.error("Error adding product:", result.error);
        alert(`Error: ${result.error}`);
      }
      setLoading(false);
    } catch (error) {
      console.error("Network error:", error);
      alert("An error occurred while adding the product. Please try again.");
    }
  };

  const handleFloatChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const changedFloat = parseFloat(value);

    function hasMoreThanTwoDecimalPlaces(num: number) {
      if (!Number.isFinite(num)) return false; // Ensure it's a finite number
      const decimalPart = num.toString().split('.')[1]; // Get the part after the decimal
      return decimalPart && decimalPart.length > 1; // Check if decimal part exists and its length
    }

    if (!isNaN(changedFloat)) {
      const floatValue =  hasMoreThanTwoDecimalPlaces(changedFloat)
                          ? changedFloat.toFixed(2)
                          : changedFloat.toString();

      if (e.target.name == 'offer' && parseFloat(floatValue) > 100) {
        return;
      }

      setProduct({
        ...product,
        [e.target.name]: floatValue,
      });
    } else {
      setProduct({
        ...product,
        [e.target.name]: '',
      });
    }
  }

  const handleProductChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  }

  const updateItems = (upsertedProduct: Product) => {
    if (itemToEdit) {
      const oldItems = items.filter(item => item.id != itemToEdit.id);
      setItems([...oldItems, upsertedProduct]);
    } else {
      setItems([...items, upsertedProduct]);
    }
  }

  const closeNewProductEdit = useCallback(() => {
    setNewProduct(false);
  }, [setNewProduct])

  const inputStyles = "text-xl p-4 bg-black rounded-xl border-2 border-white";
  return(
    <Modal
      width='sm:w-full'
      title={itemToEdit ? "Update Product" : "Add Product"}
      onClose={closeNewProductEdit}
      isOpen={newProduct}
    >
        <div className="relative w-full max-w-5xl bg-zinc-900 rounded-xl overflow-auto max-h-[75vh] no-scrollbar">
          <div className="flex flex-col items-center gap-2 max-w-5xl m-auto overflow-hidden">
            <div className="flex flex-col md:flex-row w-full mt-10 justify-center gap-2">
              <div className="flex flex-col bg-slate-950 rounded-xl p-6 min-w-60 justify-between">
                <h1 className="text-center text-2xl">Product Image</h1>
                <button
                  className={`w-full aspect-video rounded-xl ${
                    selectedImage ? "" : "bg-blue-500/10 border-dashed border-blue-500"
                  } border-2 bg-cover`}
                  style={{ backgroundImage: `url(${selectedImage})` }}
                  onClick={() => imageInputRef?.current?.click()}
                >
                  {selectedImage ? "Replace image" : "Upload image"}
                </button>
                <input
                  ref={imageInputRef}
                  className="hidden"
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <p className="text-center">{selectedImage ? "Image selected" : "No file selected"}</p>
              </div>
              <div className="w-full p-6 bg-black rounded-xl border-2 border-zinc-800">
                <h1 className="text-center text-2xl">General details</h1>
                <div className="flex flex-col md:flex-row w-full gap-2">
                  <div className="flex flex-col w-full md:w-2/3">
                    <label htmlFor="pname" >Product Name</label>
                    <input id="pname" name="name" className={inputStyles} type="name" placeholder="Product name" autoComplete="off" value={product.name} onChange={handleProductChange} />
                  </div>
                  <div className="flex flex-col w-full md:w-1/3">
                    <label htmlFor="cateName">Product category</label>
                    <select name="cateName" className={inputStyles} id="cateName" autoComplete="off" value={product.cateName} onChange={handleProductChange}>
                      <option value="">
                          Select
                        </option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col w-full ">
                  <label htmlFor="pname" >Product Description</label>
                  <input id="pname" name="desc" className={inputStyles} type="name" placeholder="Product description" autoComplete="off" value={product.desc} onChange={handleProductChange} />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full justify-center gap-2">
              <div className="w-full p-6 bg-black rounded-xl border-2 border-zinc-800">
                <h1 className="text-2xl text-center">Price and Stock details</h1>
                <div className="flex flex-col w-full ">
                  <label htmlFor="pname" >Product Price</label>
                  <span className="flex items-center text-xl bg-black rounded-xl border-2 border-white">
                    <input className="text-xl p-4 bg-black rounded-xl w-full focus:border-none focus:outline-none" id="pname" name="price" type="number" placeholder="Product price" autoComplete="off" value={product.price} onChange={(e) => handleFloatChange(e)} />
                    <strong className="px-4 border-l-2 border-zinc-800">&#8377;</strong>
                  </span>
                  <label htmlFor="pname" >Product quantity in stock</label>
                  <input id="pname" name="stock" className={inputStyles} type="number" placeholder="Product quantity in stock" autoComplete="off" value={product.stock} onChange={handleProductChange} />
                </div>
              </div>
              <div className="flex flex-col bg-slate-950 rounded-xl p-6">
                <h1 className="text-2xl text-center">Offer details</h1>
                <div className="flex flex-col w-full ">
                  <label htmlFor="pname" >Offer %</label>
                  <input id="pname" name="offer" className={inputStyles} type="number" min={0} max={100} placeholder="Offer %" autoComplete="off" value={product.offer} onChange={(e) => handleFloatChange(e)} />
                  <label htmlFor="pname" >Min. Quantity for offer</label>
                  <input id="pname" name="minQty" className={inputStyles} type="number" inputMode="decimal" placeholder="Min. Qty for offer" autoComplete="off" value={product.minQty} onChange={handleProductChange} />
                </div>
              </div>
            </div>
            <div className="w-full px-2 bg-black rounded-xl">
              <h1 className="text-2xl text-center py-4">Additional Information</h1>
              <textarea name="fullinfo" value={product.fullinfo} rows={10} className="resize-none w-full bg-zinc-900 p-2 rounded-xl border-2 border-zinc-300 focus:outline-none focus:border-zinc-200" placeholder="Describe more about your product here..." onChange={handleProductChange}>

              </textarea>
            </div>
            <div className="flex flex-col md:flex-row w-full justify-between gap-2 ">
              <div className="flex items-center rounded-xl p-4">
                <input className="mr-2" name="tac" type="checkbox" id="tac" required autoComplete="off" checked={product.tac} onChange={handleProductChange} />
                <label htmlFor="tac">Check this for agreeing to our Terms and Conditions.</label>
              </div>
              <div className="flex rounded-xl gap-2 justify-end md:justify-normal">
                <button
                  className="hover:bg-green-500 border-2 border-green-500 bg-black h-full rounded-xl py-2 px-6 transition-colors duration-300 disabled:bg-zinc-800 disabled:border-zinc-800"
                  onClick={handleAddProduct}
                  disabled={loading}
                >
                  { loading
                    ? itemToEdit ? "Updating..." : "Adding..."
                    : itemToEdit ? "Update" : "Add"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
    </Modal>
  );
}

export default NewProductEdit;