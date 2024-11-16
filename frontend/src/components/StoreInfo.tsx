import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export default function StoreInfo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>TechGadgets Store</CardTitle>
        <CardDescription>Your one-stop shop for the latest tech</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Open Mon-Fri: 9AM - 6PM</p>
        <p className="text-sm text-gray-500">Customer Service: 1-800-TECH-HELP</p>
      </CardContent>
    </Card>
  )
}