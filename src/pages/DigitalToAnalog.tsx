import { useState, useMemo } from 'react';
import Waveform from '../components/Waveform';

const DigitalToAnalog = () => {
    const [bits, setBits] = useState("10110");
    const [amplitude, setAmplitude] = useState(1);
    const [frequency, setFrequency] = useState(2); // Base frequency

    const { askData, fskData, pskData } = useMemo(() => {
        const ask: { x: number; y: number }[] = [];
        const fsk: { x: number; y: number }[] = [];
        const psk: { x: number; y: number }[] = [];

        const bitArray = bits.split('').map(b => b === '1' ? 1 : 0);
        const bitDuration = 100; // samples per bit

        let x = 0;

        bitArray.forEach((bit) => {
            for (let i = 0; i < bitDuration; i++) {
                const time = x / 50; // Scaling time x-axis

                // ASK: Amplitude Shift Keying
                // If 1 -> A*sin(wt), If 0 -> 0*sin(wt) (or reduced amplitude)
                const ampASK = bit === 1 ? amplitude : 0;
                ask.push({ x, y: ampASK * Math.sin(frequency * time) });

                // FSK: Frequency Shift Keying
                // If 1 -> High Freq, If 0 -> Low Freq
                const freqFSK = bit === 1 ? frequency * 2 : frequency;
                fsk.push({ x, y: amplitude * Math.sin(freqFSK * time) });

                // PSK: Phase Shift Keying
                // If 1 -> sin(wt), If 0 -> sin(wt + PI)
                const phasePoints = bit === 1 ? 0 : Math.PI;
                psk.push({ x, y: amplitude * Math.sin(frequency * time + phasePoints) });

                x++;
            }
        });

        return { askData: ask, fskData: fsk, pskData: psk };
    }, [bits, amplitude, frequency]);

    return (
        <div className="flex-col gap-md">
            <h1>Digital to Analog Modulation</h1>
            <p style={{ maxWidth: '700px' }}>
                Converting digital data (0s and 1s) into analog signals for transmission over analog media (like radio or telephone lines).
            </p>

            <div className="flex-row gap-lg" style={{ flexWrap: 'wrap' }}>

                {/* Controls */}
                <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '300px', flex: 1 }}>
                    <h3>Parameters</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Binary Data</label>
                        <input
                            type="text"
                            value={bits}
                            onChange={(e) => setBits(e.target.value.replace(/[^01]/g, ''))}
                            maxLength={8}
                            style={{
                                width: '100%', padding: '0.8rem', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white',
                                fontFamily: 'monospace', letterSpacing: '2px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Carrier Amplitude (A)</label>
                        <input
                            type="range" min="0.5" max="2" step="0.1"
                            value={amplitude} onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Carrier Frequency (f)</label>
                        <input
                            type="range" min="1" max="5" step="0.5"
                            value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>
                </div>

                {/* Visualizations */}
                <div className="flex-col gap-md" style={{ flex: 2, minWidth: '400px' }}>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4 style={{ color: 'var(--primary)', margin: '0 0 1rem 0' }}>ASK (Amplitude Shift Keying)</h4>
                        <div style={{ height: '150px' }}>
                            <Waveform data={askData} color="var(--primary)" showGrid={false} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amplitude changes based on bit value (1 = High A, 0 = 0).</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4 style={{ color: 'var(--secondary)', margin: '0 0 1rem 0' }}>FSK (Frequency Shift Keying)</h4>
                        <div style={{ height: '150px' }}>
                            <Waveform data={fskData} color="var(--secondary)" showGrid={false} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Frequency changes based on bit value (1 = High f, 0 = Low f).</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4 style={{ color: 'var(--accent)', margin: '0 0 1rem 0' }}>PSK (Phase Shift Keying)</h4>
                        <div style={{ height: '150px' }}>
                            <Waveform data={pskData} color="var(--accent)" showGrid={false} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phase shifts 180° when bit value changes (or for specific bit).</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DigitalToAnalog;
