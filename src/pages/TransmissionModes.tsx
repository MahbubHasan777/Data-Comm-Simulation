import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Binary } from 'lucide-react';

const TransmissionModes = () => {
    const [mode, setMode] = useState<'serial' | 'parallel'>('serial');
    const [data, setData] = useState("10110011"); // 8-bit example
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [receivedData, setReceivedData] = useState<string[]>([]);
    const [speed, setSpeed] = useState(2); // Seconds to travel

    const handleTransmit = () => {
        if (isTransmitting) return;
        setIsTransmitting(true);
        setReceivedData([]);

        // Reset after animation
        setTimeout(() => {
            setIsTransmitting(false);
            setReceivedData(data.split(''));
        }, (mode === 'serial' ? data.length * 500 : 0) + speed * 1000 + 500);
    };

    const bits = data.split('');

    return (
        <div className="flex-col gap-md">
            <h1>Transmission Modes</h1>
            <p style={{ maxWidth: '600px' }}>
                Visualize the difference between Serial (one bit at a time) and Parallel (multiple bits simultaneously) transmission.
            </p>

            <div className="flex-row gap-md" style={{ flexWrap: 'wrap' }}>
                {/* Controls */}
                <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '300px', flex: 1 }}>
                    <h3>Settings</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Transmission Mode</label>
                        <div className="flex-row gap-md">
                            <button
                                onClick={() => setMode('serial')}
                                style={{ background: mode === 'serial' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: mode === 'serial' ? '#000' : '#fff', flex: 1 }}
                            >
                                Serial
                            </button>
                            <button
                                onClick={() => setMode('parallel')}
                                style={{ background: mode === 'parallel' ? 'var(--secondary)' : 'rgba(255,255,255,0.1)', color: mode === 'parallel' ? '#fff' : '#fff', flex: 1 }}
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
                <div className="glass-panel" style={{ flex: 2, minWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Sender & Receiver Labels */}
                    <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="flex-center flex-col">
                            <div className="icon-box" style={{ width: 60, height: 60, background: 'var(--primary)', borderRadius: '50%', marginBottom: '10px' }}>
                                <Binary color="#000" />
                            </div>
                            <span>SENDER</span>
                        </div>

                        <ArrowRight size={32} color="rgba(255,255,255,0.2)" />

                        <div className="flex-center flex-col">
                            <div className="icon-box" style={{ width: 60, height: 60, background: 'var(--secondary)', borderRadius: '50%', marginBottom: '10px' }}>
                                <Binary color="#fff" />
                            </div>
                            <span>RECEIVER</span>
                        </div>
                    </div>

                    {/* The Wire(s) */}
                    <div style={{ position: 'relative', minHeight: '200px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem' }}>

                        {/* Serial Mode Animation */}
                        {mode === 'serial' && (
                            <div className="flex-center" style={{ height: '100%', position: 'relative' }}>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', position: 'absolute' }}></div>
                                <AnimatePresence>
                                    {isTransmitting && bits.map((bit, i) => (
                                        <motion.div
                                            key={`bit-${i}`}
                                            initial={{ left: '0%', opacity: 0 }}
                                            animate={{
                                                left: ['0%', '100%'],
                                                opacity: [1, 1, 0]
                                            }}
                                            transition={{
                                                duration: speed,
                                                delay: i * 0.5,
                                                ease: "linear"
                                            }}
                                            style={{
                                                position: 'absolute',
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                background: bit === '1' ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                                                color: '#000',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                zIndex: 10,
                                                top: 'calc(50% - 15px)'
                                            }}
                                        >
                                            {bit}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Parallel Mode Animation */}
                        {mode === 'parallel' && (
                            <div className="flex-col" style={{ height: '100%', justifyContent: 'space-between', position: 'relative' }}>
                                {bits.map((bit, i) => (
                                    <div key={i} style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'absolute' }}></div>
                                        <AnimatePresence>
                                            {isTransmitting && (
                                                <motion.div
                                                    initial={{ left: '0%', opacity: 1 }}
                                                    animate={{ left: '100%', opacity: 0 }}
                                                    transition={{ duration: speed, ease: "linear" }}
                                                    style={{
                                                        position: 'absolute',
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '50%',
                                                        background: bit === '1' ? 'var(--secondary)' : 'rgba(255,255,255,0.3)',
                                                        fontSize: '10px',
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        zIndex: 10
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

                    </div>

                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        {mode === 'serial' ? 'Waiting 0.5s between each bit...' : 'All bits sent simultaneously!'}
                    </div>

                    {/* Receiver Display */}
                    <div className="glass-panel text-center" style={{ minHeight: '60px', padding: '1rem', marginTop: '1rem' }}>
                        <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Received Data</h4>
                        <div style={{ letterSpacing: '4px', fontFamily: 'monospace', fontSize: '1.2rem', minHeight: '1.5rem', color: 'var(--success)' }}>
                            {receivedData.length > 0 ? receivedData.join('') : (isTransmitting ? 'receiving...' : 'Waiting for data')}
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                            <label className="label" style={{ fontSize: '0.8rem' }}>Transmission Speed: {speed}s</label>
                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.5"
                                value={speed}
                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TransmissionModes;
