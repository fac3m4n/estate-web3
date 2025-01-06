"use client";

import { useState } from "react";
import Image from "next/image";
import { useScaffoldWriteContract } from "../../hooks/scaffold-eth";
import { NextPage } from "next";
import { parseEther } from "viem";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";

export enum PropertyType {
  UNDEFINED,
  APARTMENT,
  HOUSE,
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
    propertyType: PropertyType.APARTMENT,
    isShared: false,
    canBid: false,
    title: "",
    rooms: 1,
    bathrooms: 1,
    usableSurface: 0,
    price: 0,
    location: "",
    images: [],
  });

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "PropertyNFT" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.isShared) {
        await writeContractAsync({
          functionName: "createPropertyShared",
          args: [
            parseEther(form.price.toString()),
            form.propertyType,
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
            form.propertyType,
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
            onClick={() => setForm({ ...form, propertyType: PropertyType.APARTMENT })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 ${
              form.propertyType === PropertyType.APARTMENT ? "border-primary bg-primary/10" : "border-base-200"
            }`}
          >
            <BuildingOffice2Icon className="h-6 w-6" />
            <span>Apartment</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, propertyType: PropertyType.HOUSE })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 ${
              form.propertyType === PropertyType.HOUSE ? "border-primary bg-primary/10" : "border-base-200"
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
