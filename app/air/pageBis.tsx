"use client"
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Wind, AlertTriangle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AirQualityData {
  aqi: number;
  dominentpol: string;
  iaqi: {
    [key: string]: { v: number };
  };
  city: {
    name: string;
    geo: [number, number];
  };
  time: {
    iso: string;
  };
}

export default function AirQualityPage() {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>(""); // État pour la ville recherchée

  const fetchAirQuality = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.waqi.info/feed/Paris/?token=3463dc0735ea564273ee1e723b2c50bd571eca8d`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await response.json();
      if (data.status === "ok") {
        setAirQuality(data.data);
      } else {
        throw new Error("Données invalides");
      }
    } catch (err) {
      setError("Impossible de récupérer les informations sur la qualité de l'air");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchAirQuality(city);
    }
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAirQuality(city);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-400 to-green-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center">
          Qualité de l'Air
        </h1>

        <form onSubmit={handleSearch} className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Entrez le nom de la ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-md p-2"
          />
          <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md">
            Rechercher
          </button>
        </form>

        <Card className="p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          ) : airQuality && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Wind className="h-6 w-6 text-green-600" />
                  <div>
                    <h2 className="text-xl font-semibold">{airQuality.city.name}</h2>
                    <p className="text-sm text-gray-500">
                      Mis à jour le {/* formatTime(airQuality.time.iso) */}
                    </p>
                  </div>
                </div>
              </div>
              {/* Reste du code pour afficher les données de qualité de l'air */}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}