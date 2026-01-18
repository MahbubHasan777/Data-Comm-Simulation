import { useState } from 'react';

const AsciiValues = () => {
    const [input, setInput] = useState('Hello');

    return (
        <div className="flex-col gap-md">
            <h1>ASCII Values</h1>
            <p style={{ maxWidth: '600px' }}>
                Every character you type is stored as a number (ASCII code) and then converted to Binary (0s and 1s) for transmission.
            </p>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <label className="label" style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'block' }}>Type something here:</label>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type text..."
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.5rem',
                        borderRadius: '12px',
                        border: '2px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.3)',
                        color: 'white',
                        outline: 'none'
                    }}
                />
            </div>

            <div className="flex-row gap-md" style={{ flexWrap: 'wrap', marginTop: '1rem' }}>
                {input.split('').map((char, index) => {
                    const ascii = char.charCodeAt(0);
                    const binary = ascii.toString(2).padStart(8, '0');

                    return (
                        <div
                            key={index}
                            className="glass-panel"
                            style={{
                                padding: '1rem',
                                minWidth: '120px',
                                textAlign: 'center',
                                animation: `fadeIn 0.3s ease forwards ${index * 0.05}s`,
                                opacity: 0,
                                transform: 'translateY(10px)',
                                background: 'rgba(20, 25, 40, 0.6)'
                            }}
                        >
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>{char}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ASCII: <span style={{ color: '#fff' }}>{ascii}</span></div>
                            <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '4px', color: 'var(--success)' }}>
                                {binary}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default AsciiValues;
