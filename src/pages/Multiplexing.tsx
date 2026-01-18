import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Tablet, Activity, Play, Settings } from 'lucide-react';
import Waveform from '../components/Waveform';

interface Sender {
    id: number;
    name: string;
    data: string; // TDM uses this
    equation: string; // FDM uses this
    color: string;
    icon: any;
}

const Multiplexing = () => {
    const [mode, setMode] = useState<'TDM' | 'FDM'>('TDM');
    const [senders, setSenders] = useState<Sender[]>([
        { id: 1, name: 'S1', data: 'A', equation: 'sin(t)', color: 'var(--primary)', icon: <Laptop size={18} /> },
        { id: 2, name: 'S2', data: 'B', equation: 'sin(3*t)', color: 'var(--secondary)', icon: <Smartphone size={18} /> },
        { id: 3, name: 'S3', data: 'C', equation: 'sin(5*t)', color: 'var(--accent)', icon: <Tablet size={18} /> }
    ]);

    // Safety check for equation evaluation
    const evaluateEquation = (eq: string, t: number) => {
        try {
            // Very basic safe eval replacement
            // Supports: sin, cos, t, numbers, +, -, *, /
            // Replace 'sin' with 'Math.sin', etc.
            const safeEq = eq.replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/pi/g, 'Math.PI');
            // Allow basic math only
            // eslint-disable-next-line no-new-func
            return new Function('t', `return ${safeEq}`)(t);
        } catch (e) {
            return 0;
        }
    };

    const [isSimulating, setIsSimulating] = useState(false);

    // TDM State
    const [muxOutput, setMuxOutput] = useState<any[]>([]); // Particles/Frames on wire

    // FDM Data
    const fdmData = useMemo(() => {
        const points = 200;
        const data: { x: number, y: number }[] = [];
        for (let i = 0; i < points; i++) {
            const t = i / 10; // Zoom out a bit
            let y = 0;
            senders.forEach(s => {
                y += evaluateEquation(s.equation, t);
            });
            data.push({ x: i, y });
        }
        return data;
    }, [senders]);

    const startSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setMuxOutput([]);

        if (mode === 'TDM') {
            let frames = 0;
            const maxFrames = 3;
            const interval = setInterval(() => {
                frames++;
                // Create a FRAME: [Slot1][Slot2][Slot3]
                // Visual object containing all data
                const frameId = Math.random();
                const frameContent = senders.map(s => ({ ...s, id: frameId })); // Shared ID for grouping

                // Add frame to channel
                setMuxOutput(prev => [...prev, { id: frameId, content: frameContent, type: 'frame' }]);

                if (frames >= maxFrames) {
                    clearInterval(interval);
                    setTimeout(() => setIsSimulating(false), 4000);
                }
            }, 1200);
        } else {
            // FDM Simulation: Just visual feedback "Sending..."
            setTimeout(() => setIsSimulating(false), 3000);
        }
    };

    const updateSender = (id: number, field: 'data' | 'equation', value: string) => {
        setSenders(senders.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="flex-col gap-md">
            <div className="flex-row space-between" style={{ alignItems: 'flex-end' }}>
                <div>
                    <h1>Multiplexing Simulation</h1>
                    <p style={{ maxWidth: '600px', margin: 0 }}>
                        {mode === 'TDM' ? 'Time Division: Sharing time slots.' : 'Frequency Division: Sharing frequency spectrum.'}
                    </p>
                </div>

                {/* Mode Switcher */}
                <div className="glass-panel flex-row" style={{ padding: '0.5rem', gap: '0.5rem', borderRadius: '50px' }}>
                    <button
                        onClick={() => setMode('TDM')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '25px',
                            background: mode === 'TDM' ? 'var(--primary)' : 'transparent',
                            color: mode === 'TDM' ? '#000' : 'var(--text-muted)',
                            fontWeight: 'bold',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                        }}
                    >
                        TDM
                    </button>
                    <button
                        onClick={() => setMode('FDM')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '25px',
                            background: mode === 'FDM' ? 'var(--secondary)' : 'transparent',
                            color: mode === 'FDM' ? '#fff' : 'var(--text-muted)',
                            fontWeight: 'bold',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                        }}
                    >
                        FDM
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="glass-panel" style={{ padding: '2rem', minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Controls Bar */}
                <div className="flex-row space-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <div className="flex-row gap-md">
                        <div className="flex-row gap-sm" style={{ color: 'var(--text-muted)' }}>
                            <Settings size={18} />
                            <span>Run detailed <strong>{mode}</strong> simulation</span>
                        </div>
                    </div>
                    <button
                        onClick={startSimulation}
                        disabled={isSimulating}
                        className="flex-center gap-sm"
                        style={{
                            background: isSimulating ? 'rgba(255,255,255,0.1)' : 'var(--success)',
                            padding: '0.8rem 2rem',
                            borderRadius: '8px',
                            color: isSimulating ? 'rgba(255,255,255,0.5)' : '#000',
                            fontWeight: 'bold'
                        }}
                    >
                        {isSimulating ? <Activity className="spin" size={20} /> : <Play size={20} />}
                        {isSimulating ? 'Simulating...' : 'Start Simulation'}
                    </button>
                </div>

                {/* 3-Column Layout */}
                <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>

                    {/* Left: Sources */}
                    <div className="flex-col gap-md" style={{ width: '280px' }}>
                        <h3 className="text-center" style={{ color: 'var(--text-muted)' }}>SOURCES</h3>
                        {senders.map(s => (
                            <div key={s.id} className="glass-panel" style={{ padding: '1rem', borderLeft: `4px solid ${s.color}`, transition: 'all 0.3s' }}>
                                <div className="flex-row space-between" style={{ marginBottom: '0.5rem' }}>
                                    <span className="flex-row gap-sm" style={{ color: s.color, fontWeight: 'bold' }}>{s.icon} {s.name}</span>
                                </div>

                                {mode === 'TDM' ? (
                                    <div className="flex-col gap-xs">
                                        <label className="label">Data Fragment</label>
                                        <input
                                            type="text"
                                            value={s.data}
                                            onChange={(e) => updateSender(s.id, 'data', e.target.value)}
                                            style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '5px', borderRadius: '4px' }}
                                            maxLength={3}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-col gap-xs">
                                        <label className="label">Signal Equation (f(t))</label>
                                        <input
                                            type="text"
                                            value={s.equation}
                                            onChange={(e) => updateSender(s.id, 'equation', e.target.value)}
                                            style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '5px', borderRadius: '4px', fontFamily: 'monospace' }}
                                        />
                                        <div style={{ height: '50px', marginTop: '5px', opacity: 0.7 }}>
                                            <Waveform
                                                data={Array.from({ length: 50 }, (_, i) => {
                                                    const t = i / 10;
                                                    return { x: i, y: evaluateEquation(s.equation, t) };
                                                })}
                                                color={s.color}
                                                showGrid={false} height="100%"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Center: Network Core */}
                    <div className="flex-col" style={{ flex: 1, position: 'relative' }}>

                        {/* MUX Block */}
                        <div className="glass-panel flex-center flex-col" style={{ padding: '1rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.2)', height: '100px' }}>
                            <h4 style={{ letterSpacing: '2px', color: 'var(--primary)', margin: 0 }}>MULTIPLEXER</h4>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                {mode === 'TDM' ? 'Packing Frames...' : 'Combining Signals...'}
                            </div>
                        </div>

                        {/* Transmission Line */}
                        <div style={{ flex: 1, background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)', borderRadius: '12px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <span style={{ position: 'absolute', color: 'rgba(255,255,255,0.05)', fontSize: '3rem', fontWeight: 'bold', transform: 'rotate(-90deg)' }}>CHANNEL</span>

                            {mode === 'TDM' && (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <AnimatePresence>
                                        {muxOutput.map((packet) => (
                                            <motion.div
                                                key={packet.id}
                                                initial={{ top: '0%', opacity: 1 }}
                                                animate={{ top: '100%', opacity: 0 }}
                                                transition={{ duration: 2, ease: "linear" }}
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    display: 'flex',
                                                    gap: '2px',
                                                    padding: '5px',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    background: 'rgba(0,0,0,0.5)',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                {/* Visual Frame Slots */}
                                                {packet.content.map((s: any) => (
                                                    <div key={s.id} style={{ width: '25px', height: '25px', background: s.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                        {s.data}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            {mode === 'FDM' && (
                                <div style={{ width: '90%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Waveform data={fdmData} color="#fff" height="200px" showGrid={false} />
                                    {isSimulating && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            style={{ textAlign: 'center', marginTop: '10px', color: 'var(--success)' }}
                                        >
                                            Transmitting Composite Signal...
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* DEMUX Block */}
                        <div className="glass-panel flex-center flex-col" style={{ padding: '1rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.2)', height: '100px' }}>
                            <h4 style={{ letterSpacing: '2px', color: 'var(--secondary)', margin: 0 }}>DEMULTIPLEXER</h4>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                {mode === 'TDM' ? 'Unpacking Frames...' : 'Filtering Frequencies...'}
                            </div>
                        </div>

                    </div>

                    {/* Right: Destinations */}
                    <div className="flex-col gap-md" style={{ width: '280px' }}>
                        <h3 className="text-center" style={{ color: 'var(--text-muted)' }}>DESTINATIONS</h3>
                        {senders.map(s => (
                            <div key={s.id} className="glass-panel" style={{ padding: '1rem', borderRight: `4px solid ${s.color}`, textAlign: 'right', opacity: isSimulating ? 0.8 : 1 }}>
                                <div style={{ color: s.color, fontWeight: 'bold' }}>Receiver {s.id}</div>
                                <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', minHeight: '30px' }}>
                                    {isSimulating ? (
                                        <span className="blink">Receiving...</span>
                                    ) : (
                                        mode === 'TDM' ? s.data : 'Signal Recovered'
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            <style>{`
                .spin { animation: spin 2s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .blink { animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default Multiplexing;
