import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Tablet, Plus, Trash2, Activity, Play, Square, Settings } from 'lucide-react';
import Waveform from '../components/Waveform';

interface Sender {
    id: number;
    name: string;
    data: string;
    color: string;
    frequency?: number;
    icon: any;
}

const Multiplexing = () => {
    const [mode, setMode] = useState<'TDM' | 'FDM'>('TDM');
    const [senders, setSenders] = useState<Sender[]>([
        { id: 1, name: 'Laptop', data: 'A', color: 'var(--primary)', frequency: 1, icon: <Laptop size={18} /> },
        { id: 2, name: 'Phone', data: 'B', color: 'var(--secondary)', frequency: 2, icon: <Smartphone size={18} /> },
        { id: 3, name: 'Tablet', data: 'C', color: 'var(--accent)', frequency: 3, icon: <Tablet size={18} /> }
    ]);

    const [isSimulating, setIsSimulating] = useState(false);

    // TDM State
    const [muxOutput, setMuxOutput] = useState<any[]>([]); // Particles on wire
    const [frameSlots, setFrameSlots] = useState<any[]>([]); // Visualizing the frame being built

    // FDM Data
    const fdmData = useMemo(() => {
        const points = 200;
        const data: { x: number, y: number }[] = [];
        for (let i = 0; i < points; i++) {
            const t = i / 20;
            let y = 0;
            senders.forEach(s => {
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
        setFrameSlots([]);

        let frames = 0;
        const maxFrames = 3; // Keep it short and sweet

        const interval = setInterval(() => {
            frames++;

            // 1. Build Frame Animation
            const newFrame = senders.map(s => ({ ...s, id: Math.random() }));
            setFrameSlots(newFrame); // Show in "MUX" box

            // 2. Transmit after short delay
            setTimeout(() => {
                setFrameSlots([]); // Clear MUX box
                setMuxOutput(prev => [...prev, ...newFrame.map(p => ({ ...p, progress: 0 }))]);
            }, 800);

            if (frames >= maxFrames) {
                clearInterval(interval);
                setTimeout(() => setIsSimulating(false), 3000);
            }
        }, 2000);
    };

    return (
        <div className="flex-col gap-md">
            <div className="flex-row space-between" style={{ alignItems: 'flex-end' }}>
                <div>
                    <h1>Multiplexing Simulation</h1>
                    <p style={{ maxWidth: '600px', margin: 0 }}>
                        Multiple signals sharing a single communication medium.
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
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
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
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
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
                    {mode === 'TDM' && (
                        <button
                            onClick={startTDM}
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
                    )}
                </div>

                {/* 3-Column Layout: Senders -> Network -> Receivers */}
                <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>

                    {/* Left: Sources */}
                    <div className="flex-col gap-md" style={{ width: '250px' }}>
                        <h3 className="text-center" style={{ color: 'var(--text-muted)' }}>SOURCES</h3>
                        {senders.map(s => (
                            <div key={s.id} className="glass-panel" style={{ padding: '1rem', borderLeft: `4px solid ${s.color}`, transition: 'all 0.3s', transform: isSimulating ? 'scale(0.98)' : 'scale(1)' }}>
                                <div className="flex-row space-between" style={{ marginBottom: '0.5rem' }}>
                                    <span className="flex-row gap-sm" style={{ color: s.color, fontWeight: 'bold' }}>{s.icon} {s.name}</span>
                                </div>
                                <div className="flex-row space-between" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                    <span>Data: {s.data}</span>
                                    <span>Freq: {s.frequency}Hz</span>
                                </div>
                                {mode === 'FDM' && (
                                    <div style={{ height: '40px', marginTop: '10px', opacity: 0.7 }}>
                                        <Waveform data={Array.from({ length: 30 }, (_, i) => ({ x: i, y: Math.sin(i * 0.5 * (s.frequency || 1)) }))} color={s.color} showGrid={false} height="100%" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Center: Network Core */}
                    <div className="flex-col" style={{ flex: 1, position: 'relative' }}>

                        {/* MUX Block */}
                        <div className="glass-panel flex-center flex-col" style={{ padding: '1rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.2)', minHeight: '120px' }}>
                            <h4 style={{ letterSpacing: '2px', color: 'var(--primary)' }}>MULTIPLEXER</h4>

                            {mode === 'TDM' ? (
                                <div className="flex-center gap-sm" style={{ marginTop: '10px', height: '50px' }}>
                                    {/* Visual Slots for Frame Construction */}
                                    <AnimatePresence>
                                        {frameSlots.length > 0 ? (
                                            frameSlots.map(s => (
                                                <motion.div
                                                    key={s.id}
                                                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                                    style={{ width: '40px', height: '40px', background: s.color, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}
                                                >
                                                    {s.data}
                                                </motion.div>
                                            ))
                                        ) : (
                                            <span style={{ color: 'rgba(255,255,255,0.1)' }}>Waiting for Frame...</span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="text-center" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                    Combines signals Σ f(t)
                                </div>
                            )}
                        </div>

                        {/* Transmission Line */}
                        <div style={{ flex: 1, background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)', borderRadius: '12px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <span style={{ position: 'absolute', color: 'rgba(255,255,255,0.05)', fontSize: '3rem', fontWeight: 'bold', transform: 'rotate(-90deg)' }}>SHARED CHANNEL</span>

                            {mode === 'TDM' && (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <AnimatePresence>
                                        {muxOutput.map((p) => (
                                            <motion.div
                                                key={p.id}
                                                initial={{ top: '10%', opacity: 1 }}
                                                animate={{ top: '90%', opacity: 0 }}
                                                transition={{ duration: 1.5, ease: "linear" }}
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    background: p.color,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#000', fontWeight: 'bold',
                                                    boxShadow: '0 0 15px currentColor'
                                                }}
                                            >
                                                {p.data}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            {mode === 'FDM' && (
                                <div style={{ width: '90%', height: '150px' }}>
                                    <Waveform data={fdmData} color="#fff" height="100%" showGrid={false} />
                                </div>
                            )}
                        </div>

                        {/* DEMUX Block */}
                        <div className="glass-panel flex-center flex-col" style={{ padding: '1rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.2)', minHeight: '120px' }}>
                            <h4 style={{ letterSpacing: '2px', color: 'var(--secondary)' }}>DEMULTIPLEXER</h4>
                            <div className="flex-row gap-lg" style={{ marginTop: '10px' }}>
                                {mode === 'FDM' && (
                                    <>
                                        <div className="flex-col flex-center">
                                            <div style={{ width: '30px', height: '30px', border: '2px solid var(--primary)', borderRadius: '50%' }}></div>
                                            <small style={{ fontSize: '0.6rem' }}>Filter 1</small>
                                        </div>
                                        <div className="flex-col flex-center">
                                            <div style={{ width: '30px', height: '30px', border: '2px solid var(--secondary)', borderRadius: '50%' }}></div>
                                            <small style={{ fontSize: '0.6rem' }}>Filter 2</small>
                                        </div>
                                        <div className="flex-col flex-center">
                                            <div style={{ width: '30px', height: '30px', border: '2px solid var(--accent)', borderRadius: '50%' }}></div>
                                            <small style={{ fontSize: '0.6rem' }}>Filter 3</small>
                                        </div>
                                    </>
                                )}
                                {mode === 'TDM' && (
                                    <div className="text-center" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                        Splits Frames by Time Slot
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right: Destinations */}
                    <div className="flex-col gap-md" style={{ width: '250px' }}>
                        <h3 className="text-center" style={{ color: 'var(--text-muted)' }}>DESTINATIONS</h3>
                        {senders.map(s => (
                            <div key={s.id} className="glass-panel" style={{ padding: '1rem', borderRight: `4px solid ${s.color}`, textAlign: 'right', opacity: isSimulating ? 0.8 : 1 }}>
                                <div style={{ color: s.color, fontWeight: 'bold' }}>Receiver {s.id}</div>
                                <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', minHeight: '30px' }}>
                                    {isSimulating && mode === 'TDM' ? '...' : (mode === 'FDM' ? 'Signal Recovered' : s.data)}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            <style>{`
                .spin { animation: spin 2s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Multiplexing;
