"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Train, AlertTriangle, Clock, Bus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StopMonitoring {
  MonitoredStopVisit: {
    MonitoredVehicleJourney: {
      PublishedLineName: string[];
      DestinationName: string[];
      MonitoredCall: {
        ExpectedArrivalTime: string;
        AimedArrivalTime: string;
      };
    };
  }[];
}

interface ArrivalInfo {
  line: string;
  destination: string;
  expectedTime: Date;
  delay: number;
}

export default function TransportPage() {
  const [arrivals, setArrivals] = useState<ArrivalInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransportInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://prim.iledefrance-mobilites.fr/marketplace/stop-monitoring?MonitoringRef=STIF%3AStopPoint%3AQ%3A473921%3A&LineRef=STIF%3ALine%3A%3AC01742%3A",
          {
            headers: {
              "Accept": "application/json",
              "apikey": process.env.NEXT_PUBLIC_IDF_MOBILITES_API_KEY || ""
            }
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data: StopMonitoring = await response.json();
        
        const newArrivals = data.MonitoredStopVisit.map(visit => {
          const journey = visit.MonitoredVehicleJourney;
          const expectedTime = new Date(visit.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime);
          const aimedTime = new Date(visit.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime);
          const delay = Math.round((expectedTime.getTime() - aimedTime.getTime()) / 60000); // Délai en minutes

          return {
            line: journey.PublishedLineName[0],
            destination: journey.DestinationName[0],
            expectedTime,
            delay
          };
        });

        setArrivals(newArrivals);
      } catch (err) {
        setError("Impossible de récupérer les informations de transport");
      } finally {
        setLoading(false);
      }
    };

    fetchTransportInfo();
    // Rafraîchir toutes les minutes
    const interval = setInterval(fetchTransportInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDelayColor = (delay: number) => {
    if (delay <= 2) return "text-green-600";
    if (delay <= 5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center">
          Transport en Île-de-France
        </h1>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Bus className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Prochains passages</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {arrivals.map((arrival, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">{arrival.line}</span>
                          <span className="text-gray-600">→</span>
                          <span>{arrival.destination}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          Arrivée prévue : {formatTime(arrival.expectedTime)}
                        </div>
                      </div>
                      <div className={`flex items-center space-x-2 ${getDelayColor(arrival.delay)}`}>
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {arrival.delay > 0 
                            ? `+${arrival.delay} min`
                            : "À l'heure"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {arrivals.length === 0 && !loading && !error && (
                  <div className="text-center text-gray-500 py-8">
                    Aucun passage prévu pour le moment
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500">
              <p>Informations mises à jour en temps réel</p>
              <p>Source : Île-de-France Mobilités</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}