import React from "react";
import Image from "next/image";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 p-5 bg-white">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-2">
        <div className="flex relative w-10 h-10">
          <Image alt="Estate web3 logo" className="cursor-pointer" fill src="/logo.png" />
        </div>
        <div className="text-sm text-center">
          <p className="mb-1">© 2024 Estate. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
