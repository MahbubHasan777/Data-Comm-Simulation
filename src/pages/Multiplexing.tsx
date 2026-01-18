import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Tablet, Activity, Play, Settings, RefreshCw, ChevronsRight } from 'lucide-react';
import Waveform from '../components/Waveform';

interface Sender {
    id: number;
    name: string;
    data: string; // TDM input string
    equation: string; // FDM equation
    color: string;
    icon: any;
    slots: number; // Multislot allocation
}

const Multiplexing = () => {
    const [mode, setMode] = useState<'TDM' | 'FDM'>('TDM');
    const [senders, setSenders] = useState<Sender[]>([
        { id: 1, name: 'S1', data: 'HELLO', equation: 'sin(t)', color: 'var(--primary)', icon: <Laptop size={18} />, slots: 1 },
        { id: 2, name: 'S2', data: 'DATA', equation: 'sin(3t)', color: 'var(--secondary)', icon: <Smartphone size={18} />, slots: 1 },
        { id: 3, name: 'S3', data: 'COMM', equation: 'sin(5t)', color: 'var(--accent)', icon: <Tablet size={18} />, slots: 1 }
    ]);

    // TDM Settings
    const [slotSize, setSlotSize] = useState(1);
    const [pulseStuffing, setPulseStuffing] = useState(true);

    // FDM Settings
    const [guardBand, setGuardBand] = useState(1); // 0 to 5
    const [minFreq, setMinFreq] = useState(0);
    const [maxFreq, setMaxFreq] = useState(100);

    // Safety check for equation evaluation
    const evaluateEquation = (eq: string, t: number, senderIndex: number) => {
        try {
            // Apply Logic: Guard Band shifts frequency
            // We simulate this by scaling 't' for each subsequent sender
            // t_effective = t * (1 + (guardBand * 0.5 * senderIndex))
            // This spreads the frequencies apart as Guard Band increases
            const spreadFactor = 1 + (guardBand * 0.2 * senderIndex);

            // Improve parsing: handle implicit multiplication
            let safeEq = eq
                .replace(/(\d)(t)/g, '$1*$2')
                .replace(/(\d)(\()/g, '$1*(')
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/pi/g, 'Math.PI');

            // eslint-disable-next-line no-new-func
            return new Function('t', `return ${safeEq}`)(t * spreadFactor);
        } catch (e) {
            return 0;
        }
    };

    const [isSimulating, setIsSimulating] = useState(false);
    const [muxOutput, setMuxOutput] = useState<any[]>([]); // Frames on wire
    const [receiverData, setReceiverData] = useState<Record<number, string>>({ 1: '', 2: '', 3: '' });

    // FDM Data (Time Domain)
    const fdmData = useMemo(() => {
        const points = 200;
        const data: { x: number, y: number }[] = [];
        for (let i = 0; i < points; i++) {
            const t = i / 10;
            let y = 0;
            senders.forEach((s, idx) => {
                y += evaluateEquation(s.equation, t, idx);
            });
            data.push({ x: i, y });
        }
        return data;
    }, [senders, guardBand]); // Re-calc when guardBand changes

    const startSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setMuxOutput([]);
        setReceiverData({ 1: '', 2: '', 3: '' });

        if (mode === 'TDM') {
            // Simulation Logic using Cursors
            let cursors = { 1: 0, 2: 0, 3: 0 };
            let active = true;

            const interval = setInterval(() => {
                let frameHasData = false;
                const frameContent: any[] = [];

                // Build Frame according to Slot Allocations (Multislot)
                senders.forEach(s => {
                    const slotsAllocated = s.slots;

                    for (let k = 0; k < slotsAllocated; k++) {
                        const start = cursors[s.id as keyof typeof cursors];
                        const chunk = s.data.substr(start, slotSize);

                        if (chunk.length > 0) {
                            frameContent.push({ ...s, data: chunk, type: 'data' });
                            cursors[s.id as keyof typeof cursors] += slotSize;
                            frameHasData = true;
                        } else if (pulseStuffing) {
                            frameContent.push({ ...s, data: '∅', type: 'stuffing' });
                        }
                    }
                });

                if (!frameHasData) {
                    active = false;
                }

                if (active && frameContent.length > 0) {
                    const frameId = Math.random();
                    setMuxOutput(prev => [...prev, { id: frameId, content: frameContent }]);

                    setTimeout(() => {
                        frameContent.forEach(slot => {
                            if (slot.type === 'data') {
                                setReceiverData(prev => ({
                                    ...prev,
                                    [slot.id]: prev[slot.id as keyof typeof prev] + slot.data
                                }));
                            }
                        });
                    }, 2000); // Travel time
                } else {
                    clearInterval(interval);
                    setTimeout(() => setIsSimulating(false), 2000);
                }
            }, 1200);

        } else {
            // FDM
            setTimeout(() => setIsSimulating(false), 3000);
        }
    };

    const updateSender = (id: number, field: keyof Sender, value: any) => {
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

                <div className="glass-panel flex-row" style={{ padding: '0.5rem', gap: '0.5rem', borderRadius: '50px' }}>
                    <button onClick={() => setMode('TDM')} style={{ padding: '0.5rem 1.5rem', borderRadius: '25px', background: mode === 'TDM' ? 'var(--primary)' : 'transparent', color: mode === 'TDM' ? '#000' : 'var(--text-muted)', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>TDM</button>
                    <button onClick={() => setMode('FDM')} style={{ padding: '0.5rem 1.5rem', borderRadius: '25px', background: mode === 'FDM' ? 'var(--secondary)' : 'transparent', color: mode === 'FDM' ? '#fff' : 'var(--text-muted)', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>FDM</button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Controls */}
                <div className="flex-row space-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="flex-row gap-lg">

                        {mode === 'TDM' && (
                            <div className="flex-row gap-md" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                                <div className="flex-col gap-xs">
                                    <label className="label" style={{ fontSize: '0.7rem' }}>Slot Size</label>
                                    <input type="number" min="1" max="3" value={slotSize} onChange={(e) => setSlotSize(Math.max(1, parseInt(e.target.value)))} style={{ width: '60px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', padding: '2px' }} />
                                </div>
                                <div className="flex-col gap-xs">
                                    <label className="label" style={{ fontSize: '0.7rem' }}>Pulse Stuffing</label>
                                    <div
                                        onClick={() => setPulseStuffing(!pulseStuffing)}
                                        style={{
                                            width: '40px', height: '20px', background: pulseStuffing ? 'var(--success)' : 'rgba(255,255,255,0.2)',
                                            borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                    >
                                        <div style={{
                                            width: '16px', height: '16px', background: '#fff', borderRadius: '50%',
                                            position: 'absolute', top: '2px', left: pulseStuffing ? '22px' : '2px', transition: 'all 0.3s'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'FDM' && (
                            <div className="flex-row gap-md" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', alignItems: 'flex-end' }}>
                                <div className="flex-col gap-xs">
                                    <label className="label" style={{ fontSize: '0.7rem' }}>Guard Band</label>
                                    <input type="range" min="0" max="50" value={guardBand * 10} onChange={(e) => setGuardBand(parseInt(e.target.value) / 10)} style={{ width: '100px', accentColor: 'var(--success)' }} />
                                </div>
                                <div className="flex-col gap-xs">
                                    <label className="label" style={{ fontSize: '0.7rem' }}>Min Freq</label>
                                    <input type="number" value={minFreq} onChange={(e) => setMinFreq(Number(e.target.value))} style={{ width: '50px', background: 'transparent', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
                                </div>
                                <div className="flex-col gap-xs">
                                    <label className="label" style={{ fontSize: '0.7rem' }}>Max Freq</label>
                                    <input type="number" value={maxFreq} onChange={(e) => setMaxFreq(Number(e.target.value))} style={{ width: '50px', background: 'transparent', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
                                </div>
                            </div>
                        )}

                    </div>
                    <button
                        onClick={startSimulation}
                        disabled={isSimulating}
                        className="flex-center gap-sm"
                        style={{
                            background: isSimulating ? 'rgba(255,255,255,0.1)' : 'var(--success)',
                            padding: '0.8rem 2rem', borderRadius: '8px', color: isSimulating ? 'rgba(255,255,255,0.5)' : '#000', fontWeight: 'bold'
                        }}
                    >
                        {isSimulating ? <Activity className="spin" size={20} /> : <Play size={20} />}
                        {isSimulating ? 'Simulating...' : 'Start Simulation'}
                    </button>

                    {!isSimulating && (
                        <button onClick={() => setReceiverData({ 1: '', 2: '', 3: '' })} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <RefreshCw size={16} /> Reset
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '2rem', flex: 1, flexDirection: 'row' }}>

                    {/* SOURCES */}
                    <div className="flex-col gap-md" style={{ width: '300px' }}>
                        <h3 className="text-center" style={{ color: 'var(--text-muted)' }}>SOURCES</h3>
                        {senders.map((s, idx) => (
                            <div key={s.id} className="glass-panel" style={{ padding: '1rem', borderLeft: `4px solid ${s.color}`, transition: 'all 0.3s' }}>
                                <div className="flex-row space-between" style={{ marginBottom: '0.5rem' }}>
                                    <span className="flex-row gap-sm" style={{ color: s.color, fontWeight: 'bold' }}>{s.icon} {s.name}</span>
                                    {mode === 'TDM' && (
                                        <div className="flex-row gap-xs" title="Slots per frame (Multislot)" style={{ alignItems: 'center', marginTop: '4px' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Slots:</span>
                                            <input
                                                type="number" min="1" max="3" value={s.slots}
                                                onChange={(e) => updateSender(s.id, 'slots', parseInt(e.target.value))}
                                                style={{ width: '40px', background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', textAlign: 'center', borderRadius: '4px', padding: '2px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {mode === 'TDM' ? (
                                    <div className="flex-col gap-xs">
                                        <label className="label">Data Stream</label>
                                        <input
                                            type="text"
                                            value={s.data}
                                            onChange={(e) => updateSender(s.id, 'data', e.target.value)}
                                            style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '8px', borderRadius: '4px', letterSpacing: '1px' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-col gap-xs">
                                        <label className="label">f(t) = (Guard Shift: +{Math.round(guardBand * 0.2 * idx * 100)}%)</label>
                                        <input
                                            type="text"
                                            value={s.equation}
                                            onChange={(e) => updateSender(s.id, 'equation', e.target.value)}
                                            style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '5px', borderRadius: '4px', fontFamily: 'monospace' }}
                                        />
                                        <div style={{ height: '120px', marginTop: '5px' }}>
                                            <Waveform
                                                data={Array.from({ length: 50 }, (_, i) => {
                                                    const t = i / 10;
                                                    // Show individual waveform WITH shift
                                                    return { x: i, y: evaluateEquation(s.equation, t, idx) };
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

                    {/* NETWORK CORE */}
                    <div className="flex-col" style={{ flex: 1, position: 'relative' }}>
                        <div className="glass-panel flex-center flex-col" style={{ padding: '1rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.2)', minHeight: '100px' }}>
                            <h4 style={{ letterSpacing: '2px', color: 'var(--primary)', margin: 0 }}>MULTIPLEXER</h4>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>
                                {mode === 'TDM' ? `Build Frame: ${senders.map(s => `${s.slots}x${s.name}`).join(' + ')}` : 'Frequency Allocation'}
                            </div>

                            {/* FDM Spectrum Visualization */}
                            {mode === 'FDM' && (
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#aaa', marginBottom: '2px' }}>
                                        <span>{minFreq}Hz</span>
                                        <span>{maxFreq}Hz</span>
                                    </div>
                                    <div style={{ width: '100%', height: '40px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', display: 'flex', overflow: 'hidden', position: 'relative' }}>
                                        {/* Sender 1 */}
                                        <div style={{ flex: 1, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#000' }}>S1</div>

                                        {/* Guard Band */}
                                        <motion.div
                                            animate={{ width: `${guardBand * 20}px` }}
                                            style={{ background: '#444', height: '100%', borderLeft: '1px dashed #666', borderRight: '1px dashed #666' }}
                                        />

                                        {/* Sender 2 */}
                                        <div style={{ flex: 1, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#000' }}>S2</div>

                                        {/* Guard Band */}
                                        <motion.div
                                            animate={{ width: `${guardBand * 20}px` }}
                                            style={{ background: '#444', height: '100%', borderLeft: '1px dashed #666', borderRight: '1px dashed #666' }}
                                        />

                                        {/* Sender 3 */}
                                        <div style={{ flex: 1, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#000' }}>S3</div>
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '0.6rem', color: '#666' }}>Frequency Spectrum</div>
                                </div>
                            )}
                        </div>

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
                                                    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                                                    display: 'flex', gap: '2px', padding: '4px',
                                                    border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.8)',
                                                    borderRadius: '4px', boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                                                }}
                                            >
                                                {packet.content.map((s: any, idx: number) => (
                                                    <div key={idx} style={{
                                                        width: '30px', height: '30px',
                                                        background: s.type === 'stuffing' ? 'transparent' : s.color,
                                                        border: s.type === 'stuffing' ? '1px dashed rgba(255,255,255,0.3)' : 'none',
                                                        color: s.type === 'stuffing' ? 'rgba(255,255,255,0.3)' : '#000',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.8rem', fontWeight: 'bold'
                                                    }}>
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
                                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: '#aaa' }}>
                                        Combined Signal (Time Domain)
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="glass-panel flex-center flex-col" style={{ padding: '1rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.2)', height: '100px' }}>
                            <h4 style={{ letterSpacing: '2px', color: 'var(--secondary)', margin: 0 }}>DEMULTIPLEXER</h4>
                            {mode === 'FDM' && (
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>
                                    Bandpass Filtering: {minFreq}Hz - {maxFreq}Hz
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DESTINATIONS */}
                    <div className="flex-col gap-md" style={{ width: '300px' }}>
                        <h3 className="text-center" style={{ color: 'var(--text-muted)' }}>DESTINATIONS</h3>
                        {senders.map(s => (
                            <div key={s.id} className="glass-panel" style={{ padding: '1rem', borderRight: `4px solid ${s.color}`, textAlign: 'right' }}>
                                <div style={{ color: s.color, fontWeight: 'bold' }}>Receiver {s.id}</div>
                                <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', minHeight: '30px', wordBreak: 'break-all' }}>
                                    {mode === 'TDM' ? (
                                        <span>{receiverData[s.id as keyof typeof receiverData]}<span className="blink">_</span></span>
                                    ) : (
                                        isSimulating ? <span className="blink">Receiving...</span> : 'Waiting...'
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
