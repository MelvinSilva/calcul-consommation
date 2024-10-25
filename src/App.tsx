import React, { useState, useEffect } from "react";
import {
  Fuel,
  Car,
  Calendar,
  Trash2,
  LandPlot,
  CircleSlash2,
} from "lucide-react";

type ConsumptionEntry = {
  id: string;
  date: string;
  kilometers: number;
  liters: number;
  consumption: number;
};

function App() {
  const [kilometers, setKilometers] = useState<string>("");
  const [liters, setLiters] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [history, setHistory] = useState<ConsumptionEntry[]>([]);
  const [averageConsumption, setAverageConsumption] = useState<number>(0);

  // Charger l'historique depuis le localStorage lors du montage du composant
  useEffect(() => {
    const savedHistory = localStorage.getItem("consumptionHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder l'historique dans le localStorage à chaque mise à jour de l'historique
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("consumptionHistory", JSON.stringify(history));
    }
  }, [history]);

  // Calculer la moyenne cumulée de la consommation à chaque modification de l'historique
  useEffect(() => {
    if (history.length > 0) {
      const totalConsumption = history.reduce(
        (sum, entry) => sum + entry.consumption,
        0
      );
      setAverageConsumption(
        Math.round((totalConsumption / history.length) * 100) / 100
      );
    } else {
      setAverageConsumption(0);
    }
  }, [history]);

  const calculateConsumption = () => {
    const km = parseFloat(kilometers);
    const l = parseFloat(liters);

    if (km > 0 && l > 0) {
      const consumption = (l * 100) / km;
      const entry: ConsumptionEntry = {
        id: Date.now().toString(),
        date,
        kilometers: km,
        liters: l,
        consumption: Math.round(consumption * 100) / 100,
      };

      setHistory((prev) =>
        [...prev, entry].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setKilometers("");
      setLiters("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  const deleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  const getConsumptionClass = (consumption: number) => {
    if (consumption < 5) return "text-green-600";
    if (consumption <= 7) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-3">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="flex items-center gap-3 mb-8">
            <Car className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Calculateur conso
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Entrez la distance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carburant (L)
              </label>
              <input
                type="number"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Entrez les litres"
              />
            </div>
          </div>

          <button
            onClick={calculateConsumption}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <Fuel className="w-5 h-5" />
            Calculer
          </button>
        </div>

        {history.length > 0 && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Conso moyenne
              </h2>
              <p className="text-gray-600 flex items-center">
                <Fuel className="w-5 h-5 mr-2 text-indigo-600" />
                <span
                  className={`font-bold ${getConsumptionClass(
                    averageConsumption
                  )}`}
                >
                  {averageConsumption} L/100km
                </span>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Historique
              </h2>
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between border-b border-gray-200 pb-3"
                  >
                    <div className="text-sm flex flex-row">
                      <span className="font-semibold">
                        {new Date(entry.date).toLocaleDateString()} :&nbsp;
                      </span>{" "}
                      <Fuel className="w-4 h-4 text-indigo-600" />
                      &nbsp;{entry.liters} L&nbsp;
                      <LandPlot className="w-4 h-4 text-indigo-600" />
                      &nbsp;{entry.kilometers} km&nbsp;
                      <span
                        className={`font-bold flex flex-row ${getConsumptionClass(
                          entry.consumption
                        )}`}
                      >
                        <CircleSlash2 className="w-4 h-4 text-indigo-600" />{" "}
                        &nbsp;
                        {entry.consumption} L
                      </span>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
