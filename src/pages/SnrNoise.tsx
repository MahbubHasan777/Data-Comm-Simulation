import { useState, useMemo } from 'react';
import Waveform from '../components/Waveform';
import { generateSineWave } from '../utils/signalGenerator';

const SnrNoise = () => {
    const [signalPower, setSignalPower] = useState(5);
    const [noisePower, setNoisePower] = useState(1);
    const [frequency, setFrequency] = useState(2);

    const { pureSignal, noiseSignal, combinedSignal, snrValue } = useMemo(() => {
        const pure = generateSineWave(frequency, signalPower);
        const noise = [];
        const combined = [];

        // Generate noise and combined signal
        for (let i = 0; i < pure.length; i++) {
            // Random noise between -noisePower and +noisePower
            const nVal = (Math.random() - 0.5) * 2 * noisePower;
            noise.push({ x: pure[i].x, y: nVal });
            combined.push({ x: pure[i].x, y: pure[i].y + nVal });
        }

        // Calculate SNR (dB) = 10 * log10(P_signal / P_noise)
        // Here we use amplitude roughly as power proxy for visualization simplicity, 
        // but strictly Power ~ Amplitude^2. 
        // Let's use P ~ Amplitude^2 for calculation.
        const pS = Math.pow(signalPower, 2);
        const pN = Math.pow(noisePower, 2);
        const snr = 10 * Math.log10(pS / pN);

        return { pureSignal: pure, noiseSignal: noise, combinedSignal: combined, snrValue: snr };
    }, [signalPower, noisePower, frequency]);

    return (
        <div className="flex-col gap-md">
            <h1>SNR & Noise</h1>
            <p style={{ maxWidth: '700px' }}>
                See how Noise affects a Signal. The Signal-to-Noise Ratio (SNR) determines the quality of communication.
            </p>

            <div className="flex-row gap-lg" style={{ flexWrap: 'wrap' }}>

                {/* Controls */}
                <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '300px', flex: 1 }}>
                    <h3>Parameters</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Frequency (Hz)</label>
                        <input
                            type="range" min="1" max="10" step="1"
                            value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                        <div className="flex-row" style={{ justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>1 Hz</span>
                            <span>{frequency} Hz</span>
                            <span>10 Hz</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Signal Power (Amplitude)</label>
                        <input
                            type="range" min="0" max="10" step="0.5"
                            value={signalPower} onChange={(e) => setSignalPower(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                        <div className="flex-row" style={{ justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>0 (Silence)</span>
                            <span>{signalPower}</span>
                            <span>10 (Strong)</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label" style={{ color: 'var(--accent)' }}>Noise Power</label>
                        <input
                            type="range" min="0" max="10" step="0.5"
                            value={noisePower} onChange={(e) => setNoisePower(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                        <div className="flex-row" style={{ justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>0 (Clean)</span>
                            <span>{noisePower}</span>
                            <span>10 (Noisy)</span>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', marginTop: '2rem' }}>
                        <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Calculated SNR</h4>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: snrValue > 10 ? 'var(--success)' : snrValue > 0 ? 'var(--warning)' : 'var(--accent)' }}>
                            {isFinite(snrValue) ? snrValue.toFixed(2) : '∞'} <span style={{ fontSize: '1rem' }}>dB</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', margin: 0 }}>
                            {snrValue > 20 ? 'Excellent Signal Quality' : snrValue > 10 ? 'Good Quality' : 'Poor / Unusable'}
                        </p>
                    </div>

                </div>

                {/* Visualizations */}
                <div className="flex-col gap-md" style={{ flex: 2, minWidth: '400px' }}>

                    <div style={{ position: 'relative' }}>
                        <p style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.8rem', color: 'var(--primary)', zIndex: 10 }}>Pure Signal</p>
                        <Waveform data={pureSignal} color="var(--primary)" showGrid={false} />
                    </div>

                    <div style={{ position: 'relative', marginTop: '-150px' }}>
                        {/* Overlap effect attempt or just Stacked? Stacked is clearer for education. */}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <p style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.8rem', color: 'var(--accent)', zIndex: 10 }}>Noise Only</p>
                        <Waveform data={noiseSignal} color="var(--accent)" showGrid={false} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <p style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.8rem', color: '#fff', zIndex: 10 }}>Combined (Signal + Noise)</p>
                        <Waveform data={combinedSignal} color="#fff" />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default SnrNoise;
