import { Github, Linkedin } from 'lucide-react';

const About = () => {
    return (
        <div className="flex-center" style={{ height: '80vh' }}>
            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                <div
                    className="flex-center"
                    style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem auto', overflow: 'hidden', border: '3px solid var(--primary)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}
                >
                    <img src="/profile.jpg" alt="Mahbub Hasan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <h1 style={{ marginBottom: '0.5rem' }}>Mahbub Hasan</h1>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1.5rem' }}>CSE Student @ AIUB</p>

                <p style={{ lineHeight: '1.8', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    I am a passionate learner and always try to learn new things. I am also a passionate programmer and always try to make something new and innovative.
                </p>

                <div className="flex-row flex-center gap-md">
                    <a
                        href="https://github.com/mahbubhasan777"
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '25px', color: 'white', textDecoration: 'none', transition: 'background 0.3s' }}
                    >
                        <Github size={20} /> GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/mahbub-hasan-634766378/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', background: '#0077b5', borderRadius: '25px', color: 'white', textDecoration: 'none' }}
                    >
                        <Linkedin size={20} /> LinkedIn
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
