import { useCallback } from "react";
import { ListingForm } from "~~/app/list-property/page";
import { useScaffoldWatchContractEvent, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { adminWalletClient } from "~~/services/adminWallet";
import { geocodingService } from "~~/services/geocoding";
import { pinataService } from "~~/services/piniata";
import { notification } from "~~/utils/scaffold-eth";

export const usePropertyListing = (form: ListingForm, resetForm: () => void) => {
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "PropertyNFT" });

  const handlePropertyListed = useCallback(
    async (tokenId: bigint, seller: string, metadata: any) => {
      try {
        const loadingToastId = notification.loading("Uploading property metadata to IPFS...");

        // Get coordinates from address
        const coordinates = await geocodingService.getCoordinates(form.location);
        if (!coordinates) {
          notification.error("Failed to get coordinates for the provided address");
          return;
        }

        // Add coordinates to form data
        const formWithCoordinates = {
          ...form,
          coordinates,
        };

        // Upload images to Pinata
        const imageUrls = await pinataService.uploadImages(form.images);

        // Generate metadata
        const metadataObj = pinataService.generateMetadata(
          tokenId.toString(),
          formWithCoordinates,
          imageUrls,
          seller,
          metadata?.propertyToken?.toString(),
        );

        // Upload metadata to Pinata
        const tokenUri = await pinataService.uploadMetadata(tokenId.toString(), metadataObj);

        await writeContractAsync({
          functionName: "setTokenURI",
          args: [tokenId, tokenUri],
          account: adminWalletClient.account,
        });

        // Save to MongoDB
        const dbResponse = await fetch("/api/properties", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tokenId: tokenId.toString(),
            ...metadataObj,
          }),
        });

        if (!dbResponse.ok) {
          throw new Error("Failed to save property to database");
        }

        notification.remove(loadingToastId);
        notification.success("Property metadata uploaded successfully!");
        resetForm();
      } catch (error) {
        console.error("Error in property listing process:", error);
        notification.error("Error uploading property metadata");
      }
    },
    [form, writeContractAsync, resetForm],
  );

  // Watch for Fractional Property Listing
  useScaffoldWatchContractEvent({
    contractName: "MarketplaceFractional",
    eventName: "PropertyListed",
    onLogs: logs => {
      logs.forEach(log => {
        const { lister, tokenId } = log.args;
        handlePropertyListed(tokenId!, lister!, log.args);
      });
    },
  });

  // Watch for Regular Property Listing
  useScaffoldWatchContractEvent({
    contractName: "Marketplace",
    eventName: "PropertyListed",
    onLogs: logs => {
      logs.forEach(log => {
        const { seller, tokenId } = log.args;
        handlePropertyListed(tokenId!, seller!, log.args);
      });
    },
  });
};
