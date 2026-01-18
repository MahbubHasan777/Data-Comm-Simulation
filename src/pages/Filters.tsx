import { useState, useMemo } from 'react';
import Waveform from '../components/Waveform';

const Filters = () => {
    const [noiseLevel, setNoiseLevel] = useState(0.5);
    const [filterStrength, setFilterStrength] = useState(5); // Window size for Moving Average

    const { noisy, filtered } = useMemo(() => {
        const points = 500;
        const noisyData: { x: number; y: number }[] = [];
        const filteredData: { x: number; y: number }[] = [];

        let signalValues: number[] = [];

        for (let i = 0; i < points; i++) {
            const t = i / 20;
            // Original: Simple Sine
            const original = Math.sin(t);
            // Noise: Random
            // Use deterministic random-like for stability, or Math.random
            // Math.random() causes jitter on re-render, use pseudo-random or stable noise.
            // Let's use sim-stable noise: sin(t*13) * noise
            const noise = (Math.sin(t * 13) + Math.cos(t * 29)) * 0.5 * noiseLevel;

            const val = original + noise;
            noisyData.push({ x: i, y: val });
            signalValues.push(val);
        }

        // Apply Low Pass Filter (Moving Average)
        for (let i = 0; i < points; i++) {
            let sum = 0;
            let count = 0;
            // Average of last N points
            for (let j = 0; j < filterStrength; j++) {
                if (i - j >= 0) {
                    sum += signalValues[i - j];
                    count++;
                }
            }
            filteredData.push({ x: i, y: sum / count });
        }

        return { noisy: noisyData, filtered: filteredData };
    }, [noiseLevel, filterStrength]);

    return (
        <div className="flex-col gap-md">
            <h1>Filters</h1>
            <p style={{ maxWidth: '700px' }}>
                Removing noise from signals using filters.
                Demonstrating a <strong>Low Pass Filter</strong> (Simple Moving Average) to smooth out high-frequency noise.
            </p>

            <div className="flex-row gap-lg" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>

                {/* Controls */}
                <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '300px', flex: 1 }}>
                    <h3>Parameters</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Noise Level</label>
                        <input
                            type="range" min="0" max="2" step="0.1"
                            value={noiseLevel} onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--warning)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Filter Strength (Window Size)</label>
                        <input
                            type="range" min="1" max="20" step="1"
                            value={filterStrength} onChange={(e) => setFilterStrength(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--success)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Higher strength averages more points, smoothing better but adding delay/lag.
                        </p>
                    </div>
                </div>

                {/* Visualizations */}
                <div className="flex-col gap-md" style={{ flex: 2, minWidth: '400px' }}>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4 style={{ color: 'var(--warning)', margin: '0 0 1rem 0' }}>Noisy Input Signal</h4>
                        <Waveform data={noisy} color="var(--warning)" height="150px" />
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4 style={{ color: 'var(--success)', margin: '0 0 1rem 0' }}>Filtered Output (Cleaned)</h4>
                        <Waveform data={filtered} color="var(--success)" height="150px" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Filters;
