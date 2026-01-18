import { useState, useMemo } from 'react';
import Waveform from '../components/Waveform';
import { generateSineWave, generateSquareWave } from '../utils/signalGenerator';
import { Waves, Binary } from 'lucide-react';

const SignalBasics = () => {
    const [signalType, setSignalType] = useState<'analog' | 'digital'>('analog');
    const [frequency, setFrequency] = useState(1);
    const [amplitude, setAmplitude] = useState(1);

    const data = useMemo(() => {
        if (signalType === 'analog') {
            return generateSineWave(frequency, amplitude);
        } else {
            return generateSquareWave(frequency, amplitude);
        }
    }, [signalType, frequency, amplitude]);

    return (
        <div className="flex-col gap-md">
            <h1>Signal Basics</h1>
            <p style={{ maxWidth: '600px' }}>
                Understand the difference between Analog (Continuous) and Digital (Discrete) signals by manipulating the parameters below.
            </p>

            <div className="flex-row gap-md" style={{ flexWrap: 'wrap' }}>
                {/* Controls Panel */}
                <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '300px', flex: 1 }}>
                    <h3>Controls</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Signal Type</label>
                        <div className="flex-row gap-md">
                            <button
                                onClick={() => setSignalType('analog')}
                                style={{
                                    background: signalType === 'analog' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: signalType === 'analog' ? '#000' : 'var(--text-main)',
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Waves size={16} /> Analog
                            </button>
                            <button
                                onClick={() => setSignalType('digital')}
                                style={{
                                    background: signalType === 'digital' ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
                                    color: signalType === 'digital' ? '#fff' : 'var(--text-main)',
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Binary size={16} /> Digital
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                            Frequency: {frequency} Hz
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={frequency}
                            onChange={(e) => setFrequency(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                            Amplitude: {amplitude} V
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={amplitude}
                            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>
                </div>

                {/* Visualization Panel */}
                <div style={{ flex: 2, minWidth: '400px' }}>
                    <Waveform
                        data={data}
                        color={signalType === 'analog' ? '#00f0ff' : '#7000ff'}
                        name={signalType === 'analog' ? 'Sine Wave' : 'Square Wave'}
                    />
                    <div className="glass-panel" style={{ marginTop: '1rem', padding: '1rem' }}>
                        <h4>What is happening?</h4>
                        <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                            {signalType === 'analog'
                                ? "An Analog signal is continuous and can take any value within a range. It represents real-world phenomena like sound or light. The sine wave is the most fundamental analog signal."
                                : "A Digital signal is discrete and represents data as a sequence of distinct values (typically 0 and 1). It is less susceptible to noise but requires more bandwidth for transmission."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignalBasics;
