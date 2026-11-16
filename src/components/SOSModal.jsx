import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import FindHelpNearMe from './FindHelpNearMe';
import CareBreathingAnimation from './CareBreathingAnimation';

const SOSModal = ({ isOpen, onClose, onStartBreathing }) => {
    const [trustedContact, setTrustedContact] = useState(null);
    const [activeTab, setActiveTab] = useState('helplines'); // 'helplines' | 'location' | 'breathe'

    useEffect(() => {
        if (isOpen) {
            try {
                const stored = localStorage.getItem('aura_trusted_contact');
                if (stored) {
                    setTrustedContact(JSON.parse(stored));
                } else {
                    setTrustedContact(null);
                }
            } catch (e) {
                console.error("Error reading trusted contact", e);
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const helplines = [
        {
            name: "Tele-MANAS (Govt. of India)",
            number: "14416",
            displayNum: "14416 / 1800-891-4416",
            desc: "24/7 National Mental Health Toll-Free Line",
            badge: "Govt 24/7"
        },
        {
            name: "KIRAN Helpline",
            number: "18005990019",
            displayNum: "1800-599-0019",
            desc: "Dedicated 24/7 mental health rehabilitation",
            badge: "Toll-Free"
        },
        {
            name: "Vandrevala Foundation",
            number: "+919999666555",
            displayNum: "+91 9999 666 555",
            desc: "Free, confidential 24/7 crisis psychological counseling",
            badge: "24/7 Crisis"
        },
        {
            name: "Emergency Services",
            number: "112",
            displayNum: "112 (Universal Emergency)",
            desc: "Immediate police, ambulance, and disaster assistance",
            badge: "Immediate"
        }
    ];

    const modalContent = (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 10, 25, 0.65)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                animation: 'sosBackdropFade 0.2s ease-out'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35)',
                    width: '100%',
                    maxWidth: '560px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '2px solid rgba(255, 77, 79, 0.4)',
                    opacity: 1,
                    animation: 'sosCardPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.9rem', lineHeight: 1 }}>🚨</span>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#ffffff', fontWeight: '700', letterSpacing: '0.3px' }}>
                                Emergency SOS & Crisis Support
                            </h2>
                            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.95)' }}>
                                You are not alone. Immediate support is here for you.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            border: 'none',
                            color: 'white',
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            flexShrink: 0
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                        title="Close SOS Window"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: '#f7f7f9',
                    borderBottom: '1px solid #ebebeb',
                    padding: '8px 12px',
                    gap: '8px',
                    flexShrink: 0
                }}>
                    {[
                        { id: 'helplines', label: '📞 Helplines' },
                        { id: 'location', label: '📍 Help Near Me' },
                        { id: 'breathe', label: '🌬️ Calm Breath' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '9px 12px',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                                color: activeTab === tab.id ? '#d9363e' : '#555555',
                                fontWeight: activeTab === tab.id ? '700' : '500',
                                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.15s'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Body Content */}
                <div style={{
                    padding: '20px 24px',
                    overflowY: 'auto',
                    flex: 1,
                    background: '#ffffff'
                }}>
                    {/* Trusted Contact Priority Alert */}
                    {trustedContact && (
                        <div style={{
                            background: 'linear-gradient(135deg, #e6f7ff, #f0f5ff)',
                            border: '1px solid #91d5ff',
                            borderRadius: '16px',
                            padding: '14px 18px',
                            marginBottom: '18px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 10px rgba(24, 144, 255, 0.08)'
                        }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#096dd9', textTransform: 'uppercase' }}>
                                    💙 Personal Emergency Contact
                                </span>
                                <h4 style={{ margin: '2px 0 0', color: '#002766', fontSize: '1.05rem' }}>
                                    {trustedContact.name}
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#595959' }}>
                                    {trustedContact.phone}
                                </p>
                            </div>
                            <a
                                href={`tel:${trustedContact.phone.replace(/[-\s]/g, '')}`}
                                style={{
                                    background: '#1890ff',
                                    color: 'white',
                                    padding: '8px 18px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    boxShadow: '0 2px 8px rgba(24, 144, 255, 0.35)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                📞 Call Now
                            </a>
                        </div>
                    )}

                    {/* Tab 1: Helplines */}
                    {activeTab === 'helplines' && (
                        <div>
                            <p style={{ margin: '0 0 14px', fontSize: '0.9rem', color: '#555' }}>
                                Immediate, free, and confidential emergency assistance available 24/7:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {helplines.map((line, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            border: '1px solid #eeeeee',
                                            borderRadius: '14px',
                                            padding: '14px 16px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: '#fafafa',
                                            transition: 'all 0.2s',
                                            gap: '12px'
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.borderColor = '#ff7875';
                                            e.currentTarget.style.background = '#fffafa';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.borderColor = '#eeeeee';
                                            e.currentTarget.style.background = '#fafafa';
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: '700', color: '#262626', fontSize: '0.95rem' }}>
                                                    {line.name}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    background: 'rgba(255, 77, 79, 0.1)',
                                                    color: '#cf1322',
                                                    fontWeight: '700'
                                                }}>
                                                    {line.badge}
                                                </span>
                                            </div>
                                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#777777', lineHeight: '1.2rem' }}>
                                                {line.desc}
                                            </p>
                                        </div>
                                        <a
                                            href={`tel:${line.number}`}
                                            style={{
                                                background: 'linear-gradient(135deg, #ff4d4f, #f5222d)',
                                                color: 'white',
                                                padding: '9px 16px',
                                                borderRadius: '20px',
                                                textDecoration: 'none',
                                                fontWeight: '700',
                                                fontSize: '0.85rem',
                                                boxShadow: '0 3px 10px rgba(255, 77, 79, 0.3)',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0
                                            }}
                                        >
                                            📞 Call {line.displayNum.split('/')[0].trim()}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Help Near Me (Geodesic distance calculation) */}
                    {activeTab === 'location' && (
                        <div>
                            <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
                                Computes distance offline in your browser using the <b>Haversine formula</b>. No GPS data is ever transmitted to a server.
                            </p>
                            <FindHelpNearMe />
                        </div>
                    )}

                    {/* Tab 3: Calming Breath */}
                    {activeTab === 'breathe' && (
                        <div>
                            <CareBreathingAnimation onComplete={() => setActiveTab('helplines')} />
                        </div>
                    )}
                </div>

                {/* Footer Disclaimer */}
                <div style={{
                    padding: '12px 20px',
                    background: '#fff1f0',
                    borderTop: '1px solid #ffa39e',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#cf1322',
                    fontStyle: 'italic',
                    flexShrink: 0
                }}>
                    ⚠️ Aura is an emotional wellness application, not a medical provider. If you are in immediate physical danger, call emergency services (112) immediately.
                </div>
            </div>

            <style>{`
                @keyframes sosBackdropFade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes sosCardPop {
                    from {
                        opacity: 0;
                        transform: scale(0.94) translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );

    return typeof document !== 'undefined'
        ? createPortal(modalContent, document.body)
        : modalContent;
};

export default SOSModal;
