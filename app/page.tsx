"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";

// Import dynamique de la carte pour éviter les erreurs SSR
const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>
  ),
});

export default function Home() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchCity = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          city
        )}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data = await response.json();

      if (data.length === 0) {
        setError("Ville non trouvée");
        setLocation(null);
        return;
      }

      const [result] = data;
      setLocation([parseFloat(result.lat), parseFloat(result.lon)]);
    } catch (err) {
      setError("Impossible de trouver cette ville");
      setLocation(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-400 to-emerald-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center">
          Carte Interactive
        </h1>

        <Card className="p-6">
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Entrez le nom d'une ville..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchCity()}
            />
            <Button onClick={searchCity} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <MapComponent location={location} />
          </div>

          {location && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                Latitude: {location[0].toFixed(4)}, Longitude:{" "}
                {location[1].toFixed(4)}
              </span>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}