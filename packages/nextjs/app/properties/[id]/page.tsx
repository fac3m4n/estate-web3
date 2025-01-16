"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import deployedContracts from "../../../contracts/deployedContracts";
import { Bath, BedSingle, Ruler } from "lucide-react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface Property {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: {
    rooms: number;
    bathrooms: number;
    location: string;
    usableSurface: number;
    propertyType: string;
    ownershipType: string;
  };
  properties: {
    image: string[];
    title: string;
    rooms: number;
    bathrooms: number;
    location: string;
    usableSurface: number;
    propertyType: string;
    ownershipType: string;
  };
}
enum PropertyType {
  Apartment = 0,
  House = 1,
}

export default function PropertyDetails({ params }: { params: { id: string } }) {
  const { address } = useAccount();
  const [property, setProperty] = useState<Property | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  // Add new states for UI controls
  const [newPrice, setNewPrice] = useState<string>("");
  const [shareAmount, setShareAmount] = useState<string>("");

  const isFractional = property?.properties.ownershipType == "Fractional";

  // Marketplace Contract reads

  const { data: getProperty } = useScaffoldReadContract({
    contractName: "Marketplace",
    functionName: "getMarketItem",
    args: [BigInt(params.id)],
  });

  const { data: getPropertyShared } = useScaffoldReadContract({
    contractName: "MarketplaceFractional",
    functionName: "getMarketItem",
    args: [BigInt(params.id)],
  });

  const { data: getSharePrice } = useScaffoldReadContract({
    contractName: "MarketplaceFractional",
    functionName: "getSharePrice",
    args: [BigInt(params.id)],
  });

  const { data: getDownPayment } = useScaffoldReadContract({
    contractName: "Marketplace",
    functionName: "getDownPayment",
    args: [BigInt(params.id)],
  });

  const { data: allowance } = useScaffoldReadContract({
    contractName: "tUSD",
    functionName: "allowance",
    args: [address, deployedContracts[421614]["tUSD"].address],
  });

  const { data: getMonthlyPayment } = useScaffoldReadContract({
    contractName: "Marketplace",
    functionName: "getMonthlyPayment",
    args: [BigInt(params.id)],
  });

  // Contract writes
  const { writeContractAsync: marketplaceWrite } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const { writeContractAsync: fractionalMarketplaceWrite } = useScaffoldWriteContract({
    contractName: "MarketplaceFractional",
  });
  const { writeContractAsync: tUSDWrite } = useScaffoldWriteContract({ contractName: "tUSD" });

  // Marketplace Contract writes

  const buyProperty = async () => {
    // @ts-ignore
    console.log("Allowance:", allowance?.toString());
    // @ts-ignore
    console.log("Price:", getProperty?.price.toString());

    // @ts-ignore
    if (!allowance || allowance < getProperty?.price) {
      console.log("Approving transaction...");
      try {
        await tUSDWrite({
          functionName: "approve",
          args: [deployedContracts[421614]["tUSD"].address, getProperty?.price],
        });
        notification.success("Approval successful!");
      } catch (error) {
        console.error("Approval error:", error);
        notification.error("Failed to approve transaction");
        return;
      }
    }

    try {
      await marketplaceWrite({
        functionName: "buyProperty",
        args: [BigInt(params.id), getProperty?.price],
      });
      notification.success("Property purchased successfully!");
    } catch (error) {
      console.error("Purchase error:", error);
      notification.error("Failed to purchase property");
    }
  };

  const buyWithInstallment = async () => {
    await marketplaceWrite({
      functionName: "buyWithInstallment",
      // @ts-ignore
      args: [BigInt(params.id), getProperty?.price],
    });
  };

  const updatePrice = async () => {
    if (!newPrice) return;
    try {
      await marketplaceWrite({
        functionName: "updatePrice",
        args: [BigInt(params.id), parseEther(newPrice)],
      });
      await fetch(`/api/properties/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({ price: newPrice }),
      });

      // Refetch property data
      const response = await fetch(`/api/properties/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch updated property");
      const updatedProperty = await response.json();
      setProperty(updatedProperty);
      setNewPrice(""); // Clear the input field
      notification.success("Price updated successfully!");
    } catch (error) {
      console.error("Error updating price:", error);
      notification.error("Failed to update price");
    }
  };

  const cancelSelling = async () => {
    await marketplaceWrite({
      functionName: "cancelSelling",
      args: [BigInt(params.id)],
    });

    await fetch(`/api/properties/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ listed: false }),
    });
  };

  const placeBid = async () => {
    await marketplaceWrite({
      functionName: "placeBid",
      args: [BigInt(params.id), parseEther(bidAmount)],
    });
  };

  const acceptBid = async () => {
    await marketplaceWrite({
      functionName: "acceptBid",
      args: [BigInt(params.id)],
    });
  };

  const withdrawBid = async () => {
    await marketplaceWrite({
      functionName: "withdrawBid",
      args: [BigInt(params.id)],
    });
  };

  const makePayment = async () => {
    await marketplaceWrite({
      functionName: "makePayment",
      args: [BigInt(params.id)],
    });
  };

  // Fractional Contract writes
  const buyPropertyShare = async () => {
    // check if the user has enough allowance to buy shares

    console.log("Allowance:", allowance?.toString());
    console.log("Share Price:", getSharePrice?.toString());
    console.log("Share Amount:", shareAmount);

    if (!allowance || allowance < BigInt(Number(getSharePrice) * Number(shareAmount))) {
      console.log("Approving transaction...");
      try {
        await tUSDWrite({
          functionName: "approve",
          args: [deployedContracts[421614]["tUSD"].address, BigInt(Number(getSharePrice) * Number(shareAmount))],
        });
        notification.success("Approval successful!");
      } catch (error) {
        console.error("Approval error:", error);
        notification.error("Failed to approve transaction");
        return;
      }
    }

    await fractionalMarketplaceWrite({
      functionName: "buyPropertyShare",
      // @ts-ignore
      args: [BigInt(params.id), Number(shareAmount)],
    });
    notification.success("Shares purchased successfully!");
    setShareAmount("");
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch property");
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        notification.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!property) {
    return <div className="text-center py-10">Property not found</div>;
  }

  const isOwner = address && getProperty?.seller === address;
  const fractionSeller = address && getPropertyShared?.seller === address;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Property Image */}
        <div className="rounded-lg overflow-hidden h-[400px]">
          <Image
            src={property.image}
            alt={property.name}
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Property Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{property.name}</h1>
          <h2 className="text-2xl font-bold">{property.properties.title}</h2>
          <p className="text-2xl font-bold text-primary">
            {!isFractional
              ? (BigInt(getProperty?.price || 0) / BigInt(10 ** 18)).toLocaleString()
              : (BigInt(getPropertyShared?.price || 0) / BigInt(10 ** 18)).toLocaleString()}{" "}
            tUSD
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="stat-box">
              <span className="text-lg flex items-center gap-2">
                {property.properties.rooms} <BedSingle />
              </span>
            </div>
            <div className="stat-box">
              <span className="text-lg flex items-center gap-2">
                {property.properties.bathrooms} <Bath />
              </span>
            </div>
            <div className="stat-box">
              <span className="text-lg flex items-center gap-2">
                {property.properties.usableSurface} <Ruler />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-base-100 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Type:</span>
              <span className="text-gray-600">{PropertyType[Number(property.properties.propertyType)]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Ownership:</span>
              <span className="text-gray-600">{property.properties.ownershipType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Location:</span>
              <span className="text-gray-600">{property.properties.location}</span>
            </div>
          </div>

          {/* Payment Information Section */}
          {getDownPayment && getMonthlyPayment && (
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Installment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Down Payment</p>
                  <p className="font-bold">{(Number(getDownPayment) / 10 ** 18).toFixed(2)} tUSD</p>
                </div>
                <div>
                  <p className="text-sm">Monthly Payment</p>
                  <p className="font-bold">{(Number(getMonthlyPayment) / 10 ** 18).toFixed(2)} tUSD</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Regular Purchase Options */}
            {!isOwner && !isFractional && (
              <div className="flex flex-col gap-3">
                <button onClick={buyProperty} className="btn btn-primary w-full">
                  Buy Now 💸
                </button>
                <button onClick={buyWithInstallment} className="btn btn-secondary w-full">
                  Buy with Installments 💸
                </button>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="New Price (tUSD)"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="input input-bordered flex-1"
                  />
                  <button onClick={updatePrice} className="btn btn-primary">
                    Update Price ✏️
                  </button>
                </div>
                <button onClick={cancelSelling} className="btn btn-error w-full">
                  Cancel Selling 🚫
                </button>
                {/* @ts-ignore */}
                {getProperty?.canBid && (
                  <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-base-200 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-base-content/70">Current Bid</p>
                      <p className="text-xl font-bold">
                        {/* @ts-ignore */}
                        {(Number(getProperty?.highestBid) / 10 ** 18).toFixed(2)} tUSD
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-sm text-base-content/70 mb-1">Highest Bidder</p>
                      {/* @ts-ignore */}
                      <Address address={getProperty?.highestBidder} />
                    </div>
                    <button
                      onClick={acceptBid}
                      // @ts-ignore
                      disabled={Number(getProperty?.highestBid) / 10 ** 18 <= Number(0)}
                      className="btn btn-success w-full md:w-auto"
                    >
                      Accept 💸
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bidding Section */}
            {/* @ts-ignore */}
            {getProperty?.canBid && !isOwner && (
              <div className="space-y-3">
                <div className="flex items-center gap-4 w-full justify-between">
                  <p className="text-lg">
                    Highest Bid: {/* @ts-ignore */}
                    <span className="font-bold">{(Number(getProperty?.highestBid) / 10 ** 18).toFixed(2)} tUSD</span>
                  </p>
                  {/* @ts-ignore */}
                  <Address address={getProperty?.highestBidder} />
                </div>

                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Bid Amount (tUSD)"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    className="input input-bordered flex-1"
                  />
                  <button onClick={placeBid} className="btn btn-primary">
                    Place Bid ✋
                  </button>
                </div>
                <button onClick={withdrawBid} className="btn btn-warning w-full">
                  Withdraw Bid 🚫
                </button>
              </div>
            )}

            {/* Payment Button */}
            {/* <button onClick={makePayment} className="btn btn-info w-full">
              Make Monthly Payment
            </button> */}

            {/* Fractional Purchase Options */}
            {isFractional && (
              <div className="space-y-4 p-6 bg-base-200 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Fractional Ownership</h3>
                    <p className="text-lg font-medium">
                      {/* @ts-ignore */}
                      {Number(getPropertyShared?.sharesAvailable).toLocaleString()} shares available
                    </p>
                    <p className="text-lg">
                      Price per share: {/* @ts-ignore */}
                      <span className="font-medium">{Number(getPropertyShared?.pricePerShare) / 10 ** 18} tUSD</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-base-content/70 mb-1">Property Token</p>
                    {/* @ts-ignore */}
                    <Address address={getPropertyShared?.propertyToken} />
                  </div>
                </div>
                {!isOwner && !fractionSeller && (
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Enter number of shares to buy"
                      value={shareAmount}
                      onChange={e => setShareAmount(e.target.value)}
                      className="input input-bordered flex-1"
                      min="1"
                    />
                    <button
                      onClick={buyPropertyShare}
                      className="btn btn-primary min-w-[140px]"
                      disabled={!shareAmount}
                    >
                      Buy Shares 💸
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
