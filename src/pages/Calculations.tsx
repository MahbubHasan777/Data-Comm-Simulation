import { useState } from 'react';
import { Calculator } from 'lucide-react';

const Calculations = () => {
    // State for Transmission Time
    const [dataSize, setDataSize] = useState(1); // MB
    const [bandwidth, setBandwidth] = useState(10); // Mbps

    // State for Propagation Time
    const [distance, setDistance] = useState(100); // km
    const [speed, setSpeed] = useState(200000); // km/s (Fiber optics approx)

    // Calculations
    const sizeInBits = dataSize * 8 * 1000 * 1000;
    const bwInBits = bandwidth * 1000 * 1000;
    const transmissionTime = sizeInBits / bwInBits; // Seconds

    const propagationTime = distance / speed; // Seconds

    const totalLatency = transmissionTime + propagationTime;

    return (
        <div className="flex-col gap-md">
            <h1>Calculations: Delay & Latency</h1>
            <p style={{ maxWidth: '600px' }}>
                Calculate how long it takes for data to travel from Source to Destination.
                <br />
                <strong>Latency = Propagation Time + Transmission Time</strong> (+ Queuing/Processing)
            </p>

            <div className="flex-row gap-md" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>

                {/* Inputs */}
                <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minWidth: '350px' }}>
                    <h3>Parameters</h3>

                    <h4 style={{ color: 'var(--primary)', marginTop: '1rem' }}>Transmission (Data Size / Bandwidth)</h4>
                    <div className="flex-col gap-sm">
                        <div>
                            <label className="label">Data Size (MB)</label>
                            <input type="number" value={dataSize} onChange={(e) => setDataSize(Number(e.target.value))} className="input-field" style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label className="label">Bandwidth (Mbps)</label>
                            <input type="number" value={bandwidth} onChange={(e) => setBandwidth(Number(e.target.value))} className="input-field" style={{ width: '100%' }} />
                        </div>
                    </div>

                    <h4 style={{ color: 'var(--accent)', marginTop: '1.5rem' }}>Propagation (Distance / Speed)</h4>
                    <div className="flex-col gap-sm">
                        <div>
                            <label className="label">Distance (km)</label>
                            <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="input-field" style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label className="label">Propagation Speed (km/s)</label>
                            <input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="input-field" style={{ width: '100%' }} />
                            <small style={{ color: 'var(--text-muted)' }}>Light in vacuum: 300,000. Fiber: ~200,000.</small>
                        </div>
                    </div>
                </div>

                {/* Results Visualization */}
                <div className="flex-col gap-md" style={{ flex: 1, minWidth: '350px' }}>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3>Results Breakdown</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div className="result-card" style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1rem' }}>
                                <div className="label">Transmission Time</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{transmissionTime.toFixed(4)} s</div>
                                <div className="label" style={{ fontSize: '0.8rem' }}>{Math.round(transmissionTime * 1000)} ms</div>
                            </div>

                            <div className="result-card" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1rem' }}>
                                <div className="label">Propagation Time</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{propagationTime.toFixed(4)} s</div>
                                <div className="label" style={{ fontSize: '0.8rem' }}>{Math.round(propagationTime * 1000)} ms</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="label">TOTAL LATENCY</div>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                {totalLatency.toFixed(4)} s
                            </div>
                            <div className="label">{(totalLatency * 1000).toFixed(2)} ms</div>
                        </div>
                    </div>

                    {/* Visual Analogy */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div className="flex-col flex-center">
                                <Calculator size={32} />
                                <span style={{ fontSize: '0.8rem' }}>Source</span>
                            </div>

                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', margin: '0 1rem', position: 'relative' }}>
                                {/* Visualize Trans. Time as Length/Width of packet? */}
                                {/* Visualize Prop. Time as movement speed? */}
                                <div style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '-20px',
                                    transform: 'translateX(-50%)',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem'
                                }}>
                                    Traveling {distance} km
                                </div>
                            </div>

                            <div className="flex-col flex-center">
                                <Calculator size={32} />
                                <span style={{ fontSize: '0.8rem' }}>Dest</span>
                            </div>
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <strong>Transmission</strong> is putting bits onto the wire (Loading the truck).
                            <br />
                            <strong>Propagation</strong> is traveling across the wire (Driving to destination).
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Calculations;
