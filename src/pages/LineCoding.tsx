import { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const LineCoding = () => {
    const [dataStr, setDataStr] = useState('10110100');
    const [encoding, setEncoding] = useState('NRZ-L');

    const chartData = useMemo(() => {
        const bits = dataStr.split('').map(b => parseInt(b));
        const points: { x: number; y: number }[] = [];
        let currentLevel = 1; // For differential schemes

        // Helper to check if a scheme is state-dependent globally (like AMI, MLT-3)
        // or if we can process it purely per-bit in a standard loop.
        // Actually, let's just use separate logic for complex ones to be clean.

        if (encoding === 'AMI') {
            let lastOne = -1; // Start assume last 1 was negative, so next is positive
            bits.forEach((bit, i) => {
                if (bit === 0) {
                    points.push({ x: i, y: 0 });
                    points.push({ x: i + 1, y: 0 });
                } else {
                    lastOne *= -1;
                    points.push({ x: i, y: lastOne });
                    points.push({ x: i + 1, y: lastOne });
                }
            });
            return points;
        }

        if (encoding === 'Pseudoternary') {
            let lastZero = -1;
            bits.forEach((bit, i) => {
                if (bit === 1) {
                    points.push({ x: i, y: 0 });
                    points.push({ x: i + 1, y: 0 });
                } else {
                    lastZero *= -1;
                    points.push({ x: i, y: lastZero });
                    points.push({ x: i + 1, y: lastZero });
                }
            });
            return points;
        }

        if (encoding === 'MLT-3') {
            let level = 0;
            let lastNonZero = -1;
            bits.forEach((bit, i) => {
                if (bit === 1) {
                    if (level !== 0) {
                        lastNonZero = level;
                        level = 0;
                    } else {
                        level = (lastNonZero === 1) ? -1 : 1;
                    }
                }
                points.push({ x: i, y: level });
                points.push({ x: i + 1, y: level });
            });
            return points;
        }

        // Standard schemes
        bits.forEach((bit, i) => {
            const startX = i;
            const endX = i + 1;

            switch (encoding) {
                case 'NRZ-L':
                    // 0 -> High (+1), 1 -> Low (-1)
                    points.push({ x: startX, y: bit === 0 ? 1 : -1 });
                    points.push({ x: endX, y: bit === 0 ? 1 : -1 });
                    break;

                case 'NRZ-I':
                    // Invert on 1
                    if (bit === 1) currentLevel *= -1;
                    points.push({ x: startX, y: currentLevel });
                    points.push({ x: endX, y: currentLevel });
                    break;

                case 'RZ':
                    // 0 -> Low to Zero, 1 -> High to Zero. But typically RZ is:
                    // 0 is usually negative-to-zero or just zero? 
                    // Standard Unipolar RZ: 1=High->0, 0=0
                    // Polar RZ: 1=High->0, 0=Low->0
                    // Let's implement Polar RZ
                    const val = bit === 1 ? 1 : -1;
                    points.push({ x: startX, y: val });
                    points.push({ x: startX + 0.5, y: val });
                    points.push({ x: startX + 0.5, y: 0 });
                    points.push({ x: endX, y: 0 });
                    break;

                case 'Manchester':
                    // 0: High->Low, 1: Low->High (Thomas) or IEEE 802.3 is opposite.
                    // Let's use IEEE 802.3: 1 = High->Low, 0 = Low->High? 
                    // Actually IEEE 802.3: 1 is Low->High? 
                    // Correction: 
                    // G.E. Thomas: 0 = High->Low, 1 = Low->High
                    // IEEE 802.3: 1 = High->Low, 0 = Low->High
                    // Let's stick to the previous implementation logic: 
                    // 0: 1 -> -1 (High to Low)
                    // 1: -1 -> 1 (Low to High)
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

                case 'Diff-Manchester':
                    // Transition at center always.
                    // 0: Transition at start
                    // 1: No transition at start

                    if (bit === 0) currentLevel *= -1;
                    points.push({ x: startX, y: currentLevel });
                    points.push({ x: startX + 0.5, y: currentLevel });

                    currentLevel *= -1; // Center transition
                    points.push({ x: startX + 0.5, y: currentLevel });
                    points.push({ x: endX, y: currentLevel });
                    break;
            }
        });

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
                            <option value="Pseudoternary">Pseudoternary</option>
                            <option value="MLT-3">MLT-3 (Multi-Level Transmit 3)</option>
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
