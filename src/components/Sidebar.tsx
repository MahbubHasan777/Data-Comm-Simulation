import { NavLink } from 'react-router-dom';
import {
    Activity,
    ArrowRightLeft,
    Binary,
    Calculator,
    Cpu,
    Radio,
    Signal,
    Waves,
    Zap
} from 'lucide-react';

const modules = [
    { path: '/signal-basics', name: '1. Signal Basics', icon: Activity },
    { path: '/transmission', name: '2. Transmission Modes', icon: ArrowRightLeft },
    { path: '/ascii', name: '3. ASCII Values', icon: Binary },
    { path: '/nyquist', name: '4. Nyquist & Shannon', icon: Calculator },
    { path: '/snr', name: '5. SNR & Noise', icon: Waves },
    { path: '/line-coding', name: '6. Line Coding', icon: Cpu },
    { path: '/calculations', name: '7. Bandwidth/Rates', icon: Calculator },
    { path: '/digital-analog', name: '8. Digital to Analog', icon: Radio },
    { path: '/analog-modulation', name: '9. Analog Modulation', icon: Signal },
    { path: '/multiplexing', name: '10. Multiplexing', icon: Zap }, // Using Zap for now
    { path: '/demodulation', name: '11. Demodulation', icon: Radio }, // Reusing Radio
    { path: '/filters', name: '12. Filters', icon: Waves }, // Reusing Waves
];

const Sidebar = () => {
    return (
        <aside
            className="glass-panel"
            style={{
                width: '260px',
                height: '95vh',
                position: 'fixed',
                top: '2.5vh',
                left: '20px',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                zIndex: 100
            }}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--primary)' }}>Modules</h3>
            </div>

            <nav className="flex-col" style={{ gap: '0.5rem', overflowY: 'auto' }}>
                {modules.map((mod) => {
                    const Icon = mod.icon;
                    return (
                        <NavLink
                            key={mod.path}
                            to={mod.path}
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                            style={({ isActive }) => ({
                                textDecoration: 'none',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.2s',
                                border: isActive ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent'
                            })}
                        >
                            <Icon size={18} />
                            <span style={{ fontSize: '0.9rem' }}>{mod.name}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
