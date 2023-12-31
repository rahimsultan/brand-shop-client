import { Heart, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';


export function CartPage() {

  const {user}= useAuth()

  const userEmail = user.email;

  const data = useLoaderData()
  const [products, setProducts] = useState([])

  useEffect(()=>{
    const fil = data.filter(d=> d.email === userEmail)
    setProducts(fil)
  },[])


  const handleDelete =(id)=>{

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://assignment-server-sigma.vercel.app/cart/products/${id}`,{
      method:"DELETE",
    })
    .then(res=>res.json())
    .then(data=>{
      // console.log(data);
      if(data.deletedCount >0){
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        const remaining = products.filter(product=> product._id !== id)
        setProducts(remaining)
      }
    })
        
      }
    })
  }
  // console.log(products);
  return (
    <div className="mx-auto flex max-w-3xl flex-col space-y-4 p-6 px-2 sm:p-10 sm:px-2">
      <h2 className="text-3xl font-bold">Your cart</h2>
      {
        products.length !== 0 ?
      
      <ul className="flex flex-col divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product._id} className="flex flex-col py-6 sm:flex-row sm:justify-between">
            <div className="flex w-full space-x-2 sm:space-x-4 items-center">
              <img
                className="h-20 w-20 flex-shrink-0 rounded object-contain outline-none dark:border-transparent sm:h-32 sm:w-32"
                src={product.product.photo}
                alt={product.product.title}
              />
              <div className="flex w-full flex-col gap-4 pb-4">
                <div className="flex w-full justify-between space-x-2 pb-2">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold leading-snug sm:pr-8">{product.product.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">${product.product.price}</p>
                  </div>
                </div>
                <div className="flex divide-x text-sm">
                  <button onClick={()=>handleDelete(product._id)} type="button" className="flex items-center space-x-2 px-2 py-1 pl-0">
                    <Trash size={16} />
                    <span>Remove</span>
                  </button>
                  <button type="button" className="flex items-center space-x-2 px-2 py-1">
                    <Heart size={16} />
                    <span>Add to favorites</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul> : <h2 className='text-center text-4xl font-bold my-5 md:my-8'>Opps!!! Your Cart Is Empty</h2>
      }
      <div className="space-y-1 text-right">
        <p>
          Total amount:
          <span className="font-semibold"> ${products.reduce((prev, next)=> prev + parseFloat(next.product.price),0).toFixed(2)}</span>
        </p>
      </div>
      <div className="flex justify-end space-x-4">
        <Link to={'/'}>
        <button
          type="button"
          className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Back to shop
        </button>
        </Link>
        <button
          type="button"
          className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}

export default CartPage;