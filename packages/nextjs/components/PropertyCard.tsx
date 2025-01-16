import Image from "next/image";
import Link from "next/link";
import { useScaffoldReadContract } from "../hooks/scaffold-eth";
import { Bath, BedSingle, Ruler } from "lucide-react";

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

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  isSelected: boolean;
}

export const PropertyCard = ({ property, onClick, isSelected }: PropertyCardProps) => {
  console.log(property.tokenId);
  const { data: getProperty } = useScaffoldReadContract({
    contractName: "Marketplace",
    functionName: "getMarketItem",
    args: [BigInt(property.tokenId)],
  });
  const { data: getPropertyShared } = useScaffoldReadContract({
    contractName: "MarketplaceFractional",
    functionName: "getMarketItem",
    args: [BigInt(property.tokenId)],
  });

  let price = (BigInt(getProperty?.price || 0) / BigInt(10 ** 18)).toLocaleString();

  if (price === "0") {
    price = (BigInt(getPropertyShared?.price || 0) / BigInt(10 ** 18)).toLocaleString();
  }

  console.log(price);
  return (
    <div
      className={`card card-compact bg-base-100 shadow-xl cursor-pointer transition-all hover:shadow-2xl ${
        isSelected ? "ring-2 ring-red-500" : ""
      }`}
      onClick={onClick}
    >
      <figure className="h-48 relative">
        <Image
          src={property.image}
          alt={property.name}
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 badge badge-primary text-lg font-bold">{price} tUSD</div>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{property.name}</h2>
        <h2 className="card-title">{property.properties.title}</h2>
        <p className="text-sm text-base-content/70">{property.properties.location}</p>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-lg flex items-center gap-2">
            <Ruler />
            {property.properties.usableSurface}
          </span>
          <span className="text-lg flex items-center gap-2">
            <BedSingle />
            {property.properties.rooms}
          </span>
          <span className="text-lg flex items-center gap-2">
            <Bath />
            {property.properties.bathrooms}
          </span>
        </div>
        <div className="card-actions justify-end mt-2">
          <Link
            href={`/properties/${property.tokenId}`}
            className="btn btn-primary btn-sm"
            onClick={e => e.stopPropagation()} // Prevent triggering the parent onClick
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
