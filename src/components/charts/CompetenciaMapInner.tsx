"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const BRAND_COLOR = "#BEFF50";
const COMPETITOR_COLOR = "#9CA3AF";

type MarkerData = { id: string; label: string; lat: number; lng: number; isMarca: boolean };

function createIcon(isMarca: boolean) {
  return L.divIcon({
    className: "competencia-marker",
    html: `<div style="
      width: ${isMarca ? 24 : 18}px;
      height: ${isMarca ? 24 : 18}px;
      border-radius: 50%;
      background: ${isMarca ? BRAND_COLOR : COMPETITOR_COLOR};
      border: 2px solid ${isMarca ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)"};
      margin-left: -${isMarca ? 12 : 9}px;
      margin-top: -${isMarca ? 12 : 9}px;
    "></div>`,
    iconSize: [isMarca ? 24 : 18, isMarca ? 24 : 18],
    iconAnchor: [isMarca ? 12 : 9, isMarca ? 12 : 9],
  });
}

function MapFitBounds({ markers }: { markers: MarkerData[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const t = setTimeout(() => {
        const group = L.featureGroup(
          markers.map((m) => L.marker([m.lat, m.lng]))
        );
        map.fitBounds(group.getBounds().pad(0.15));
      }, 100);
      return () => clearTimeout(t);
    }
  }, [map, markers]);
  return null;
}

export function CompetenciaMapInner({ markers }: { markers: MarkerData[] }) {
  return (
    <div className="competencia-map-wrapper relative w-full aspect-[4/3] max-h-[220px] min-h-[180px] rounded-xl overflow-hidden border border-border [&_.leaflet-container]:rounded-xl [&_.leaflet-container]:!h-full">
      <MapContainer
        center={[40.4185, -3.7026]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFitBounds markers={markers} />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={createIcon(m.isMarca)}
          >
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
