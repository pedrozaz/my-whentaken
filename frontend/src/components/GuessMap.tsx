import {useState} from "react";
import {MapContainer, TileLayer, Marker, useMapEvents} from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GuessMapProps {
    onLocationSelect: (lat: number, lon: number) => void;
}

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    useMapEvents({
        click(e) {
            const wrappedLatLng = e.latlng.wrap();
            setPosition(wrappedLatLng);
            onSelect(wrappedLatLng.lat, wrappedLatLng.lng);
        },
    });
    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function GuessMap({ onLocationSelect }: GuessMapProps) {
    return (
        <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={2}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            className='h-full w-full rounded-xl z-0'
            style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
            >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <LocationMarker onSelect={onLocationSelect} />
        </MapContainer>
    );
}