'use client'
import React, { useEffect, useState } from 'react'
import { useBlockNumber, useChainId } from 'wagmi'

import { votingAddress } from '@/config/wagmiConfig'
import votingAbi from '../abi/Voting.json'
import { ethers } from 'ethers'
import { FhenixClient } from 'fhenixjs'
import { useEthersProvider, useEthersSigner } from '../utils/viemEthersConverters' // Adjust the import path as needed
import Banner from '../components/Banner'
import StoreInfo from '../components/StoreInfo'
import ProductCard from '../components/ProductCard'

const products = [
  { id: 1, name: 'Smart Watch', price: 199.99, rating: 4.5, image: '/placeholder.svg?height=200&width=200' },
  { id: 2, name: 'Wireless Earbuds', price: 89.99, rating: 4.2, image: '/placeholder.svg?height=200&width=200' },
  { id: 3, name: 'Laptop', price: 999.99, rating: 4.8, image: '/placeholder.svg?height=200&width=200' },
  { id: 4, name: 'Smart Speaker', price: 49.99, rating: 3.9, image: '/placeholder.svg?height=200&width=200' },
]

//// START OF THE COMPONENT ////
export default function LandingPage() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [proposalName, setProposalName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [fheClient, setFheClient] = useState(null)
  const [finalizedClicked, setFinalizedClicked] = useState(false)
  const [finalized, setFinalized] = useState<boolean>(false)
  const [winningValues, setWinningValues] = useState({ uint8Value: null, uint16Value: null })

  const { data: blockNumberData } = useBlockNumber({ watch: true })
  const chainId = useChainId()

  // Can we get a provider and signer please?
  const signer = useEthersSigner()
  // console.log('Signer:', signer)
  const provider = useEthersProvider()
  // console.log('Provider:', provider)

  useEffect(() => {
    if (provider) {
      initFHEClient()
    }
  }, [provider])

  const initFHEClient = () => {
    const client = new FhenixClient({ provider })
    setFheClient(client)
  }

  const getFheClient = () => {
    return fheClient
  }

  const encrypt = async (element) => {
    try {
      if (element !== null) {
        const value = Number(element)
        const fheClient = getFheClient()
        if (isNaN(value)) {
          throw new Error('Invalid number value')
        }

        if (fheClient !== null) {
          const uint8Array = await fheClient.encrypt_uint8(value)
          return uint8Array
          // return `0x${Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        }
      }
    } catch (err) {
      console.log('Error:', err)
      return null
    }
  }

  // Create a contract instance
  const votingContract = new ethers.Contract(votingAddress, votingAbi['abi'], provider)

  // Fetch the proposal name
  useEffect(() => {
    const fetchProposalName = async () => {
      try {
        const name = await votingContract.proposal()
        console.log('Proposal Name:', name)
        setProposalName(name)
        setIsLoading(false)
      } catch (error) {
        setError(error)
        setIsLoading(false)
      }
    }

    fetchProposalName()
  }, [])

  useEffect(() => {
    const fetchFinalized = async () => {
      try {
        const finalized = await votingContract.finalized()
        console.log('Finalized?:', finalized)
        setFinalized(finalized)

        if (finalized) {
          fetchWinningValues()
        }
      } catch (error) {
        console.error('Error fetching finalized status:', error)
      }
    }

    fetchFinalized()
  }, [finalizedClicked])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (selectedOption === null) {
      alert('Please select an option before submitting.')
      return
    }
    console.log('Selected Option:', selectedOption)

    // console.log("Encrypted vote:")
    const encryptedVote = await encrypt(selectedOption)
    console.log(encryptedVote);

    // subtmit the vote using vote(bytes) function
    console.log('Submitting vote...')
    console.log('Voting contract:', votingContract)
    console.log('Signer:', signer)
    console.log('Encrypted vote:', encryptedVote)
    await votingContract.connect(signer).vote(encryptedVote)

    // Set the submitted state to true
    setIsSubmitted(true)
  }

  const handleFinalizeVoting = async () => {
    // Add the logic to finalize the voting process
    console.log('Finalize Voting button clicked')
    // await votingContract.connect(signer).finalize();

    try {
      const tx = await votingContract.connect(signer).finalize()
      await tx.wait()
      console.log('Voting finalized:', tx)
    } catch (error) {
      console.error('Error finalizing voting:', error)
    } finally {
      console.log('Finalize voting completed')
      setFinalizedClicked(true)
      fetchWinningValues()
    }
  }

  const fetchWinningValues = async () => {
    try {
      const [uint8Value, uint16Value] = await votingContract.winning()
      setWinningValues({ uint8Value, uint16Value })
      console.log('Winning values:', { uint8Value, uint16Value })
    } catch (error) {
      console.error('Error fetching winning values:', error)
    }
  }

  // TODO fetch voting options
  // These can be fetched from the contract as well, but for simplicity and time limits, we are hardcoding them here
  const options = ['Patrick Star', 'Sandy Cheeks', 'Mr. Krabs']

  return (
      <main className='fixed w-full flex flex-col items-center justify-center p-10 bg-gradient-to-b'>
        <div>
          <h1 className='text-3xl font-bold py-5'>Rating PRO</h1>
        </div>

        <div className="flex flex-col min-h-screen">
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
      </main>
  )
}
