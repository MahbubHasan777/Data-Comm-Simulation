import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Binary } from 'lucide-react';

const TransmissionModes = () => {
    const [mode, setMode] = useState<'serial' | 'parallel' | 'asynchronous'>('serial');
    const [data, setData] = useState("10110011"); // 8-bit example
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [receivedData, setReceivedData] = useState<string[]>([]);
    const [speed, setSpeed] = useState(2); // Seconds to travel

    const getFramedBits = () => {
        if (mode === 'asynchronous') {
            // Start bit (0) + Data + Stop bit (1)
            return ['0', ...data.split(''), '1'];
        }
        return data.split('');
    };

    const bitsToAnimate = getFramedBits();

    const handleTransmit = () => {
        if (isTransmitting) return;
        setIsTransmitting(true);
        setReceivedData([]);

        const bitCount = bitsToAnimate.length;
        // Calculation for partial completion
        const totalDuration = (mode === 'parallel' ? 0 : bitCount * 0.5) + speed + 0.5;

        setTimeout(() => {
            setIsTransmitting(false);
            setReceivedData(data.split(''));
        }, totalDuration * 1000);
    };

    return (
        <div className="flex-col gap-md">
            <h1>Transmission Modes</h1>
            <p style={{ maxWidth: '600px' }}>
                Visualize Serial (Synchronous/Asynchronous) vs Parallel transmission.
            </p>

            <div className="flex-row gap-md" style={{ flexWrap: 'wrap' }}>
                {/* Controls */}
                <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '300px', flex: 1 }}>
                    <h3>Settings</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Transmission Mode</label>
                        <div className="flex-col gap-sm">
                            <div className="flex-row gap-sm">
                                <button
                                    onClick={() => setMode('serial')}
                                    style={{ background: mode === 'serial' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: mode === 'serial' ? '#000' : '#fff', flex: 1 }}
                                >
                                    Serial (Sync)
                                </button>
                                <button
                                    onClick={() => setMode('asynchronous')}
                                    style={{ background: mode === 'asynchronous' ? 'var(--accent)' : 'rgba(255,255,255,0.1)', color: mode === 'asynchronous' ? '#fff' : '#fff', flex: 1 }}
                                >
                                    Asynchronous
                                </button>
                            </div>
                            <button
                                onClick={() => setMode('parallel')}
                                style={{ background: mode === 'parallel' ? 'var(--secondary)' : 'rgba(255,255,255,0.1)', color: mode === 'parallel' ? '#fff' : '#fff', width: '100%' }}
                            >
                                Parallel
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Data to Send (8 bits)</label>
                        <input
                            type="text"
                            value={data}
                            maxLength={8}
                            onChange={(e) => setData(e.target.value.replace(/[^01]/g, ''))}
                            style={{
                                width: '100%', padding: '0.8rem', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white',
                                fontFamily: 'monospace', letterSpacing: '4px'
                            }}
                        />
                    </div>

                    <button
                        onClick={handleTransmit}
                        disabled={isTransmitting}
                        style={{ width: '100%', background: isTransmitting ? 'grey' : 'var(--success)', color: '#000' }}
                    >
                        {isTransmitting ? 'Transmitting...' : 'Start Transmission'}
                    </button>
                </div>

                {/* Animation Canvas */}
                <div className="glass-panel" style={{ flex: 2, minWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {/* Sender & Receiver Labels */}
                    <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
                        <div className="flex-center flex-col">
                            <div className="flex-center" style={{ width: 80, height: 80, background: 'var(--primary)', borderRadius: '50%', marginBottom: '10px', boxShadow: '0 0 20px rgba(0,240,255,0.3)' }}>
                                <Binary color="#000" size={32} />
                            </div>
                            <span style={{ fontWeight: 'bold' }}>SENDER</span>
                        </div>

                        <ArrowRight size={48} color="rgba(255,255,255,0.1)" />

                        <div className="flex-center flex-col">
                            <div className="flex-center" style={{ width: 80, height: 80, background: 'var(--secondary)', borderRadius: '50%', marginBottom: '10px', boxShadow: '0 0 20px rgba(112,0,255,0.3)' }}>
                                <Binary color="#fff" size={32} />
                            </div>
                            <span style={{ fontWeight: 'bold' }}>RECEIVER</span>
                        </div>
                    </div>

                    {/* The Wire(s) */}
                    <div style={{ position: 'relative', minHeight: '150px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                        {/* Serial/Async Mode Animation */}
                        {(mode === 'serial' || mode === 'asynchronous') && (
                            <div className="flex-center" style={{ width: '100%', position: 'relative' }}>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', position: 'absolute', borderRadius: '2px' }}></div>
                                <AnimatePresence>
                                    {isTransmitting && bitsToAnimate.map((bit, i) => {
                                        // Special styling for Start/Stop bits
                                        let bg = bit === '1' ? 'var(--primary)' : 'rgba(255,255,255,0.3)';
                                        let label = '';
                                        if (mode === 'asynchronous') {
                                            if (i === 0) { bg = 'var(--warning)'; label = 'S'; } // Start
                                            else if (i === bitsToAnimate.length - 1) { bg = 'var(--accent)'; label = 'E'; } // End
                                        }

                                        return (
                                            <motion.div
                                                key={`bit-${i}-${mode}`} // Force re-render on mode change
                                                initial={{ left: '10%', opacity: 0 }}
                                                animate={{
                                                    left: ['10%', '90%'],
                                                    opacity: [1, 1, 0]
                                                }}
                                                transition={{
                                                    duration: speed,
                                                    delay: i * 0.6, // Slower sequence for clarity
                                                    ease: "linear"
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: bg,
                                                    color: '#000',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    zIndex: 10,
                                                    top: '-14px', // Center on line (32/2 - 4/2 = 14)
                                                    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                                                }}
                                                title={label ? (label === 'S' ? 'Start Bit' : 'Stop Bit') : 'Data Bit'}
                                            >
                                                {bit}
                                                {label && <span style={{ position: 'absolute', top: -15, fontSize: '10px', color: bg }}>{label}</span>}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Parallel Mode Animation */}
                        {mode === 'parallel' && (
                            <div className="flex-col" style={{ width: '100%', gap: '15px' }}>
                                {bitsToAnimate.map((bit, i) => (
                                    <div key={i} style={{ position: 'relative', height: '10px', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'absolute' }}></div>
                                        <AnimatePresence>
                                            {isTransmitting && (
                                                <motion.div
                                                    initial={{ left: '10%', opacity: 1 }}
                                                    animate={{ left: '90%', opacity: 0 }}
                                                    transition={{ duration: speed, ease: "linear" }}
                                                    style={{
                                                        position: 'absolute',
                                                        width: '14px',
                                                        height: '14px',
                                                        borderRadius: '50%',
                                                        background: bit === '1' ? 'var(--secondary)' : 'rgba(255,255,255,0.3)',
                                                        fontSize: '9px',
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        zIndex: 10,
                                                        top: '-6px'
                                                    }}
                                                >
                                                    {bit}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isTransmitting && (
                            <div className="flex-center" style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                                <p style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.5rem', fontWeight: 'bold' }}>IDLE LINE</p>
                            </div>
                        )}

                    </div>

                    {/* Receiver Display */}
                    <div className="glass-panel text-center" style={{ minHeight: '80px', padding: '1rem' }}>
                        <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Received Data Buffer</h4>
                        <div style={{ letterSpacing: '8px', fontFamily: 'monospace', fontSize: '1.5rem', minHeight: '2rem', color: 'var(--success)' }}>
                            {receivedData.length > 0 ? receivedData.join('') : (isTransmitting ? <span className="blink">Receiving...</span> : 'Waiting...')}
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', padding: '0 1rem' }}>
                        <label className="label" style={{ fontSize: '0.8rem' }}>Animation Duration (s): {speed}s</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.5"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>

                </div>
            </div>

            <style>{`
                .blink { animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
};

export default TransmissionModes;
