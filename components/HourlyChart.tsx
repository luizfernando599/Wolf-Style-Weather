import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ForecastData } from '../types';

interface HourlyChartProps {
  data: ForecastData;
}

const HourlyChart: React.FC<HourlyChartProps> = ({ data }) => {
  // Process data for the next 12 hours
  const chartData = data.time.slice(0, 12).map((time, index) => ({
    time: new Date(time).getHours() + ':00',
    wind: data.windSpeed[index],
    gusts: data.windGusts[index]
  }));

  return (
    <div className="w-full h-48 mt-4 bg-[#1e1e1e] border border-[#00708f]/30 rounded-xl p-2">
      <h3 className="text-[#00708f] text-xs font-bold uppercase mb-2 ml-2">12H Wind Forecast</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#888', fontSize: 10 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#191919', borderColor: '#00708f', color: '#fff' }}
            cursor={{ fill: 'rgba(0, 112, 143, 0.1)' }}
          />
          <Bar dataKey="wind" fill="#00708f" radius={[4, 4, 0, 0]} name="Wind (km/h)" />
          <Bar dataKey="gusts" fill="#00c2f7" radius={[4, 4, 0, 0]} name="Gusts (km/h)" fillOpacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyChart;