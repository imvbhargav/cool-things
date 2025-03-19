"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "./ModalLayout";
import { useModalTransitionShow } from "@/store/modal";

type Status = {
  message: string;
  success: boolean | null;
}

function NewCategoryModal({isOpen, onClose}: Readonly<{isOpen: boolean, onClose: () => void}>) {

const { setShow } = useModalTransitionShow();

  const [ category, setCategory ] = useState("");
  const [ status, setStatus ] = useState<Status>({message: '', success: null});

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const toPascalCase = (str: string) => (
    str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
  )

  const validateCategoryName = (value: string) => {
    if (/^[A-Za-z]+$/.test(value)) setCategory(toPascalCase(value));
    if (value === "") setCategory("");
  }

  const handleModalClose = useCallback(() => {
    setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        setShow(true);
        onClose();
      }, 200);
    }, 1000)
  }, [setShow, onClose])

  const handleSubmit = async () => {
    if (category.split('').length < 3) {
      setStatus({ message: "Category name should be min 3 character long.", success: false });
      return;
    }

    const response = await fetch('api/seller/category/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: category
      })
    });

    if (!response.ok) {
      if (response.status == 409) {
        setStatus({ message: "Category already exists", success: false });
        return;
      }
      setStatus({ message: "Category creation failed, try again!", success: false });
      return;
    };
    setStatus({message: "Category created successfully", success: true});

    // Close the modal after 1 secons if category creation is success.
    handleModalClose();
  }

  useEffect(() => {
    setStatus({message: 'Create new category', success: null});
  }, [isOpen]);

  const statusDisplayColor = status?.success ? 'bg-green-800' : 'bg-red-800' ;

  return (
    <Modal title="New Category" onClose={handleClose} isOpen={isOpen} width="md:w-1/3">
      <div>
        <p className={`text-center rounded-md mb-2 p-2 ${(status.success != null ? statusDisplayColor : "bg-slate-800")}`}>{status.message}</p>
        <input id="category" placeholder="Enter category name..."
          value={category} onChange={(e) => validateCategoryName(e.target.value)}
          className="w-full p-2 min-h-12 bg-zinc-800 border rounded-md border-blue-600 focus:border-blue-800 active:border-blue-800 outline-none"
          autoComplete="off"
        />
        <button
          className="text-center bg-green-600 hover:bg-green-800 w-full rounded-md mt-2 p-2"
          onClick={() => handleSubmit()}
        >
          Create
        </button>
      </div>
    </Modal>
  );
}

export default NewCategoryModal;