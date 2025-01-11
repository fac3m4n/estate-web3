import { useState } from "react";
import { AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";

interface Property {
  id: string;
  title: string;
  price: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface PropertyMarkersProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onMarkerClick: (id: string) => void;
}

export function PropertyMarkers({ properties, selectedPropertyId, onMarkerClick }: PropertyMarkersProps) {
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  return (
    <>
      {properties.map(property => (
        <AdvancedMarker
          key={property.id}
          position={property.coordinates}
          onClick={() => onMarkerClick(property.id)}
          onMouseEnter={() => setHoveredProperty(property.id)}
          onMouseLeave={() => setHoveredProperty(null)}
        >
          <Pin
            background={selectedPropertyId === property.id ? "#22ccff" : "#ff4444"}
            borderColor={selectedPropertyId === property.id ? "#1e89a1" : "#cc3333"}
            glyphColor={selectedPropertyId === property.id ? "#0f677a" : "#fff"}
            scale={hoveredProperty === property.id ? 1.3 : 1}
          />
          {(selectedPropertyId === property.id || hoveredProperty === property.id) && (
            <InfoWindow>
              <div className="p-2">
                <h3 className="font-bold">{property.title}</h3>
                <p className="text-sm">${property.price.toLocaleString()} tBUSD</p>
              </div>
            </InfoWindow>
          )}
        </AdvancedMarker>
      ))}
    </>
  );
}
