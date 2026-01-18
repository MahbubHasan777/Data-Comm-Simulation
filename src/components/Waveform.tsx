import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface WaveformProps {
    data: { x: number; y: number }[];
    color?: string;
    name?: string;
    showGrid?: boolean;
    height?: number | string;
}

const Waveform = ({ data, color = '#00f0ff', name = 'Signal', showGrid = true, height = '300px' }: WaveformProps) => {
    const [zoomLevel, setZoomLevel] = useState(1);

    // Calculate domain based on zoom level. 
    // Zoom 1 = Show all (or default range).
    // Zoom 2 = Show half, etc.
    // We'll limit the 'dataKey="x"' domain.
    const maxDataX = data.length > 0 ? data[data.length - 1].x : 100;
    const minDataX = data.length > 0 ? data[0].x : 0;
    const range = maxDataX - minDataX;

    // Zoom logic: Show a window of size (Range / ZoomLevel)
    // For simplicity, we'll just show the first (Range/Zoom) portion or center it.
    // Let's show from 0 to (Range / ZoomLevel) to allow inspecting details.
    // Or we could scroll? Recharts is tricky with scrolling without brush.
    // Let's implement a simple "Detail View" vs "Overview".

    const visibleMaxX = minDataX + (range / zoomLevel);

    // Filter data to only show visible range
    const visibleData = data.filter(d => d.x >= minDataX && d.x <= visibleMaxX);

    return (
        <div className="glass-panel" style={{ width: '100%', height: height, padding: '1rem', position: 'relative' }}>
            <div style={{ position: 'absolute', right: 20, top: 10, zIndex: 10, display: 'flex', gap: '5px' }}>
                <button
                    onClick={() => setZoomLevel(z => Math.max(1, z - 0.5))}
                    className="icon-btn"
                    title="Zoom Out"
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '4px', cursor: 'pointer', borderRadius: '4px' }}
                >
                    <ZoomOut size={16} />
                </button>
                <span style={{ fontSize: '0.8rem', padding: '4px', color: 'rgba(255,255,255,0.5)' }}>{zoomLevel}x</span>
                <button
                    onClick={() => setZoomLevel(z => Math.min(10, z + 0.5))}
                    className="icon-btn"
                    title="Zoom In"
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '4px', cursor: 'pointer', borderRadius: '4px' }}
                >
                    <ZoomIn size={16} />
                </button>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visibleData}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={[minDataX, visibleMaxX]}
                        allowDataOverflow
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        tickFormatter={(val) => val.toFixed(1)}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
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
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                        name={name}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Waveform;
