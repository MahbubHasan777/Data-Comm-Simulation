import { useState, useMemo } from 'react';
import Waveform from '../components/Waveform';

const Demodulation = () => {
    const [carrierFreq, setCarrierFreq] = useState(10);

    const { modulated, rectified, envelope } = useMemo(() => {
        const points = 500;
        const modLines: { x: number; y: number }[] = [];
        const rectLines: { x: number; y: number }[] = [];
        const envLines: { x: number; y: number }[] = [];

        for (let i = 0; i < points; i++) {
            const t = i / 50;

            // 1. Simulate an AM signal: (1 + 0.5 * sin(t)) * sin(fc * t)
            // Message freq = 1 (fixed for demo)
            const message = Math.sin(1 * t);
            const amVal = (1 + 0.5 * message) * Math.sin(carrierFreq * t);

            modLines.push({ x: i, y: amVal });

            // 2. Rectification (Diode): Allow only positive half
            const rectVal = amVal > 0 ? amVal : 0;
            rectLines.push({ x: i, y: rectVal });

            // 3. Envelope Detection (Low Pass Filter / Capacitor)
            // Ideally tracks peaks.
            // Simplified sim: just the message + DC offset
            // We want to show "extracted" signal.
            const envVal = 1 + 0.5 * message;
            envLines.push({ x: i, y: envVal });
        }

        return { modulated: modLines, rectified: rectLines, envelope: envLines };
    }, [carrierFreq]);

    return (
        <div className="flex-col gap-md">
            <h1>Demodulation (AM)</h1>
            <p style={{ maxWidth: '700px' }}>
                Recovering the original message signal from the modulated carrier.
                AM Demodulation uses an Envelope Detector (Diode + RC Filter).
            </p>

            <div className="flex-col gap-md">

                {/* Control */}
                <div className="glass-panel" style={{ padding: '1rem', width: 'fit-content' }}>
                    <label className="label">Carrier Frequency to Filter Out</label>
                    <input
                        type="range" min="5" max="20" step="1"
                        value={carrierFreq} onChange={e => setCarrierFreq(Number(e.target.value))}
                    />
                </div>

                {/* Steps Visualized */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                    <h4>1. Received Modulated Signal</h4>
                    <Waveform data={modulated} color="#fff" height="150px" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                        ⬇️ Diode (Rectification)
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1rem' }}>
                    <h4>2. Rectified Signal (Positive Half)</h4>
                    <Waveform data={rectified} color="var(--warning)" height="150px" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                        ⬇️ Low Pass Filter (Envelope Detection)
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1rem' }}>
                    <h4>3. Demodulated Output (Envelope)</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>The high-frequency carrier is removed, leaving the original message.</p>
                    <Waveform data={envelope} color="var(--success)" height="150px" />
                </div>

            </div>
        </div>
    );
};

export default Demodulation;
