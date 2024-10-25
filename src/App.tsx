import React, { useState } from 'react';
import { Fuel, Car } from 'lucide-react';

function App() {
  const [kilometers, setKilometers] = useState<string>('');
  const [liters, setLiters] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculateConsumption = () => {
    const km = parseFloat(kilometers);
    const l = parseFloat(liters);
    
    if (km > 0 && l > 0) {
      const consumption = (l * 100) / km;
      setResult(Math.round(consumption * 100) / 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <Car className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Calculateur de Consommation
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance parcourue (km)
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
              Carburant consommé (L)
            </label>
            <input
              type="number"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Entrez les litres"
            />
          </div>

          <button
            onClick={calculateConsumption}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <Fuel className="w-5 h-5" />
            Calculer
          </button>

          {result !== null && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Résultat
              </h2>
              <p className="text-3xl font-bold text-indigo-600">
                {result} L/100km
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {result < 6 
                  ? "Excellente consommation ! 👏" 
                  : result < 8 
                    ? "Bonne consommation" 
                    : "Consommation élevée"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;