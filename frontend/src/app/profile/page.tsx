"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FhenixClient } from "fhenixjs";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";

import { RatingComponent } from "../../components/RatingComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";
import votingAbi from "../../abi/Voting.json";
import { votingAddress } from "@/config/wagmiConfig";
import {
  useEthersProvider,
  useEthersSigner,
} from "@/utils/viemEthersConverters";
// Mock user data
const user = {
  name: "Alice Johnson",
  email: "alice@example.com",
  overallRating: 4.2,
  totalReviews: 15,
};

// Mock review data
const reviews = [
  {
    id: 1,
    productName: "TechGadgets Store",
    rating: 4,
    comment: "Great product, very useful!",
    date: "2023-05-15",
    weight: 10,
  },
  {
    id: 2,
    productName: "TechGadgets Store",
    rating: 5,
    comment: "Excellent sound quality!",
    date: "2023-06-02",
    weight: 200,
  },
  {
    id: 3,
    productName: "TechGadgets Store",
    rating: 3,
    comment: "Good, but battery life could be better.",
    date: "2023-06-20",
    weight: 50,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [weight, setWeight] = useState("");
  const [fheClient, setFheClient] = useState(null);
  const [quantity, setQuantity] = useState(0);
  // Can we get a provider and signer please?
  const signer = useEthersSigner();
  // console.log('Signer:', signer)
  const provider = useEthersProvider();
  // console.log('Provider:', provider)

  // Create a contract instance
  const votingContract = new ethers.Contract(
    votingAddress,
    votingAbi["abi"],
    provider
  );

  useEffect(() => {
    if (provider) {
      initFHEClient();
    }
  }, [provider]);

  const initFHEClient = () => {
    const client = new FhenixClient({ provider });
    setFheClient(client);
  };

  const getFheClient = () => {
    return fheClient;
  };

  const encrypt = async (element) => {
    try {
      if (element !== null) {
        const value = Number(element);
        const fheClient = getFheClient();
        if (isNaN(value)) {
          throw new Error("Invalid number value");
        }

        if (fheClient !== null) {
          const uint8Array = await fheClient.encrypt_uint8(value);
          return uint8Array;
          // return `0x${Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        }
      }
    } catch (err) {
      console.log("Error:", err);
      return null;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted rating:", rating);
    console.log("Submitted comment:", weight);
    setRating(rating);
    setWeight(weight);
    const encryptedVote = await encrypt(rating);
    const encryptedWeight = await encrypt(weight);
    await votingContract
      .connect(signer)
      .changeVote(encryptedVote, encryptedWeight);
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <RatingComponent
              totalStars={5}
              initialRating={user.overallRating}
              readOnly
            />
            <span className="text-sm text-gray-500">
              ({user.overallRating} out of 5)
            </span>
          </div>
          <Progress value={user.overallRating * 20} className="w-full" />
          <p className="mt-2 text-sm text-gray-500">
            Based on {user.totalReviews} reviews
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Purchase History</TabsTrigger>
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
                  <Progress
                    value={Math.random() * 100}
                    className="w-full mx-2"
                  />
                  <span className="w-8 text-sm text-right">
                    {Math.floor(Math.random() * 100)}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="mb-4 pb-4 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{review.productName}</h3>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <RatingComponent
                    totalStars={5}
                    initialRating={review.rating}
                    readOnly
                  />
                  <p className="mt-2 text-sm">{review.comment}</p>
                  <p className="mt-2 text-sm">Weight: {review.weight}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">Average Vote:</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="">Rate</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rate {review.productName}</DialogTitle>
                          <DialogDescription>
                            Please provide your rating and feedback for this
                            Store
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="quantity"
                              className="text-sm font-medium text-gray-700"
                            >
                              Change Weight
                            </label>
                            <Input
                              type="number"
                              id="quantity"
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(parseInt(e.target.value))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="rating"
                              className="text-sm font-medium text-gray-700"
                            >
                              Your Rating
                            </label>
                            <RatingComponent onChange={setRating} />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="comment"
                              className="text-sm font-medium text-gray-700"
                            >
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
                  </div>
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
  );
}
