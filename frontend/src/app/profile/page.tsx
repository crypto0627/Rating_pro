'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RatingComponent } from '../../components/RatingComponent'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import Navbar from '@/components/Navbar'

// Mock user data
const user = {
  name: "Alice Johnson",
  email: "alice@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  overallRating: 4.2,
  totalReviews: 15
}

// Mock review data
const reviews = [
  { id: 1, productName: "Smart Watch", rating: 4, comment: "Great product, very useful!", date: "2023-05-15" },
  { id: 2, productName: "Wireless Earbuds", rating: 5, comment: "Excellent sound quality!", date: "2023-06-02" },
  { id: 3, productName: "Laptop", rating: 3, comment: "Good, but battery life could be better.", date: "2023-06-20" },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-4">
        <Navbar/>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <RatingComponent totalStars={5} initialRating={user.overallRating} readOnly />
            <span className="text-sm text-gray-500">({user.overallRating} out of 5)</span>
          </div>
          <Progress value={user.overallRating * 20} className="w-full" />
          <p className="mt-2 text-sm text-gray-500">Based on {user.totalReviews} reviews</p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Your Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center mb-2">
                  <span className="w-8 text-sm">{star} star</span>
                  <Progress value={Math.random() * 100} className="w-full mx-2" />
                  <span className="w-8 text-sm text-right">{Math.floor(Math.random() * 100)}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Your Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.map((review) => (
                <div key={review.id} className="mb-4 pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{review.productName}</h3>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <RatingComponent totalStars={5} initialRating={review.rating} readOnly />
                  <p className="mt-2 text-sm">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CardFooter className="mt-8">
        <Link href="/" passHref>
          <Button variant="outline">Back to Products</Button>
        </Link>
      </CardFooter>
    </div>
  )
}