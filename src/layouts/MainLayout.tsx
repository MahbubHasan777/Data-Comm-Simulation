import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    return (
        <div className="flex-row" style={{ minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '2rem', marginLeft: '260px' }}>
                <header className="glass-panel flex-center" style={{ padding: '1rem 2rem', marginBottom: '2rem', justifyContent: 'space-between' }}>
                    <h2>Data Comm Sim</h2>
                    <div className="flex-row gap-md">
                        <button>About Me</button>
                        <button>Github</button>
                    </div>
                </header>
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
