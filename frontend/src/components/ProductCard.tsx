'use client'

import { useState } from 'react'
import Image from 'next/image'
import { RatingComponent } from './RatingComponent'
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ethers } from 'ethers'
import { votingAddress } from '@/config/wagmiConfig'
import votingAbi from '../abi/Voting.json'
import { useBlockNumber, useChainId } from 'wagmi'
import { useEthersProvider, useEthersSigner } from '@/utils/viemEthersConverters'

interface Product {
  id: number
  name: string
  price: number
  rating: number
  image: string
}

export default function ProductCard({ product }: { product: Product }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const { data: blockNumberData } = useBlockNumber({ watch: true })
  const chainId = useChainId()

  // Can we get a provider and signer please?
  const signer = useEthersSigner()
  // console.log('Signer:', signer)
  const provider = useEthersProvider()
  // console.log('Provider:', provider)

  // Create a contract instance
  const votingContract = new ethers.Contract(votingAddress, votingAbi['abi'], provider)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted rating:', rating)
    console.log('Submitted comment:', comment)
    console.log('Rated product ID:', product.id)
    setRating(rating)
    setComment(comment)
    const encryptedVote = await encrypt(selectedOption)
    console.log(encryptedVote);
    await votingContract.connect(signer).vote(encryptedVote)
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
        <div className="mt-2">
          <RatingComponent totalStars={5} initialRating={product.rating} readOnly />
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Rate</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate {product.name}</DialogTitle>
              <DialogDescription>Please provide your rating and feedback for this product</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="rating" className="text-sm font-medium text-gray-700">
                  Your Rating
                </label>
                <RatingComponent onChange={setRating} />
              </div>
              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                  Your Review
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
                Submit Rating
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

function encrypt(selectedOption: any) {
  throw new Error('Function not implemented.')
}
