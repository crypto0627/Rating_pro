'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          Rating PRO
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <NavItems />
        </div>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              onMouseEnter={() => setIsMenuOpen(true)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-4">
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

function NavItems() {
  return (
    <>
      <Link href="/profile" className="rounded-xl border border-slate-500 bg-gradient-to-b from-zinc-800/30 to-zinc-500/50 p-2 hover:bg-zinc-800/50">
        Profile
      </Link>
      <ConnectButtonWrapper />
    </>
  )
}

function ConnectButtonWrapper() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain
        return (
          <>
            {connected ? (
              <div className='flex gap-5 text-black'>
              <Button onClick={openChainModal} variant="outline" className="w-full justify-start">
                {chain.name}
              </Button>
              <Button onClick={openAccountModal} variant="outline" className="w-full justify-start">
                {account.displayName}
              </Button>
              </div>
            ) : (
              <Button onClick={openConnectModal} variant="outline" className="w-full justify-start">
                Connect Wallet
              </Button>
            )}
          </>
        )
      }}
    </ConnectButton.Custom>
  )
}