"use client";

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

  useEffect(() => {
    const fetchAirQuality = async (city:any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.waqi.info/feed/${city}/?token=3463dc0735ea564273ee1e723b2c50bd571eca8d`
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

    fetchAirQuality(city);
    // Rafraîchir toutes les 30 minutes
    const interval = setInterval(fetchAirQuality, 1800000);
    return () => clearInterval(interval);
  }, [city]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-100 text-green-800 border-green-200";
    if (aqi <= 100) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (aqi <= 150) return "bg-orange-100 text-orange-800 border-orange-200";
    if (aqi <= 200) return "bg-red-100 text-red-800 border-red-200";
    return "bg-purple-100 text-purple-800 border-purple-200";
  };

  const getAQIDescription = (aqi: number) => {
    if (aqi <= 50) return "Bon";
    if (aqi <= 100) return "Modéré";
    if (aqi <= 150) return "Mauvais pour les groupes sensibles";
    if (aqi <= 200) return "Mauvais";
    return "Très mauvais";
  };

  const formatPollutant = (pollutant: string) => {
    const pollutants: { [key: string]: string } = {
      pm25: "PM2.5",
      pm10: "PM10",
      o3: "Ozone",
      no2: "Dioxyde d'azote",
      so2: "Dioxyde de soufre",
      co: "Monoxyde de carbone"
    };
    return pollutants[pollutant] || pollutant;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    //fetchAirQuality(city);
    console.log(city)
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
                      Mis à jour le {formatTime(airQuality.time.iso)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-6 ${getAQIColor(airQuality.aqi)}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Indice de qualité de l'air</p>
                    <p className="text-3xl font-bold mt-2">{airQuality.aqi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">{getAQIDescription(airQuality.aqi)}</p>
                    <p className="text-sm mt-1">
                      Polluant principal : {formatPollutant(airQuality.dominentpol)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(airQuality.iaqi).map(([pollutant, data]) => (
                  <div
                    key={pollutant}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium">{formatPollutant(pollutant)}</p>
                    <p className="text-2xl font-bold mt-2">{data.v.toFixed(1)}</p>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-500">
                <p>Source : World Air Quality Index Project</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}