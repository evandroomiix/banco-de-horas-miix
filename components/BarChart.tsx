import React from 'react';

const formatHourDuration = (hours: number) => {
    if (hours < 0) return '0h 00m';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m.toString().padStart(2, '0')}m`;
};

interface ChartData {
  day: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
}

interface BarChartProps {
  data: ChartData[];
  maxHours: number;
  workDayHours: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, maxHours, workDayHours }) => {
  const goalLinePosition = (workDayHours / maxHours) * 100;

  return (
    <div className="w-full bg-slate-50 p-4 rounded-lg">
        <div className="relative flex justify-between items-end h-48 space-x-1">
            {goalLinePosition <= 100 && (
                <div className="absolute w-full border-t-2 border-dashed border-red-300" style={{ bottom: `${goalLinePosition}%` }}>
                    <span className="absolute -right-1 -top-5 text-xs text-red-400 font-bold">{formatHourDuration(workDayHours)}</span>
                </div>
            )}
            
            {data.map(item => {
                const totalHeight = (item.totalHours / maxHours) * 100;
                const regularHeight = (item.regularHours / item.totalHours) * 100;

                const regularBarHeight = (item.regularHours / maxHours) * 100;
                const overtimeBarHeight = (item.overtimeHours / maxHours) * 100;

                return (
                    <div key={item.day} className="group flex-1 flex flex-col items-center justify-end h-full">
                        <div
                            className="w-full flex flex-col justify-end"
                            style={{ height: `${totalHeight > 100 ? 100 : totalHeight}%` }}
                        >
                             <div 
                                className="w-full bg-green-300 rounded-t-sm transition-opacity duration-200 opacity-80 group-hover:opacity-100"
                                style={{ height: `${item.overtimeHours > 0 ? (overtimeBarHeight / totalHeight) * 100 : 0}%` }}
                            ></div>
                            <div 
                                className="w-full bg-indigo-400 rounded-t-sm transition-opacity duration-200 opacity-80 group-hover:opacity-100"
                                style={{ height: `${item.regularHours > 0 ? (regularBarHeight / totalHeight) * 100 : 0}%` }}
                            ></div>
                        </div>

                         <div className="absolute bottom-full mb-2 w-36 bg-slate-800 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <p className="font-bold">Dia {item.day}</p>
                            <p>Total: {formatHourDuration(item.totalHours)}</p>
                            <p>Extra: {formatHourDuration(item.overtimeHours)}</p>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                        </div>
                        
                        <span className="text-[10px] text-slate-500 mt-1">{item.day}</span>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default BarChart;
