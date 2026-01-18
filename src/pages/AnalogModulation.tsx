import { useState, useMemo } from 'react';
import Waveform from '../components/Waveform';

const AnalogModulation = () => {
    const [cAmplitude, setCAmplitude] = useState(1);
    const [cFreq, setCFreq] = useState(10); // Carrier High Freq
    const [mAmplitude, setMAmplitude] = useState(1);
    const [mFreq, setMFreq] = useState(1); // Message Low Freq


    const { carrier, message, amSignal, fmSignal, pmSignal } = useMemo(() => {
        const points = 500;
        const c: { x: number; y: number }[] = [];
        const m: { x: number; y: number }[] = [];
        const am: { x: number; y: number }[] = [];
        const fm: { x: number; y: number }[] = [];
        const pm: { x: number; y: number }[] = [];

        for (let i = 0; i < points; i++) {
            const t = i / 50; // Time scaling

            // Message Signal: m(t) = Am * sin(2*pi*fm*t)
            const mt = mAmplitude * Math.sin(mFreq * t);
            m.push({ x: i, y: mt });

            // Carrier Signal: c(t) = Ac * sin(2*pi*fc*t)
            const ct = cAmplitude * Math.sin(cFreq * t);
            c.push({ x: i, y: ct });

            // AM: s(t) = (Ac + m(t)) * sin(2*pi*fc*t)
            // Simplified: (1 + m*sin(fmt)) * sin(fct) ... if Ac=1
            const amVal = (cAmplitude + mt) * Math.sin(cFreq * t);
            am.push({ x: i, y: amVal });

            // FM: s(t) = Ac * sin(2*pi*fc*t + beta * sin(2*pi*fm*t))
            // Frequency changes based on message amplitude
            // Integral of m(t) affects phase -> Frequency visualization
            const kf = 2; // Frequency sensitivity
            const integralM = -Math.cos(mFreq * t); // Integral of sin is -cos
            const fmVal = cAmplitude * Math.sin(cFreq * t + kf * integralM);
            // Better visual representation for education often just varies frequency directly in loop, 
            // but phase accumulation is more accurate. 
            // Let's stick to true FM equation: A * sin(wt + B*sin(w_m*t))
            fm.push({ x: i, y: fmVal });

            // PM: s(t) = Ac * sin(2*pi*fc*t + kp * m(t))
            const kp = 2; // Phase sensitivity
            const pmVal = cAmplitude * Math.sin(cFreq * t + kp * mt);
            pm.push({ x: i, y: pmVal });
        }

        return { carrier: c, message: m, amSignal: am, fmSignal: fm, pmSignal: pm };
    }, [cAmplitude, cFreq, mAmplitude, mFreq]);

    return (
        <div className="flex-col gap-md">
            <h1>Analog Modulation</h1>
            <p style={{ maxWidth: '700px' }}>
                Modulating an analog message signal onto a high-frequency analog carrier signal.
            </p>

            <div className="flex-row gap-lg" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>

                {/* Controls */}
                <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '300px', flex: 1 }}>
                    <h3>Parameters</h3>

                    <h4 style={{ color: 'var(--primary)', marginTop: '1rem' }}>Message Signal (Modulating)</h4>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Amplitude (Am)</label>
                        <input
                            type="range" min="0.5" max="2" step="0.1"
                            value={mAmplitude} onChange={(e) => setMAmplitude(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Frequency (fm)</label>
                        <input
                            type="range" min="0.5" max="3" step="0.1"
                            value={mFreq} onChange={(e) => setMFreq(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>

                    <h4 style={{ color: 'var(--secondary)', marginTop: '1.5rem' }}>Carrier Signal</h4>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Amplitude (Ac)</label>
                        <input
                            type="range" min="0.5" max="2" step="0.1"
                            value={cAmplitude} onChange={(e) => setCAmplitude(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--secondary)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Frequency (fc)</label>
                        <input
                            type="range" min="5" max="20" step="1"
                            value={cFreq} onChange={(e) => setCFreq(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--secondary)' }}
                        />
                    </div>
                </div>

                {/* Visualizations */}
                <div className="flex-col gap-md" style={{ flex: 2, minWidth: '400px' }}>

                    <div className="glass-panel" style={{ padding: '0.5rem 1rem' }}>
                        <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>Message Signal (Low Freq)</span>
                            <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>Carrier Signal (High Freq)</span>
                        </div>
                        <div style={{ height: '100px', position: 'relative' }}>
                            <Waveform data={message} color="var(--primary)" showGrid={false} />
                            <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', opacity: 0.3 }}>
                                <Waveform data={carrier} color="var(--secondary)" showGrid={false} />
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Amplitude Modulation (AM)</h4>
                        <div style={{ height: '120px' }}>
                            <Waveform data={amSignal} color="#fff" showGrid={false} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amplitude of carrier follows the amplitude of the message.</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Frequency Modulation (FM)</h4>
                        <div style={{ height: '120px' }}>
                            <Waveform data={fmSignal} color="#fff" showGrid={false} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Frequency of carrier changes based on message amplitude.</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Phase Modulation (PM)</h4>
                        <div style={{ height: '120px' }}>
                            <Waveform data={pmSignal} color="#fff" showGrid={false} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phase of carrier changes based on message amplitude.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnalogModulation;
