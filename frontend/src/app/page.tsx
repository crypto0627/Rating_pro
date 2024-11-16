'use client'
import React, { useState } from 'react'
import { useBlockNumber, useChainId } from 'wagmi'
import { useEthersProvider, useEthersSigner } from '../utils/viemEthersConverters' // Adjust the import path as needed
import Banner from '../components/Banner'
import StoreInfo from '../components/StoreInfo'
import ProductCard from '../components/ProductCard'
import Navbar from '@/components/Navbar'

const products = [
  { id: 1, name: 'Smart Watch', price: 100, rating: 4.5, image: '/smart_watch.jpeg' },
  { id: 2, name: 'Wireless Earbuds', price: 9, rating: 4.2, image: '/earbuds.jpeg' },
  { id: 3, name: 'Laptop', price: 999, rating: 4.8, image: '/laptop.jpeg' },
  { id: 4, name: 'Smart Speaker', price: 49, rating: 3.9, image: '/smart_speaker.jpeg' },
]

//// START OF THE COMPONENT ////
export default function LandingPage() {
  return (
      <main className='flex flex-col '>
        <div className="flex flex-col min-h-screen p-10">
        <Navbar />
        <div className='items-center justify-center'>
          <Banner text="Welcome to our Product Rating System" />
          <div className="flex-grow p-6">
            <div className="flex justify-between items-center mb-6">
              <StoreInfo />
            </div>
            <h2 className="text-2xl font-bold mb-6">Product List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
        </div>
      </main>
  )
}
