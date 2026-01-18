import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface WaveformProps {
    data: { x: number; y: number }[];
    color?: string;
    name?: string;
    showGrid?: boolean;
}

const Waveform = ({ data, color = '#00f0ff', name = 'Signal', showGrid = true }: WaveformProps) => {
    return (
        <div className="glass-panel" style={{ width: '100%', height: '300px', padding: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={['auto', 'auto']}
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        tickFormatter={(val) => val.toFixed(1)}
                    />
                    <YAxis
                        domain={[-2, 2]}
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(20, 25, 40, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: color }}
                        labelStyle={{ color: '#fff' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="y"
                        stroke={color}
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={false} // Disable animation for real-time feel if needed, or keep for aesthetics
                        name={name}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Waveform;
