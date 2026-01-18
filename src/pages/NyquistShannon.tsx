import { useState } from 'react';

const NyquistShannon = () => {
    const [bandwidth, setBandwidth] = useState(3000);
    const [levels, setLevels] = useState(2);
    const [snrDb, setSnrDb] = useState(30);

    const nyquistRate = 2 * bandwidth * Math.log2(levels);

    const snrLinear = Math.pow(10, snrDb / 10);
    const shannonCapacity = bandwidth * Math.log2(1 + snrLinear);

    return (
        <div className="flex-col gap-md">
            <h1>Nyquist & Shannon Limits</h1>
            <p style={{ maxWidth: '700px' }}>
                Calculate the theoretical maximum data rate of a channel using Nyquist's Theorem (noiseless) and Shannon's Capacity (noisy).
            </p>

            <div className="flex-row gap-md" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>

                {/* INPUTS */}
                <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minWidth: '300px' }}>
                    <h3>Channel Parameters</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Bandwidth (Hz)</label>
                        <input
                            type="number"
                            value={bandwidth}
                            onChange={(e) => setBandwidth(Number(e.target.value))}
                            className="input-field"
                            style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Signal Levels (L) - for Nyquist</label>
                        <input
                            type="number"
                            value={levels}
                            onChange={(e) => setLevels(Number(e.target.value))}
                            className="input-field"
                            style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">SNR (dB) - for Shannon</label>
                        <div className="flex-row gap-md" style={{ alignItems: 'center' }}>
                            <input
                                type="range"
                                min="0"
                                max="60"
                                step="1"
                                value={snrDb}
                                onChange={(e) => setSnrDb(Number(e.target.value))}
                                style={{ flex: 1, accentColor: 'var(--accent)' }}
                            />
                            <span style={{ minWidth: '50px', textAlign: 'right' }}>{snrDb} dB</span>
                        </div>
                    </div>

                </div>

                {/* RESULTS */}
                <div className="flex-col gap-md" style={{ flex: 1, minWidth: '300px' }}>

                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <h4 style={{ color: 'var(--primary)' }}>Nyquist Bit Rate (Noiseless)</h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            Formula: C = 2 × B × log₂(L)
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                            {Math.round(nyquistRate).toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>bps</span>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
                        <h4 style={{ color: 'var(--accent)' }}>Shannon Capacity (Noisy)</h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            Formula: C = B × log₂(1 + SNR)
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                            {Math.round(shannonCapacity).toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>bps</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                            Note: SNR (linear) = 10^(dB/10) = {Math.round(snrLinear).toLocaleString()}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default NyquistShannon;
