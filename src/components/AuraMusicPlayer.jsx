import React, { useState, useRef } from 'react';

const TRACKS = [
    {
        id: 'jfKfPfyJRdk',
        title: 'Lofi Girl — Beats to Relax / Journal to',
        category: 'Lofi & Chill',
        icon: '☕',
        desc: 'Gentle, relaxing lofi hip hop beats'
    },
    {
        id: '1ZYbU82GVz4',
        title: 'Calm Piano & Deep Relaxation',
        category: 'Piano',
        icon: '🎹',
        desc: 'Soft piano melodies for unwinding'
    },
    {
        id: 'mPZkdNFkNps',
        title: 'Gentle Rain on Leaves & Window',
        category: 'Nature',
        icon: '🌧️',
        desc: 'Soothing natural rain soundscape'
    },
    {
        id: 'eKFTSSKCzWA',
        title: 'Forest Birds & Stream Sounds',
        category: 'Nature',
        icon: '🌿',
        desc: 'Pure nature ambiance for peaceful focus'
    },
    {
        id: '4xDzrJKXOOY',
        title: '528Hz Miracle Meditation & Healing',
        category: 'Meditation',
        icon: '🌌',
        desc: 'Somatic frequency for emotional balance'
    },
    {
        id: 'DWcJFNfaw9c',
        title: 'Peaceful Acoustic Guitar',
        category: 'Acoustic',
        icon: '🎸',
        desc: 'Warm acoustic fingerpicking'
    }
];

