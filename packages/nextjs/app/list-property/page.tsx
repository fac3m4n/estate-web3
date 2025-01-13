"use client";

import { useState } from "react";
import Image from "next/image";
import { NextPage } from "next";
import { parseEther } from "viem";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useScaffoldWatchContractEvent, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { adminWalletClient } from "~~/services/adminWallet";
import { geocodingService } from "~~/services/geocoding";
import { pinataService } from "~~/services/piniata";
import { notification } from "~~/utils/scaffold-eth";

export enum PropertyType {
  Apartment = 0,
  House = 1,
}
export type ListingType = "sale" | "rent";

export interface ListingForm {
  propertyType: PropertyType;
  isShared: boolean;
  canBid: boolean;
  title: string;
  rooms: number;
  bathrooms: number;
  usableSurface: number;
  price: number;
  location: string;
  images: File[];
}

const ListProperty: NextPage = () => {
  const [form, setForm] = useState<ListingForm>({
    propertyType: PropertyType.Apartment,
    isShared: false,
    canBid: false,
    title: "Apartment Test",
    rooms: 1,
    bathrooms: 1,
    usableSurface: 1,
    price: 123,
    location: "Unirii Bucharest",
    images: [],
  });

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "PropertyNFT" });

  // useScaffoldWatchContractEvent({
  //   contractName: "MarketplaceFractional",
  //   eventName: "PropertyListed",
  //   onLogs: async logs => {
  //     console.log("PropertyListed event received. Logs:", logs);
  //     logs.map(async log => {
  //       const { lister, price, pricePerShare, propertyToken, tokenId } = log.args;
  //       console.log("PropertyListed Fractional details:", {
  //         lister,
  //         price,
  //         pricePerShare,
  //         propertyToken,
  //         tokenId,
  //       });

  //       try {
  //         const loadingToastId = notification.loading("Uploading property metadata to IPFS...");
  //         console.log("Current form state:", form);

  //         // Get coordinates from address
  //         const coordinates = await geocodingService.getCoordinates(form.location);
  //         if (!coordinates) {
  //           notification.error("Failed to get coordinates for the provided address");
  //           return;
  //         }

  //         // Add coordinates to form data
  //         const formWithCoordinates = {
  //           ...form,
  //           coordinates,
  //         };

  //         // Upload images to Pinata
  //         console.log("Uploading images:", form.images);
  //         const imageUrls = await pinataService.uploadImages(form.images);
  //         console.log("Image URLs received:", imageUrls);

  //         // Generate metadata with coordinates
  //         console.log("Generating metadata with:", {
  //           tokenId: tokenId?.toString(),
  //           formWithCoordinates,
  //           imageUrls,
  //           propertyToken: propertyToken?.toString(),
  //         });

  //         const metadata = pinataService.generateMetadata(
  //           tokenId?.toString() || "",
  //           formWithCoordinates,
  //           imageUrls,
  //           lister,
  //           propertyToken?.toString(),
  //         );
  //         console.log("Generated metadata:", metadata);

  //         // Upload metadata to Pinata
  //         console.log("Uploading metadata to Pinata...");
  //         const tokenUri = await pinataService.uploadMetadata(tokenId?.toString() || "", metadata);
  //         console.log("Token URI received:", tokenUri);

  //         await writeContractAsync({
  //           functionName: "setTokenURI",
  //           args: [tokenId, tokenUri],
  //           account: adminWalletClient.account,
  //         });

  //         // Save to MongoDB
  //         console.log("Saving to MongoDB...");
  //         const dbResponse = await fetch("/api/properties", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             tokenId: tokenId?.toString(),
  //             ...metadata,
  //           }),
  //         });

  //         if (!dbResponse.ok) {
  //           console.error("MongoDB save failed:", await dbResponse.json());
  //           throw new Error("Failed to save property to database");
  //         }

  //         console.log("MongoDB save successful");
  //         notification.remove(loadingToastId);
  //         notification.success("Property metadata uploaded successfully!");
  //         // reset form
  //         setForm({
  //           propertyType: PropertyType.Apartment,
  //           isShared: false,
  //           canBid: false,
  //           title: "",
  //           rooms: 1,
  //           bathrooms: 1,
  //           usableSurface: 0,
  //           price: 0,
  //           location: "",
  //           images: [],
  //         });
  //       } catch (error) {
  //         console.error("Detailed error in property listing process:", error);
  //         notification.error(
  //           <>
  //             <p className="font-bold mt-0 mb-1">Error uploading property metadata</p>
  //             <p className="m-0">Please try again.</p>
  //           </>,
  //         );
  //       }
  //     });
  //   },
  // });

  useScaffoldWatchContractEvent({
    contractName: "Marketplace",
    eventName: "PropertyListed",
    onLogs: async logs => {
      console.log("PropertyListed event received. Logs:", logs);

      // logs.map(async log => {
      //   const { seller, tokenId, price, canBid } = log.args;
      //   console.log("PropertyListed details:", { seller, tokenId, price, canBid });

      //   try {
      //     const loadingToastId = notification.loading("Uploading property metadata to IPFS...");
      //     console.log("Current form state:", form);

      //     // Get coordinates from address
      //     const coordinates = await geocodingService.getCoordinates(form.location);
      //     if (!coordinates) {
      //       notification.error("Failed to get coordinates for the provided address");
      //       return;
      //     }

      //     // Add coordinates to form data
      //     const formWithCoordinates = {
      //       ...form,
      //       coordinates,
      //     };

      //     // Upload images to Pinata
      //     console.log("Uploading images:", form.images);
      //     const imageUrls = await pinataService.uploadImages(form.images);
      //     console.log("Image URLs received:", imageUrls);

      //     // Generate metadata
      //     console.log("Generating metadata with:", { tokenId: tokenId?.toString(), formWithCoordinates, imageUrls });
      //     const metadata = pinataService.generateMetadata(
      //       tokenId?.toString() || "",
      //       formWithCoordinates,
      //       imageUrls,
      //       seller,
      //     );
      //     console.log("Generated metadata:", metadata);

      //     // Upload metadata to Pinata
      //     console.log("Uploading metadata to Pinata...");
      //     const tokenUri = await pinataService.uploadMetadata(tokenId?.toString() || "", metadata);
      //     console.log("Token URI received:", tokenUri);

      //     await writeContractAsync({
      //       functionName: "setTokenURI",
      //       args: [tokenId, tokenUri],
      //       account: adminWalletClient.account,
      //     });

      //     // Save to MongoDB
      //     console.log("Saving to MongoDB...");
      //     const dbResponse = await fetch("/api/properties", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         tokenId: tokenId?.toString(),
      //         ...metadata,
      //       }),
      //     });

      //     if (!dbResponse.ok) {
      //       console.error("MongoDB save failed:", await dbResponse.json());
      //       throw new Error("Failed to save property to database");
      //     }

      //     console.log("MongoDB save successful");
      //     notification.remove(loadingToastId);
      //     notification.success("Property metadata uploaded successfully!");
      //     // reset form
      //     setForm({
      //       propertyType: PropertyType.Apartment,
      //       isShared: false,
      //       canBid: false,
      //       title: "",
      //       rooms: 1,
      //       bathrooms: 1,
      //       usableSurface: 0,
      //       price: 0,
      //       location: "",
      //       images: [],
      //     });

      //     console.log("Token URI:", tokenUri);
      //   } catch (error) {
      //     console.error("Error uploading metadata:", error);
      //     notification.error(
      //       <>
      //         <p className="font-bold mt-0 mb-1">Error uploading property metadata</p>
      //         <p className="m-0">Please try again.</p>
      //       </>,
      //     );
      //   }
      // });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.isShared) {
        await writeContractAsync({
          functionName: "createPropertyShared",
          args: [
            parseEther(form.price.toString()),
            BigInt(form.propertyType),
            form.location,
            BigInt(form.rooms),
            BigInt(form.bathrooms),
            BigInt(form.usableSurface),
          ],
        });
      } else {
        await writeContractAsync({
          functionName: "createProperty",
          args: [
            parseEther(form.price.toString()),
            form.canBid,
            BigInt(form.propertyType),
            form.location,
            BigInt(form.rooms),
            BigInt(form.bathrooms),
            BigInt(form.usableSurface),
          ],
        });
      }
    } catch (error) {
      console.error("Error handling property submission:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">List Your Property</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Type Selection */}
        <div className="grid grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, propertyType: PropertyType.Apartment })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 ${
              form.propertyType === PropertyType.Apartment ? "border-primary bg-primary/10" : "border-base-200"
            }`}
          >
            <BuildingOffice2Icon className="h-6 w-6" />
            <span>Apartment</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, propertyType: PropertyType.House })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 ${
              form.propertyType === PropertyType.House ? "border-primary bg-primary/10" : "border-base-200"
            }`}
          >
            <HomeIcon className="h-6 w-6" />
            <span>House</span>
          </button>
          {/* Add similar buttons for Ground and Commercial */}
        </div>

        {/* Property Ownership Type */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="isShared"
              checked={!form.isShared}
              onChange={() => setForm({ ...form, isShared: false })}
              className="radio radio-primary"
            />
            Whole Property
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="isShared"
              checked={form.isShared}
              onChange={() => setForm({ ...form, isShared: true })}
              className="radio radio-primary"
            />
            Fractional Property
          </label>
        </div>

        {/* Bid or Direct Sale - Only show for non-fractional properties */}
        {!form.isShared && (
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="canBid"
                checked={form.canBid}
                onChange={() => setForm({ ...form, canBid: !form.canBid })}
                className="radio radio-primary"
              />
              Bid
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="canBid"
                checked={!form.canBid}
                onChange={() => setForm({ ...form, canBid: !form.canBid })}
                className="radio radio-primary"
              />
              Direct Sale
            </label>
          </div>
        )}

        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Property Title"
          />
        </div>

        {/* Images Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Images</span>
          </label>
          <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setForm({ ...form, images: Array.from(e.target.files || []) })}
              className="hidden"
              id="images"
            />
            <label htmlFor="images" className="btn btn-outline">
              Upload Images
            </label>
            <p className="text-sm mt-2">Maximum 10 pictures. Supported formats: PNG, JPG. Maximum size 10MB</p>

            {/* Image Preview Section */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {Array.from(form.images).map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      width={500}
                      height={500}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = Array.from(form.images);
                        newImages.splice(index, 1);
                        setForm({ ...form, images: newImages });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Number of Rooms */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Number of Rooms</span>
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, "5+"].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setForm({ ...form, rooms: typeof num === "string" ? 5 : num })}
                className={`btn ${form.rooms === (typeof num === "string" ? 5 : num) ? "btn-primary" : "btn-outline"}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Bathrooms */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Number of Bathrooms</span>
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, "5+"].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setForm({ ...form, bathrooms: typeof num === "string" ? 5 : num })}
                className={`btn ${form.bathrooms === (typeof num === "string" ? 5 : num) ? "btn-primary" : "btn-outline"}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Usable Surface */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Usable Surface</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={form.usableSurface || ""}
              onChange={e => setForm({ ...form, usableSurface: Number(e.target.value) })}
              className="input input-bordered w-full pr-12"
              placeholder="Usable surface"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">m²</span>
          </div>
        </div>

        {/* Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={form.price || ""}
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              className="input input-bordered w-full pr-12"
              placeholder="Price"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">tUSDC</span>
          </div>
        </div>

        {/* Location */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Property location"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          List Property
        </button>
      </form>
    </div>
  );
};

export default ListProperty;
