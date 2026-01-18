import { useState, useMemo } from 'react';
import Waveform from '../components/Waveform';

const Demodulation = () => {
    const [carrierFreq, setCarrierFreq] = useState(10);
    const [carrierFreq, setCarrierFreq] = useState(10);

    const { modulated, rectified, envelope } = useMemo(() => {
        const points = 600;
        const modLines: { x: number; y: number }[] = [];
        const rectLines: { x: number; y: number }[] = [];
        const envLines: { x: number; y: number }[] = [];
        const origLines: { x: number; y: number }[] = [];

        for (let i = 0; i < points; i++) {
            const t = i / 50;

            // Original Message (Low Frequency)
            const message = Math.sin(1 * t);
            origLines.push({ x: i, y: message });

            // Modulated: (1 + m(t)) * sin(fc * t)
            // Carrier Amplitude = 1
            const amVal = (1 + 0.5 * message) * Math.sin(carrierFreq * t);
            modLines.push({ x: i, y: amVal });

            // Rectification (Diode)
            const rectVal = amVal > 0 ? amVal : 0;
            rectLines.push({ x: i, y: rectVal });

            // Envelope (RC Filter Sim)
            // Very simplified low-pass sim:
            // if rectVal > currentEnv, charge capacitor
            // else discharge slowly
            // For visualization, we'll just show the smoothed result which basically matches message + DC

            // Let's do a basic algorithmic smoothing for realism
            const envVal = 1 + 0.5 * message; // Ideal envelope
            envLines.push({ x: i, y: envVal });
        }

        return { modulated: modLines, rectified: rectLines, envelope: envLines, original: origLines };
    }, [carrierFreq]);

    return (
        <div className="flex-col gap-md">
            <h1>Demodulation (AM)</h1>
            <p style={{ maxWidth: '700px' }}>
                Demodulation is the process of extracting the original information-bearing signal from a carrier wave.
                In AM, this involves 3 stages: Receipt, Rectification, and Envelope Detection.
            </p>

            <div className="flex-row gap-lg" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>

                <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minWidth: '250px' }}>
                    <h3>Parameters</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Carrier Frequency (fc)</label>
                        <input
                            type="range" min="5" max="30" step="1"
                            value={carrierFreq} onChange={e => setCarrierFreq(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--secondary)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High frequency carrier transporting the data.</p>
                    </div>
                </div>

                <div className="flex-col gap-md" style={{ flex: 3, minWidth: '400px' }}>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4>1. Modulated Signal Input</h4>
                        <Waveform data={modulated} color="var(--secondary)" height="140px" />
                    </div>

                    <div className="flex-center">
                        <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>⬇️ Rectifier (Diode)</span>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4>2. Rectified Signal</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Negative half-cycles are removed.</p>
                        <Waveform data={rectified} color="var(--warning)" height="140px" />
                    </div>

                    <div className="flex-center">
                        <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>⬇️ Low Pass Filter</span>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4>3. Output (Envelope)</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High frequencies smoothed out, recovering the message.</p>
                        <Waveform data={envelope} color="var(--success)" height="140px" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Demodulation;
