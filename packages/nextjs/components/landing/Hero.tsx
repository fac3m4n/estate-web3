import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import property1 from "~~/components/img/hero/1.png";
import property2 from "~~/components/img/hero/2.png";
import map from "~~/components/img/hero/map.png";

export default function Hero() {
  return (
    <div className="flex flex-col md:flex-row bg-[#F7F7FD]">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-10 px-4 md:px-0">
        <div className="max-w-[544px]">
          <h1 className="text-4xl md:text-[64px] font-bold leading-[110%] text-center md:text-left">
            Buy, rent, or sell your property easily
          </h1>
          <p className="text-lg md:text-[20px] mt-4 text-center md:text-left">
            A great platform to buy, sell, or even rent your properties without any commisions.
          </p>
        </div>
        <div className="flex gap-[80px] mt-8">
          <Link href="/properties" className="btn btn-secondary btn-lg">
            <HomeIcon className="w-6 h-6" />
            Explore Properties
          </Link>
        </div>
      </div>
      <div className="hidden md:block w-full md:w-1/2 relative">
        <Image src={map} alt="map" />
        <Image src={property2} alt="property1" width={324} height={416} className="absolute top-[88px] left-[16px]" />
        <Image src={property1} alt="property2" width={198} height={280} className="absolute top-[486px] left-[406px]" />
      </div>
    </div>
  );
}