const AuraMusicPlayer = ({ isOpen, onClose }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [customUrl, setCustomUrl] = useState('');
    const [customTrack, setCustomTrack] = useState(null);
    const [playbackError, setPlaybackError] = useState(false);

    const currentTrack = customTrack || TRACKS[currentTrackIndex];

    const extractYouTubeId = (url) => {
        if (!url) return null;
        // Matches standard youtube, youtu.be, and music.youtube.com URLs
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([^"&?\/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const handlePlayCustom = (e) => {
        e.preventDefault();
        const id = extractYouTubeId(customUrl.trim());
        if (id) {
            setCustomTrack({
                id,
                title: 'Custom YouTube Music Track',
                category: 'User Custom',
                icon: '🎧',
                desc: 'User selected YouTube stream'
            });
            setIsPlaying(true);
            setPlaybackError(false);
            setCustomUrl('');
        } else {
            alert('Please enter a valid YouTube or YouTube Music link.');
        }
    };

    const handleSelectTrack = (index) => {
        setCustomTrack(null);
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        setPlaybackError(false);
    };

    const handleNextTrack = () => {
        setCustomTrack(null);
        setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
        setIsPlaying(true);
        setPlaybackError(false);
    };

    const handlePrevTrack = () => {
        setCustomTrack(null);
        setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setIsPlaying(true);
        setPlaybackError(false);
    };

    return (
        <>
            {/* Always-Mounted Hidden or Mini Video Stream to Keep Audio Continuous */}
            <div style={{
                position: 'fixed',
                bottom: isPlaying ? '20px' : '-500px',
                right: '20px',
                zIndex: 9999,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Minimized Floating Pill (When playing and panel is closed or minimized) */}
                {(!isOpen || isMinimized) && isPlaying && (
                    <div
                        onClick={() => setIsMinimized(false)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            padding: '10px 18px',
                            borderRadius: '50px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                            border: '2px solid hsl(var(--primary))',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            animation: 'pulseSoft 2s infinite'
                        }}
                        title="Click to expand Aura Music Player"
                    >
                        <span style={{ fontSize: '1.2rem', animation: 'spinSlow 6s linear infinite' }}>
                            {currentTrack.icon}
                        </span>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'hsl(var(--primary))', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {currentTrack.title}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#888' }}>
                                Playing YouTube Soundscape
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPlaying(false);
                            }}
                            style={{
                                background: '#ffebee',
                                border: 'none',
                                color: '#c62828',
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                            title="Pause Music"
                        >
                            ⏸
                        </button>
                    </div>
                )}

                {/* Hidden iFrame container keeping audio playing */}
                <div style={{ width: 1, height: 1, opacity: 0.01, overflow: 'hidden', pointerEvents: 'none' }}>
                    {isPlaying && (
                        <iframe
                            key={currentTrack.id}
                            width="200"
                            height="200"
                            src={`https://www.youtube-nocookie.com/embed/${currentTrack.id}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
                            title="Aura Ambient Music Player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            onError={() => setPlaybackError(true)}
                        />
                    )}
                </div>
            </div>

            {/* Main Interactive Music Panel (Modal / Drawer) */}
            {isOpen && !isMinimized && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(20, 15, 30, 0.4)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 9998,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
                            width: '100%',
                            maxWidth: '520px',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid rgba(205, 180, 219, 0.5)',
                            animation: 'slideUp 0.25s ease-out'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '18px 24px',
                            background: 'linear-gradient(135deg, rgba(205, 180, 219, 0.35), rgba(162, 210, 255, 0.35))',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.6rem' }}>🎵</span>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'hsl(var(--primary))', fontWeight: '700' }}>
                                        Aura Ambient Soundscapes
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                                        YouTube Music for deep reflection, journaling & calm
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    style={{
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '4px 10px',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        color: '#666'
                                    }}
                                    title="Keep playing in floating mini-player"
                                >
                                    🗕 Float
                                </button>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '1.3rem',
                                        color: '#777',
                                        cursor: 'pointer',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Currently Playing Card */}
                        <div style={{
                            padding: '20px 24px',
                            background: isPlaying
                                ? 'linear-gradient(135deg, #f3e5f5, #e1f5fe)'
                                : '#fafafa',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '12px',
                                        background: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.6rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                    }}>
                                        {currentTrack.icon}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: isPlaying ? 'hsl(var(--primary))' : '#888',
                                            textTransform: 'uppercase'
                                        }}>
                                            {isPlaying ? '● NOW PLAYING' : 'READY TO PLAY'}
                                        </div>
                                        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#333' }}>
                                            {currentTrack.title}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#777' }}>
                                            {currentTrack.desc}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '6px' }}>
                                <button
                                    onClick={handlePrevTrack}
                                    style={{
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1rem'
                                    }}
                                    title="Previous Track"
                                >
                                    ⏮
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    style={{
                                        background: isPlaying ? '#c62828' : 'hsl(var(--primary))',
                                        color: 'white',
                                        border: 'none',
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.3rem',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    title={isPlaying ? "Pause Stream" : "Play Stream"}
                                >
                                    {isPlaying ? '⏸' : '▶'}
                                </button>

                                <button
                                    onClick={handleNextTrack}
                                    style={{
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1rem'
                                    }}
                                    title="Next Track"
                                >
                                    ⏭
                                </button>
                            </div>

                            {playbackError && (
                                <small style={{ color: '#d32f2f', textAlign: 'center', fontSize: '0.75rem' }}>
                                    ⚠️ YouTube stream error. Try selecting another track from the playlist below.
                                </small>
                            )}
                        </div>

                        {/* Playlist Selection */}
                        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#555', fontWeight: '700' }}>
                                Curated Calming Soundscapes:
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {TRACKS.map((track, idx) => {
                                    const isCurrent = !customTrack && currentTrackIndex === idx;
                                    return (
                                        <div
                                            key={track.id}
                                            onClick={() => handleSelectTrack(idx)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '10px 14px',
                                                borderRadius: '12px',
                                                border: isCurrent && isPlaying
                                                    ? '2px solid hsl(var(--primary))'
                                                    : '1px solid #eee',
                                                background: isCurrent && isPlaying
                                                    ? 'rgba(205, 180, 219, 0.15)'
                                                    : '#fafafa',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = '#f0f0f5'}
                                            onMouseOut={e => e.currentTarget.style.background = (isCurrent && isPlaying ? 'rgba(205, 180, 219, 0.15)' : '#fafafa')}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '1.3rem' }}>{track.icon}</span>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>
                                                        {track.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                                        {track.category} • {track.desc}
                                                    </div>
                                                </div>
                                            </div>

                                            {isCurrent && isPlaying ? (
                                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>
                                                    Playing 🔊
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                                    Play ▶
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Custom YouTube Track Input */}
                            <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed #ddd' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#555', marginBottom: '6px' }}>
                                    🎧 Play Your Own YouTube / YouTube Music Link:
                                </label>
                                <form onSubmit={handlePlayCustom} style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="url"
                                        placeholder="Paste YouTube or YouTube Music link..."
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            borderRadius: '10px',
                                            border: '1px solid #ccc',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            background: 'hsl(var(--primary))',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Load & Play
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Footer note */}
                        <div style={{
                            padding: '10px 20px',
                            background: '#fafafa',
                            borderTop: '1px solid #eee',
                            fontSize: '0.72rem',
                            color: '#999',
                            textAlign: 'center'
                        }}>
                            Streams audio directly from YouTube / YouTube Music in the background while you journal.
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulseSoft {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};

export default AuraMusicPlayer;
