import { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const LineCoding = () => {
    const [dataStr, setDataStr] = useState('10110100');
    const [encoding, setEncoding] = useState('NRZ-L');

    const chartData = useMemo(() => {
        // Generate points for the graph based on encoding
        const points: { x: number; y: number }[] = [];
        const bits = dataStr.split('').map(b => parseInt(b));
        let currentLevel = 1; // For differential

        bits.forEach((bit, i) => {
            const startX = i;
            const endX = i + 1;

            switch (encoding) {
                case 'NRZ-L': // 0 -> High, 1 -> Low (or vice versa, typically 1=High in simple terms, but strictly L is Level)
                    // Let's use: 0 = +1V, 1 = -1V (Standard RS-232, but often simplified as 1=High)
                    // Standard: 1 is represented by one voltage level, 0 by another.
                    // Let's do: 1 -> +1, 0 -> -1
                    points.push({ x: startX, y: bit === 1 ? -1 : 1 }); // 0=High (+), 1=Low (-) usually or 1 is High? 
                    // Let's stick to textbook: NRZ-L: Level depends on bit. 0 = High, 1 = Low usually. 
                    points.push({ x: endX, y: bit === 1 ? -1 : 1 });
                    break;

                case 'NRZ-I': // Invert on 1
                    if (bit === 1) currentLevel *= -1;
                    points.push({ x: startX, y: currentLevel });
                    points.push({ x: endX, y: currentLevel });
                    break;

                case 'RZ': // Return to Zero
                    // 0: Low to Zero, 1: High to Zero
                    // First half
                    points.push({ x: startX, y: bit === 1 ? 1 : -1 });
                    points.push({ x: startX + 0.5, y: bit === 1 ? 1 : -1 });
                    // Second half (Return to Zero)
                    points.push({ x: startX + 0.5, y: 0 });
                    points.push({ x: endX, y: 0 });
                    break;

                case 'Manchester': // 0: High->Low, 1: Low->High (IEEE 802.3)
                    // 0
                    if (bit === 0) {
                        points.push({ x: startX, y: 1 });
                        points.push({ x: startX + 0.5, y: 1 });
                        points.push({ x: startX + 0.5, y: -1 });
                        points.push({ x: endX, y: -1 });
                    } else {
                        points.push({ x: startX, y: -1 });
                        points.push({ x: startX + 0.5, y: -1 });
                        points.push({ x: startX + 0.5, y: 1 });
                        points.push({ x: endX, y: 1 });
                    }
                    break;

                case 'Diff-Manchester': // Inversion at start of bit if 0. Always transition at middle.
                    // If 0, transition at beginning.
                    if (bit === 0) currentLevel *= -1;
                    points.push({ x: startX, y: currentLevel });
                    points.push({ x: startX + 0.5, y: currentLevel });
                    currentLevel *= -1; // Always transition at middle
                    points.push({ x: startX + 0.5, y: currentLevel });
                    points.push({ x: endX, y: currentLevel });
                    break;

                case 'AMI': // Alternate Mark Inversion. 0 -> 0V. 1 -> Alternating +1/-1
                    if (bit === 0) {
                        points.push({ x: startX, y: 0 });
                        points.push({ x: endX, y: 0 });
                    } else {
                        currentLevel = (i === 0 || currentLevel === 0) ? 1 : (currentLevel === 1 ? -1 : 1);
                        // Wait, AMI state needs to be maintained per '1' occurrence, not i. 
                        // Quick hack: recalculate efficiently or use state outside switch?
                        // Let's refine AMI logic below chartData.
                    }
                    break;
            }
        });

        // AMI post-fix since it needs history
        if (encoding === 'AMI') {
            const amiPoints: { x: number; y: number }[] = [];
            let lastOne = -1; // Start assume last was -1 so next is +1
            bits.forEach((bit, i) => {
                if (bit === 0) {
                    amiPoints.push({ x: i, y: 0 });
                    amiPoints.push({ x: i + 1, y: 0 });
                } else {
                    lastOne *= -1;
                    amiPoints.push({ x: i, y: lastOne });
                    amiPoints.push({ x: i + 1, y: lastOne });
                }
            });
            return amiPoints;
        }

        return points;
    }, [dataStr, encoding]);

    return (
        <div className="flex-col gap-md">
            <h1>Line Coding</h1>
            <p>Visualizing different schemes to represent digital data on transmission lines.</p>

            <div className="flex-row gap-md" style={{ alignItems: 'flex-start' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '300px' }}>
                    <h3>Configuration</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Binary Data</label>
                        <input
                            type="text"
                            value={dataStr}
                            onChange={(e) => setDataStr(e.target.value.replace(/[^01]/g, ''))}
                            style={{
                                width: '100%', padding: '0.8rem', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white',
                                fontFamily: 'monospace', letterSpacing: '2px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Encoding Scheme</label>
                        <select
                            value={encoding}
                            onChange={(e) => setEncoding(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#1a2035', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <option value="NRZ-L">NRZ-L (Non-Return-to-Zero Level)</option>
                            <option value="NRZ-I">NRZ-I (Non-Return-to-Zero Invert)</option>
                            <option value="RZ">RZ (Return-to-Zero)</option>
                            <option value="Manchester">Manchester</option>
                            <option value="Diff-Manchester">Differential Manchester</option>
                            <option value="AMI">AMI (Alternate Mark Inversion)</option>
                        </select>
                    </div>
                </div>

                <div className="glass-panel" style={{ flex: 1, height: '400px', padding: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis
                                dataKey="x"
                                type="number"
                                domain={[0, dataStr.length]}
                                ticks={[...Array(dataStr.length + 1).keys()]}
                                stroke="rgba(255,255,255,0.5)"
                            />
                            <YAxis domain={[-1.5, 1.5]} ticks={[-1, 0, 1]} stroke="rgba(255,255,255,0.5)" />
                            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
                            <Tooltip content={<></>} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
                            <Line
                                type="stepAfter" // Use stepAfter for clean digital transitions
                                dataKey="y"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <div className="flex-row" style={{ justifyContent: 'space-between', padding: '0 10px', marginTop: '-20px', position: 'relative', zIndex: 10 }}>
                        {dataStr.split('').map((bit, i) => (
                            <div key={i} style={{ width: `${100 / dataStr.length}%`, textAlign: 'center', color: 'var(--text-muted)' }}>{bit}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineCoding;
