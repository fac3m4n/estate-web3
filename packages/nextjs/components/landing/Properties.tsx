"use client";

import { useEffect, useState } from "react";
import { NewPropertyCard } from "~~/components/NewPropertyCard";

interface Property {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  properties: {
    title: string;
    price: number;
    rooms: number;
    bathrooms: number;
    location: string;
    usableSurface: number;
    propertyType: number;
  };
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties?limit=3");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center pt-16 md:pt-24">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Properties</h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto px-4">
          Discover our selection of the finest properties available for sale or rent
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 py-20 md:py-[160px] px-4 md:px-[100px]">
        {properties.map((property, index) => (
          <NewPropertyCard
            key={property.tokenId || index}
            id={property.tokenId}
            title={property.properties.title || property.name}
            location={property.properties.location}
            bedrooms={property.properties.rooms}
            bathrooms={property.properties.bathrooms}
            size={property.properties.usableSurface}
            imageUrl={property.image}
            propertyType={Number(property.properties.propertyType)}
          />
        ))}
      </div>
    </div>
  );
}
