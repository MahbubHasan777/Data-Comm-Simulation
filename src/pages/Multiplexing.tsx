import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Tablet, Plus, Trash2, Activity } from 'lucide-react';
import Waveform from '../components/Waveform';

interface Sender {
    id: number;
    name: string;
    data: string;
    color: string;
    frequency?: number; // For FDM
}

const Multiplexing = () => {
    const [mode, setMode] = useState<'TDM' | 'FDM'>('TDM');
    const [senders, setSenders] = useState<Sender[]>([
        { id: 1, name: 'S1', data: 'A', color: 'var(--primary)', frequency: 1 },
        { id: 2, name: 'S2', data: 'B', color: 'var(--secondary)', frequency: 2 },
        { id: 3, name: 'S3', data: 'C', color: 'var(--accent)', frequency: 3 }
    ]);

    const [isSimulating, setIsSimulating] = useState(false);

    // TDM State
    const [muxOutput, setMuxOutput] = useState<any[]>([]);
    const [currentFrame, setCurrentFrame] = useState<number>(0);

    // FDM Visualization
    // Generate combined signal graph
    const fdmData = useMemo(() => {
        const points = 200;
        const data: { x: number, y: number }[] = [];
        for (let i = 0; i < points; i++) {
            const t = i / 20;
            let y = 0;
            senders.forEach(s => {
                // Simple Sinewave for each sender at their frequency
                y += Math.sin(t * (s.frequency || 1) * 2);
            });
            data.push({ x: i, y });
        }
        return data;
    }, [senders]);

    const startTDM = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setMuxOutput([]);

        let frames = 0;
        const maxFrames = 5;

        const interval = setInterval(() => {
            frames++;
            setCurrentFrame(frames);

            // Create a frame from all senders (Round Robin)
            const framePackets = senders.map(s => ({
                id: Math.random(),
                data: s.data,
                color: s.color,
                senderId: s.id
            }));

            setMuxOutput(prev => [...prev, ...framePackets]);

            if (frames >= maxFrames) {
                clearInterval(interval);
                setIsSimulating(false);
            }
        }, 1500);
    };

    return (
        <div className="flex-col gap-md">
            <h1>Multiplexing: Under the Hood</h1>
            <p style={{ maxWidth: '700px' }}>
                Select a technique to see how multiple signals share a single medium.
            </p>

            {/* Mode Toggle */}
            <div className="flex-row gap-md">
                <button
                    onClick={() => setMode('TDM')}
                    style={{ background: mode === 'TDM' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: mode === 'TDM' ? '#000' : '#fff' }}
                >
                    Time Division (TDM)
                </button>
                <button
                    onClick={() => setMode('FDM')}
                    style={{ background: mode === 'FDM' ? 'var(--secondary)' : 'rgba(255,255,255,0.1)', color: mode === 'FDM' ? '#fff' : '#fff' }}
                >
                    Frequency Division (FDM)
                </button>
            </div>

            {/* TDM Section */}
            {mode === 'TDM' && (
                <div className="flex-col gap-lg">
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h3>Time Division Multiplexing (TDM)</h3>
                        <p>In TDM, the channel is divided into time slots. Each user gets the full bandwidth for a short burst of time.</p>
                        <button onClick={startTDM} disabled={isSimulating} style={{ background: 'var(--success)', color: '#000' }}>
                            {isSimulating ? 'Sending Frames...' : 'Start TDM Simulation'}
                        </button>
                    </div>

                    <div className="flex-row gap-lg" style={{ alignItems: 'flex-start' }}>
                        {/* Inputs */}
                        <div className="flex-col gap-sm">
                            <h4>Inputs</h4>
                            {senders.map(s => (
                                <div key={s.id} className="glass-panel" style={{ padding: '0.5rem', borderLeft: `3px solid ${s.color}` }}>
                                    <strong>{s.name}</strong>: {s.data}
                                </div>
                            ))}
                        </div>

                        {/* MUX Logic Visualization */}
                        <div className="glass-panel flex-col" style={{ flex: 1, padding: '1rem', position: 'relative', minHeight: '200px' }}>
                            <h4>MUX Logic: Frame Construction</h4>
                            <div className="flex-row gap-sm" style={{ border: '1px dashed rgba(255,255,255,0.2)', padding: '1rem', minHeight: '50px' }}>
                                <AnimatePresence>
                                    {isSimulating && senders.map((s, i) => (
                                        <motion.div
                                            key={`${s.id}-${currentFrame}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: i * 0.2 }}
                                            style={{
                                                background: s.color,
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                color: '#000',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {s.data}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {!isSimulating && <span style={{ opacity: 0.5 }}>Waiting...</span>}
                            </div>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                The MUX takes 1 unit from each sender to build a <strong>Frame</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Channel */}
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h4>High Speed Channel</h4>
                        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', padding: '10px' }}>
                            {muxOutput.map((p, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        minWidth: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: p.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {p.data}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* FDM Section */}
            {mode === 'FDM' && (
                <div className="flex-col gap-lg">
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h3>Frequency Division Multiplexing (FDM)</h3>
                        <p>In FDM, distinct frequency ranges are assigned to each user. All signals are transmitted simultaneously.</p>
                    </div>

                    <div className="flex-row gap-lg" style={{ flexWrap: 'wrap' }}>
                        {/* Individual Signals */}
                        <div className="flex-col gap-sm" style={{ flex: 1 }}>
                            <h4>Individual Signals (Baseband)</h4>
                            {senders.map(s => (
                                <div key={s.id} className="glass-panel" style={{ padding: '0.5rem', borderLeft: `3px solid ${s.color}` }}>
                                    <div className="flex-row space-between">
                                        <strong>{s.name}</strong>
                                        <span style={{ fontSize: '0.8rem' }}>Freq: {s.frequency} Hz</span>
                                    </div>
                                    <div style={{ height: '60px' }}>
                                        {/* Mini graph for concept */}
                                        <Waveform
                                            data={Array.from({ length: 50 }, (_, i) => ({ x: i, y: Math.sin(i * 0.5 * (s.frequency || 1)) }))}
                                            color={s.color}
                                            showGrid={false}
                                            height="100%"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Combined MUX Output */}
                        <div className="flex-col gap-sm" style={{ flex: 2 }}>
                            <h4>MUX Output: Combined Spectrum (Broadband)</h4>
                            <div className="glass-panel" style={{ padding: '1rem' }}>
                                <div style={{ height: '250px' }}>
                                    <Waveform data={fdmData} color="#fff" height="100%" />
                                </div>
                                <p style={{ marginTop: '1rem' }}>
                                    The "Under the Hood" math: <code>y = sin(f1*t) + sin(f2*t) + sin(f3*t)</code>.
                                    The result is a complex composite signal sent over the wire.
                                </p>
                            </div>
                        </div>

                        {/* DEMUX Filter Bank */}
                        <div className="flex-col gap-sm" style={{ flex: 1 }}>
                            <h4>DEMUX: Filter Bank</h4>
                            <div className="glass-panel" style={{ padding: '1rem' }}>
                                <div className="flex-col gap-md">
                                    <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                        ⬇️ Bandpass Filter 1
                                    </div>
                                    <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                        ⬇️ Bandpass Filter 2
                                    </div>
                                    <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                        ⬇️ Bandpass Filter 3
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        The Demux uses filters to separate the composite signal back into individual frequencies.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Multiplexing;
