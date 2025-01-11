import Image from "next/image";
import Link from "next/link";
import { useScaffoldReadContract } from "../hooks/scaffold-eth";
import { Bath, BedSingle, Ruler } from "lucide-react";

interface NewPropertyCardProps {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  imageUrl: string;
}

export const NewPropertyCard = ({ id, title, location, bedrooms, bathrooms, size, imageUrl }: NewPropertyCardProps) => {
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
  return (
    <Link href={`/properties/${id}`}>
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Property Image */}
        <div className="relative h-64 w-full">
          <Image src={imageUrl} alt={title} width={1000} height={1000} className="w-full h-full object-cover" />
        </div>

        {/* Property Details */}
        <div className="p-6 space-y-4">
          {/* Price */}
          <div className="text-4xl font-bold text-blue-400">{price} tBUSD</div>

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
