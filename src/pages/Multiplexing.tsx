import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Tablet, Plus, Trash2 } from 'lucide-react';

interface Sender {
    id: number;
    name: string;
    data: string;
    color: string;
    icon: any;
}

const Multiplexing = () => {
    const [senders, setSenders] = useState<Sender[]>([
        { id: 1, name: 'Sender 1', data: 'Hi', color: 'var(--primary)', icon: <Laptop size={20} /> },
        { id: 2, name: 'Sender 2', data: 'Net', color: 'var(--secondary)', icon: <Smartphone size={20} /> },
        { id: 3, name: 'Sender 3', data: 'Sim', color: 'var(--accent)', icon: <Tablet size={20} /> }
    ]);

    const [isSimulating, setIsSimulating] = useState(false);
    const [muxOutput, setMuxOutput] = useState<any[]>([]); // Queue on channel
    const [demuxData, setDemuxData] = useState<{ [key: number]: string }>({ 1: '', 2: '', 3: '' }); // Dest buffers
    const [log, setLog] = useState<string[]>([]);
    const [speed, setSpeed] = useState(1);

    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)', 'var(--warning)'];

    const addSender = () => {
        if (senders.length >= 5) return;
        const newId = (senders.length > 0 ? Math.max(...senders.map(s => s.id)) : 0) + 1;
        setSenders([...senders, {
            id: newId,
            name: `Sender ${newId}`,
            data: 'ABC',
            color: colors[newId % colors.length],
            icon: <Laptop size={20} />
        }]);
        setDemuxData(prev => ({ ...prev, [newId]: '' }));
    };

    const removeSender = (id: number) => {
        setSenders(senders.filter(s => s.id !== id));
        const newDemux = { ...demuxData };
        delete newDemux[id];
        setDemuxData(newDemux);
    };

    const updateSenderData = (id: number, val: string) => {
        setSenders(senders.map(s => s.id === id ? { ...s, data: val } : s));
    };

    const startSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setMuxOutput([]);
        setDemuxData({});
        setLog(prev => ["Starting TDM Simulation...", ...prev]);

        // Break inputs into chunks
        // TDM: Round Robin. Byte by Byte (or char by char)
        const charQueues: { [key: number]: string[] } = {};
        let maxLength = 0;

        senders.forEach(s => {
            charQueues[s.id] = s.data.split('');
            if (charQueues[s.id].length > maxLength) maxLength = charQueues[s.id].length;
            setDemuxData(prev => ({ ...prev, [s.id]: '' }));
        });

        const packets: { id: number, sourceId: number, data: string, time: number, color: string }[] = [];
        let globalTime = 0;

        // Create Schedule
        for (let i = 0; i < maxLength; i++) {
            // One round of sampling all senders
            senders.forEach((s, idx) => {
                if (charQueues[s.id][i]) {
                    packets.push({
                        id: globalTime++,
                        sourceId: s.id,
                        data: charQueues[s.id][i],
                        time: globalTime,
                        color: s.color
                    });
                }
            });
            // Gap between frames? Optional.
        }

        const packetDuration = 1000 * speed;

        packets.forEach((p, idx) => {
            setTimeout(() => {
                // Enqueue on channel
                setMuxOutput(prev => [...prev, p]);
                setLog(prev => [`Mux: Encoded ${p.data} from Sender ${p.sourceId}`, ...prev.slice(0, 4)]);

                // Travel and Arrive
                setTimeout(() => {
                    setMuxOutput(prev => prev.filter(item => item.id !== p.id));
                    setDemuxData(prev => ({
                        ...prev,
                        [p.sourceId]: (prev[p.sourceId] || '') + p.data
                    }));
                }, 1500 * speed); // Travel time

            }, idx * (800 * speed)); // Stagger slightly faster than full travel to show piling/flow
        });

        const totalTime = packets.length * (800 * speed) + (1500 * speed) + 500;
        setTimeout(() => {
            setIsSimulating(false);
            setLog(prev => ["Simulation Complete.", ...prev]);
        }, totalTime);
    };

    return (
        <div className="flex-col gap-md">
            <h1>Multiplexing (Endgame)</h1>
            <p style={{ maxWidth: '700px' }}>
                <strong>Endgame Network Simulation:</strong> Construct a Time Division Multiplexing (TDM) system.
                Add/Remove senders, configure their ASCII payloads, and watch the Multiplexer interleave the data into a single stream.
            </p>

            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                    <label className="label">System Clock (Speed) {speed}x</label>
                    <input type="range" min="0.5" max="3" step="0.5" value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                </div>
                <button
                    onClick={addSender}
                    disabled={isSimulating || senders.length >= 5}
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid white' }}
                >
                    <Plus size={16} style={{ marginRight: '5px' }} /> Add Sender
                </button>
                <button
                    onClick={startSimulation}
                    disabled={isSimulating}
                    style={{ background: isSimulating ? 'gray' : 'var(--success)', padding: '0.8rem 2rem', color: '#000', fontWeight: 'bold', marginLeft: 'auto' }}
                >
                    {isSimulating ? 'Running Sim...' : 'Start Simulation'}
                </button>
            </div>

            <div className="flex-row gap-lg" style={{ alignItems: 'flex-start' }}>

                {/* Send Side */}
                <div className="flex-col gap-md" style={{ width: '300px' }}>
                    <h3>Senders</h3>
                    {senders.map(s => (
                        <div key={s.id} className="glass-panel" style={{ padding: '1rem', borderLeft: `4px solid ${s.color}`, opacity: isSimulating ? 0.7 : 1 }}>
                            <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                                <span style={{ color: s.color, fontWeight: 'bold', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    {s.icon} {s.name}
                                </span>
                                {!isSimulating && (
                                    <button onClick={() => removeSender(s.id)} style={{ background: 'transparent', padding: 0 }}>
                                        <Trash2 size={16} color="rgba(255,255,255,0.5)" />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                value={s.data}
                                disabled={isSimulating}
                                onChange={(e) => updateSenderData(s.id, e.target.value)}
                                style={{ width: '100%', marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', padding: '5px', borderRadius: '4px' }}
                                maxLength={8}
                            />
                        </div>
                    ))}
                </div>

                {/* Middleware */}
                <div className="flex-col" style={{ flex: 1, minHeight: '400px', position: 'relative', marginTop: '50px' }}>

                    {/* Mux */}
                    <div className="glass-panel flex-center" style={{ width: '60px', height: '300px', position: 'absolute', left: 0, top: 0, zIndex: 5, background: 'rgba(255,255,255,0.05)' }}>
                        <span style={{ writingMode: 'vertical-rl', fontWeight: 'bold', letterSpacing: '4px' }}>MULTIPLEXER</span>
                    </div>

                    {/* Main Channel */}
                    <div style={{ position: 'absolute', left: '60px', right: '60px', top: '140px', height: '20px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', borderRadius: '10px' }}>
                        <AnimatePresence>
                            {muxOutput.map((p) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ left: '0%', opacity: 0 }}
                                    animate={{ left: '95%', opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5 * speed, ease: "linear" }}
                                    style={{
                                        position: 'absolute',
                                        top: '-5px', // Center
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: p.color,
                                        color: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        boxShadow: '0 0 15px rgba(255,255,255,0.5)',
                                        zIndex: 10
                                    }}
                                >
                                    {p.data}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Demux */}
                    <div className="glass-panel flex-center" style={{ width: '60px', height: '300px', position: 'absolute', right: 0, top: 0, zIndex: 5, background: 'rgba(255,255,255,0.05)' }}>
                        <span style={{ writingMode: 'vertical-rl', fontWeight: 'bold', letterSpacing: '4px' }}>DEMULTIPLEXER</span>
                    </div>

                </div>

                {/* Receive Side */}
                <div className="flex-col gap-md" style={{ width: '300px' }}>
                    <h3>Receivers</h3>
                    {senders.map(s => (
                        <div key={s.id} className="glass-panel" style={{ padding: '1rem', borderRight: `4px solid ${s.color}`, minHeight: '88px' }}>
                            <div style={{ color: s.color, fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                Receiver {s.id}
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', minHeight: '34px' }}>
                                {demuxData[s.id]}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <div className="glass-panel" style={{ padding: '1rem', maxHeight: '150px', overflowY: 'auto' }}>
                <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Event Log</h4>
                {log.map((l, i) => <div key={i} style={{ fontSize: '0.8rem', marginTop: '5px' }}>{l}</div>)}
            </div>

        </div>
    );
};

export default Multiplexing;
