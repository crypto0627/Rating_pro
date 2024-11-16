import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

import { RatingComponent } from "../components/RatingComponent";
export default function StoreInfo() {
  return (
    <Card className="w-full min-w-screen">
      <CardHeader>
        <CardTitle>TechGadgets Store</CardTitle>
        <CardDescription>Your one-stop shop for the latest tech</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="flex items-center gap-2 mb-4">
            <RatingComponent
              totalStars={5}
              initialRating={4}
              readOnly
            />
            <span className="text-sm text-gray-500">
              (4 out of 5)
            </span>
          </div>
        <p className="text-sm text-gray-500">Open Mon-Fri: 9AM - 6PM</p>
        <p className="text-sm text-gray-500">Customer Service: 1-800-TECH-HELP</p>
      </CardContent>
    </Card>
  )
}