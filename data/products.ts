import { ProductInfo } from "@/types/product";

const Items: { products: ProductInfo[] } = {
  products: [
    {
      id: "1",
      imageLink: "https://images.unsplash.com/photo-1660820936280-bd9c483eb54b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Apple Pencil",
      description: "An elegant pencil to write on your iPad, or iPhone.",
      price: 4999,
      quantity: 100,
      offer: 0,
      minorder: 0,
      minonoffer: false
    },
    {
      id: "2",
      imageLink: "https://m.media-amazon.com/images/I/61q7ZApbQEL._SL1280_.jpg",
      name: "Moon Light",
      description: "An elegant ligting to keep on your desk, or anywhere you like.",
      price: 339,
      quantity: 100,
      offer: 0,
      minorder: 0,
      minonoffer: false
    },
    {
      id: "3",
      imageLink: "https://m.media-amazon.com/images/I/71bk6wVCK7L._SL1500_.jpg",
      name: "12-in-1 tools.",
      description: "A tool that can be used to do any sort of your work.",
      price: 839,
      quantity: 100,
      offer: 0,
      minorder: 0,
      minonoffer: false
    }
  ]
}

export default Items;