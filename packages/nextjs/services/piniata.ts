import { PinataSDK } from "pinata-web3";

export class PinataService {
  private pinata: PinataSDK;
  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINIATA_JWT,
      pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
    });
  }

  async uploadMetadata(tokenId: string, metadata: any): Promise<string> {
    try {
      console.log("Starting metadata upload for tokenId:", tokenId);
      console.log("Metadata to upload:", metadata);

      const metadataFile = new File([JSON.stringify(metadata)], `metadata_${tokenId}.json`, {
        type: "application/json",
      });
      console.log("Created metadata file:", metadataFile.name);

      const upload = await this.pinata.upload.file(metadataFile);
      console.log("Upload successful. IPFS Hash:", upload.IpfsHash);

      const finalUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`;
      console.log("Final metadata URL:", finalUrl);

      return finalUrl;
    } catch (error) {
      console.error("Error uploading metadata to Pinata:", error);
      throw error;
    }
  }

  async uploadImages(images: File[]): Promise<string[]> {
    try {
      const uploadPromises = images.map(image => {
        // Generate random name for the image
        const randomName = crypto.randomUUID();
        const extension = image.name.split(".").pop();
        const newFile = new File([image], `${randomName}.${extension}`, { type: image.type });
        return this.pinata.upload.file(newFile);
      });
      const uploads = await Promise.all(uploadPromises);
      return uploads.map(upload => `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`);
    } catch (error) {
      console.error("Error uploading images to Pinata:", error);
      throw error;
    }
  }

  generateMetadata(tokenId: string, propertyData: any, imageUrls: string[], seller?: string, propertyToken?: string) {
    console.log("Starting metadata generation with:", {
      tokenId,
      propertyData,
      imageUrls,
      propertyToken,
      seller,
    });

    try {
      const baseMetadata = {
        name: `Real Estate NFT #${tokenId}`,
        description: propertyData.description || "This NFT represents ownership of a real-world property.",
        image: imageUrls[0],
        attributes: [
          { trait_type: "Area (sqm)", value: propertyData.usableSurface },
          { trait_type: "Number of Rooms", value: propertyData.rooms },
          { trait_type: "Number of Bathrooms", value: propertyData.bathrooms },
          { trait_type: "Address of Property", value: propertyData.location },
          { trait_type: "Property Type", value: propertyData.propertyType === 0 ? "Apartment" : "House" },
          { trait_type: "Ownership Type", value: propertyData.isShared ? "Fractional" : "Whole" },
        ],
        properties: {
          images: imageUrls,
          title: propertyData.title,
          usableSurface: propertyData.usableSurface,
          rooms: propertyData.rooms,
          bathrooms: propertyData.bathrooms,
          location: propertyData.location,
          propertyType: propertyData.propertyType,
          ownershipType: propertyData.isShared ? "Fractional" : "Whole",
          coordinates: propertyData.coordinates || null,
        },
      };

      console.log("Base metadata created:", baseMetadata);
      console.log("Final metadata:", baseMetadata);
      return baseMetadata;
    } catch (error) {
      console.error("Error generating metadata:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const pinataService = new PinataService();
