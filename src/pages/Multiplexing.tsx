import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Tablet } from 'lucide-react';

const Multiplexing = () => {
    const [sender1, setSender1] = useState("Hi");
    const [sender2, setSender2] = useState("Net");
    const [sender3, setSender3] = useState("Sim");

    const [isSimulating, setIsSimulating] = useState(false);
    const [muxOutput, setMuxOutput] = useState<any[]>([]); // Queue of packets on the channel
    const [demux1, setDemux1] = useState("");
    const [demux2, setDemux2] = useState("");
    const [demux3, setDemux3] = useState("");
    const [log, setLog] = useState<string[]>([]);

    const [speed, setSpeed] = useState(1);

    const startSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setMuxOutput([]);
        setDemux1(""); setDemux2(""); setDemux3("");
        setLog(prev => ["Starting TDM Simulation...", ...prev]);

        // Break inputs into chunks (chars)
        const s1Chars = sender1.split('');
        const s2Chars = sender2.split('');
        const s3Chars = sender3.split('');
        const maxLength = Math.max(s1Chars.length, s2Chars.length, s3Chars.length);

        const packets: { id: number, source: number, data: string, time: number }[] = [];

        // TDM Logic: Cycle through sources
        let timeSlot = 0;
        for (let i = 0; i < maxLength; i++) {
            if (s1Chars[i]) packets.push({ id: timeSlot++, source: 1, data: s1Chars[i], time: (i * 3) + 0 });
            if (s2Chars[i]) packets.push({ id: timeSlot++, source: 2, data: s2Chars[i], time: (i * 3) + 1 });
            if (s3Chars[i]) packets.push({ id: timeSlot++, source: 3, data: s3Chars[i], time: (i * 3) + 2 });
        }

        // Schedule Animations
        packets.forEach((p, idx) => {
            setTimeout(() => {
                setMuxOutput(prev => [...prev, p]);
                setLog(prev => [`Encoded: Source ${p.source} sent '${p.data}'`, ...prev.slice(0, 4)]);

                // Arrive at Demux slightly later
                setTimeout(() => {
                    setMuxOutput(prev => prev.filter(item => item.id !== p.id)); // Remove from channel
                    if (p.source === 1) setDemux1(prev => prev + p.data);
                    if (p.source === 2) setDemux2(prev => prev + p.data);
                    if (p.source === 3) setDemux3(prev => prev + p.data);
                }, 1500 * speed); // Travel time

            }, idx * 1000 * speed);
        });

        // End
        setTimeout(() => {
            setIsSimulating(false);
            setLog(prev => ["Simulation Complete.", ...prev]);
        }, packets.length * 1000 * speed + 2000);
    };

    return (
        <div className="flex-col gap-md">
            <h1>Multiplexing (Endgame Sim)</h1>
            <p style={{ maxWidth: '700px' }}>
                Simulating Time Division Multiplexing (TDM). Multiple senders share a single transmission channel.
                The visualizer shows how packets are interleaved and then reconstructed.
            </p>

            {/* Controls */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                    <label className="label">Simulation Speed: {speed}x (Slower is better)</label>
                    <input type="range" min="0.5" max="2" step="0.5" value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                </div>
                <button
                    onClick={startSimulation}
                    disabled={isSimulating}
                    style={{ background: isSimulating ? 'gray' : 'var(--success)', padding: '1rem 2rem', color: '#000', fontWeight: 'bold' }}
                >
                    {isSimulating ? 'Simulating...' : 'Start Network Simulation'}
                </button>
            </div>

            {/* Network View */}
            <div className="flex-row gap-lg" style={{ alignItems: 'stretch' }}>

                {/* Senders */}
                <div className="flex-col gap-lg" style={{ width: '250px' }}>
                    <SenderCard id={1} icon={<Laptop size={24} />} color="var(--primary)" value={sender1} setValue={setSender1} active={isSimulating} />
                    <SenderCard id={2} icon={<Smartphone size={24} />} color="var(--secondary)" value={sender2} setValue={setSender2} active={isSimulating} />
                    <SenderCard id={3} icon={<Tablet size={24} />} color="var(--accent)" value={sender3} setValue={setSender3} active={isSimulating} />
                </div>

                {/* MUX & Channel */}
                <div className="flex-col" style={{ flex: 1, justifyContent: 'center', position: 'relative' }}>

                    {/* The MUX Unit */}
                    <div className="glass-panel flex-center" style={{ width: '60px', height: '100%', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', position: 'absolute', left: 0, zIndex: 5 }}>
                        <span style={{ writingMode: 'vertical-rl', letterSpacing: '2px', fontWeight: 'bold' }}>MULTIPLEXER</span>
                    </div>

                    {/* The Channel Wire */}
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', position: 'relative', borderRadius: '5px', margin: '0 40px' }}>
                        <AnimatePresence>
                            {muxOutput.map((packet) => (
                                <motion.div
                                    key={packet.id}
                                    initial={{ left: '5%', opacity: 0 }}
                                    animate={{ left: '90%', opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5 * speed, ease: "linear" }}
                                    style={{
                                        position: 'absolute',
                                        top: '-15px',
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: packet.source === 1 ? 'var(--primary)' : packet.source === 2 ? 'var(--secondary)' : 'var(--accent)',
                                        color: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                                        zIndex: 10
                                    }}
                                >
                                    {packet.data}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* The DEMUX Unit */}
                    <div className="glass-panel flex-center" style={{ width: '60px', height: '100%', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', position: 'absolute', right: 0, zIndex: 5 }}>
                        <span style={{ writingMode: 'vertical-rl', letterSpacing: '2px', fontWeight: 'bold' }}>DEMULTIPLEXER</span>
                    </div>

                </div>

                {/* Receivers */}
                <div className="flex-col gap-lg" style={{ width: '250px' }}>
                    <ReceiverCard id={1} icon={<Laptop size={24} />} color="var(--primary)" value={demux1} />
                    <ReceiverCard id={2} icon={<Smartphone size={24} />} color="var(--secondary)" value={demux2} />
                    <ReceiverCard id={3} icon={<Tablet size={24} />} color="var(--accent)" value={demux3} />
                </div>

            </div>

            <div className="glass-panel" style={{ padding: '1rem', maxHeight: '150px', overflowY: 'auto' }}>
                <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>System Log</h4>
                {log.map((l, i) => <div key={i} style={{ fontSize: '0.8rem', marginTop: '5px' }}>{l}</div>)}
            </div>

        </div>
    );
};

const SenderCard = ({ id, icon, color, value, setValue, active }: any) => (
    <div className="glass-panel" style={{ padding: '1rem', borderLeft: `4px solid ${color}`, opacity: active ? 0.8 : 1 }}>
        <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div className="flex-row gap-sm" style={{ color }}>
                {icon} <strong>Sender {id}</strong>
            </div>
        </div>
        <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            disabled={active}
            maxLength={10}
            placeholder="Type..."
            style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', borderRadius: '4px' }}
        />
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '5px' }}>
            {value.length * 8} bits
        </div>
        {/* Connection Line */}
        <div style={{ position: 'absolute', right: '-20px', top: '50%', width: '20px', height: '2px', background: color }}></div>
    </div>
);

const ReceiverCard = ({ id, icon, color, value }: any) => (
    <div className="glass-panel" style={{ padding: '1rem', borderRight: `4px solid ${color}`, minHeight: '105px' }}>
        <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div className="flex-row gap-sm" style={{ color }}>
                {icon} <strong>Receiver {id}</strong>
            </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', minHeight: '34px', color }}>
            {value}
        </div>
        {/* Connection Line */}
        <div style={{ position: 'absolute', left: '-20px', top: '50%', width: '20px', height: '2px', background: color }}></div>
    </div>
);

export default Multiplexing;
