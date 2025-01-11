"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import type { NextPage } from "next";
import { PropertyCard } from "~~/components/PropertyCard";
import { PropertyMarkers } from "~~/components/PropertyMarkers";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

interface Property {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  properties: {
    rooms: number;
    title: string;
    bathrooms: number;
    location: string;
    usableSurface: number;
    propertyType: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}
const Properties: NextPage = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Calculate map center based on property coordinates
  const defaultCenter = { lat: 44.4268, lng: 26.1025 }; // Default to Bucharest
  const mapCenter =
    properties.length > 0 && properties[0].properties.coordinates
      ? properties[0].properties.coordinates
      : defaultCenter;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Property List */}
      <div className="w-1/3 overflow-y-auto p-6 border-r">
        <h1 className="text-3xl font-bold mb-6">Available Properties</h1>
        <div className="space-y-6">
          {properties.map(property => (
            <PropertyCard
              key={property.tokenId}
              property={property}
              onClick={() => setSelectedProperty(property.tokenId)}
              isSelected={selectedProperty === property.tokenId}
            />
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="w-2/3">
        <APIProvider apiKey={API_KEY}>
          <Map
            mapId={"bf51a910020fa25a"}
            defaultZoom={12}
            defaultCenter={mapCenter}
            gestureHandling={"greedy"}
            disableDefaultUI
          >
            <PropertyMarkers
              properties={properties.map(p => ({
                id: p.tokenId,
                title: p.name,
                price: 0,
                coordinates: p.properties.coordinates || defaultCenter,
              }))}
              selectedPropertyId={selectedProperty}
              onMarkerClick={id => setSelectedProperty(id)}
            />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default Properties;
