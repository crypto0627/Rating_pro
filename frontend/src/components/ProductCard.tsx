'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"
import { ethers } from 'ethers'
import { votingAddress } from '@/config/wagmiConfig'
import votingAbi from '../abi/Voting.json'
import { useBlockNumber, useChainId } from 'wagmi'
import { useEthersProvider, useEthersSigner } from '@/utils/viemEthersConverters'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

interface Product {
  id: number
  name: string
  price: number
  rating: number
  image: string
}

export default function ProductCard({ product }: { product: Product }) {
  const [comment, setComment] = useState('')
  const [quantity, setQuantity] = useState(0)

  const { data: blockNumberData } = useBlockNumber({ watch: true })
  const chainId = useChainId()

  // Can we get a provider and signer please?
  const signer = useEthersSigner()
  const provider = useEthersProvider()

  // Create a contract instance
  const votingContract = new ethers.Contract(votingAddress, votingAbi['abi'], provider)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted quantity:', quantity)
    console.log('Submitted comment:', comment)
    //call the purchaseProduct function with sending ether
    await votingContract.connect(signer).purchaseProduct(product.id, quantity, { value: quantity * product.price })
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>Price: ${product.price}</CardDescription>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Purchase</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle> {product.name}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  How many would you like to purchase?
                </label>
                <Input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                  Please share your experience...
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Please share your experience..."
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Purchase
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
