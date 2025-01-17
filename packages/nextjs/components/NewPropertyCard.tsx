import Image from "next/image";
import Link from "next/link";
import { useScaffoldReadContract } from "../hooks/scaffold-eth";
import { Bath, BedSingle, Ruler } from "lucide-react";
import { BuildingOffice2Icon, HomeIcon } from "@heroicons/react/24/outline";

interface NewPropertyCardProps {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  imageUrl: string;
  propertyType: number;
}

export const NewPropertyCard = ({
  id,
  title,
  location,
  bedrooms,
  bathrooms,
  size,
  imageUrl,
  propertyType,
}: NewPropertyCardProps) => {
  const { data: getProperty } = useScaffoldReadContract({
    contractName: "Marketplace",
    functionName: "getMarketItem",
    args: [BigInt(id)],
  });
  const { data: getPropertyShared } = useScaffoldReadContract({
    contractName: "MarketplaceFractional",
    functionName: "getMarketItem",
    args: [BigInt(id)],
  });

  let price = (BigInt(getProperty?.price || 0) / BigInt(10 ** 18)).toLocaleString();

  if (price === "0") {
    price = (BigInt(getPropertyShared?.price || 0) / BigInt(10 ** 18)).toLocaleString();
  }

  const PropertyTypeIcon = propertyType === 0 ? BuildingOffice2Icon : HomeIcon;

  return (
    <Link href={`/properties/${id}`}>
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Property Image */}
        <div className="relative h-64 w-full">
          <Image src={imageUrl} alt={title} width={1000} height={1000} className="w-full h-full object-cover" />
          {/* Property Type Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
            <PropertyTypeIcon className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-700">{propertyType === 0 ? "Apartment" : "House"}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6 space-y-4">
          {/* Price */}
          <div className="text-4xl font-bold text-blue-400">{price} tUSD</div>

          {/* Property Name */}
          <h2 className="text-xl font-bold text-navy-900">{title}</h2>

          {/* Address */}
          <p className="text-sm text-gray-500">{location}</p>

          {/* Property Features */}
          <div className="flex items-center gap-8 pt-4">
            {/* Bedrooms */}
            <div className="flex items-center gap-2">
              <BedSingle size={24} className="text-blue-400" />
              <span className="text-xl">{bedrooms}</span>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-2">
              <Bath size={24} className="text-blue-400" />
              <span className="text-xl">{bathrooms}</span>
            </div>

            {/* Size */}
            <div className="flex items-center gap-2">
              <Ruler size={24} className="text-blue-400" />
              <span className="text-xl">{size} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
