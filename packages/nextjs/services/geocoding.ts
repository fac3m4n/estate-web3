import { Loader } from "@googlemaps/js-api-loader";

export class GeocodingService {
  private geocoder: google.maps.Geocoder | null = null;

  constructor() {
    this.initGeocoder();
  }

  private async initGeocoder() {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"],
    });

    await loader.load();
    this.geocoder = new google.maps.Geocoder();
  }

  async getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!this.geocoder) {
      await this.initGeocoder();
    }

    try {
      const response = await this.geocoder!.geocode({ address });

      if (response.results && response.results.length > 0) {
        const { lat, lng } = response.results[0].geometry.location.toJSON();
        return { lat, lng };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }
}

export const geocodingService = new GeocodingService();
