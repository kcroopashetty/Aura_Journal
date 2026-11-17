import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FacialMoodCapture = ({ onMoodDetected, facialMood }) => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isLiveTracking, setIsLiveTracking] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [localMood, setLocalMood] = useState(facialMood);
    const [cameraError, setCameraError] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [liveConfidence, setLiveConfidence] = useState(null);
    const [sessionHistory, setSessionHistory] = useState([]);

    const videoRef = useRef(null);
    const intervalRef = useRef(null);
    const isDetectingRef = useRef(false);

    const moodMap = {
        happy: { label: 'Happy', emoji: '😄', color: '#4caf50' },
        neutral: { label: 'Neutral', emoji: '😐', color: '#7e57c2' },
        sad: { label: 'Sad', emoji: '😔', color: '#29b6f6' },
        angry: { label: 'Stressed', emoji: '😵', color: '#ef5350' },
        fear: { label: 'Anxious', emoji: '😰', color: '#ff9800' },
        surprise: { label: 'Neutral', emoji: '😐', color: '#ab47bc' },
        disgusted: { label: 'Stressed', emoji: '😵', color: '#e53935' }
    };

    // Load Face-API models once on mount
    useEffect(() => {
        let isMounted = true;
        const loadModels = async () => {
            setIsModelLoading(true);
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceExpressionNet.loadFromUri('/models');
                if (isMounted) {
                    setIsModelLoaded(true);
                }
            } catch (error) {
                console.error("Error loading face models:", error);
                if (isMounted) {
                    setCameraError("Failed to load facial recognition models.");
                }
            } finally {
                if (isMounted) setIsModelLoading(false);
            }
        };
        loadModels();
        return () => {
            isMounted = false;
            stopCamera();
        };
    }, []);

    // Sync external facialMood if updated
    useEffect(() => {
        if (facialMood) {
            setLocalMood(facialMood);
        }
    }, [facialMood]);

    const startCamera = async (enableLive = false) => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
                if (enableLive) {
                    setIsLiveTracking(true);
                }
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            setCameraError("Camera unavailable or permission denied.");
            setIsCameraActive(false);
            setIsLiveTracking(false);
        }
    };

    const stopCamera = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
        setIsLiveTracking(false);
        setLiveConfidence(null);
    }, []);

    // Perform a single frame detection
    const detectFrame = useCallback(async () => {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return null;
        if (isDetectingRef.current) return null; // Avoid overlapping async ticks

        try {
            isDetectingRef.current = true;
            const detections = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
            ).withFaceExpressions();

            if (detections && detections.expressions) {
                const expressions = detections.expressions;
                const dominant = Object.keys(expressions).reduce((a, b) =>
                    expressions[a] > expressions[b] ? a : b
                );
                const confidence = Math.round(expressions[dominant] * 100);
                const moodConfig = moodMap[dominant] || moodMap.neutral;

                const detectedMood = {
                    emotion: dominant,
                    label: moodConfig.label.toLowerCase(),
                    emoji: moodConfig.emoji,
                    color: moodConfig.color,
                    confidence,
                    isLive: true,
                    timestamp: Date.now()
                };

                setLocalMood(detectedMood);
                setLiveConfidence(confidence);
                setSessionHistory(prev => [...prev.slice(-30), dominant]);

                if (onMoodDetected) {
                    onMoodDetected(detectedMood);
                }
                return detectedMood;
            }
        } catch (err) {
            console.warn("Face detection frame error:", err);
        } finally {
            isDetectingRef.current = false;
        }
        return null;
    }, [onMoodDetected]);

    // Live Tracking Loop (Runs every 800ms when active)
    useEffect(() => {
        if (isCameraActive && isLiveTracking && isModelLoaded) {
            // Run immediately
            detectFrame();
            // Start periodic cycle
            intervalRef.current = setInterval(() => {
                detectFrame();
            }, 800);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isCameraActive, isLiveTracking, isModelLoaded, detectFrame]);

    // Manual single snapshot capture
    const captureSnapshot = async () => {
        const mood = await detectFrame();
        if (mood) {
            stopCamera();
        } else {
            alert("Could not detect any face clearly. Please face the camera and try again.");
        }
    };

    return (
        <div className="card facial-mood-card" style={{
            padding: '16px',
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            border: isLiveTracking ? '2px solid hsl(var(--primary))' : '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '18px',
            boxShadow: isLiveTracking ? '0 6px 25px rgba(205, 180, 219, 0.35)' : '0 4px 15px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>
                        Facial Expression Sensing
                    </h4>
                    {isLiveTracking && (
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: '#e8f5e9',
                            color: '#2e7d32',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            animation: 'pulse 1.5s infinite'
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2e7d32' }} />
                            LIVE
                        </span>
                    )}
                </div>

                {isCameraActive && (
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.8rem',
                            color: 'hsl(var(--text-muted))',
                            cursor: 'pointer',
                            padding: '2px 6px',
                            borderRadius: '6px'
                        }}
                        title={isMinimized ? "Expand video" : "Minimize video preview"}
                    >
                        {isMinimized ? '🗖 Expand' : '🗕 Compact'}
                    </button>
                )}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: '1.2rem' }}>
                {isLiveTracking
                    ? "Continuously analyzing your facial micro-expressions in real time as you journal."
                    : "Track your facial emotions to cross-verify how you feel while you write. Processed 100% locally."}
            </p>

            {/* Video Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#1a1a24',
                height: isCameraActive ? (isMinimized ? '60px' : '200px') : '0',
                transition: 'height 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    onCanPlay={() => videoRef.current && videoRef.current.play()}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)'
                    }}
                />

                {/* Live Floating HUD on Video */}
                {isCameraActive && localMood && !isMinimized && (
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        right: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(4px)',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.85rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{localMood.emoji}</span>
                            <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                                {localMood.label}
                            </span>
                        </div>
                        {liveConfidence && (
                            <span style={{ fontSize: '0.75rem', opacity: 0.9, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '8px' }}>
                                {liveConfidence}% match
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {!isCameraActive ? (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
                        <button
                            onClick={() => startCamera(true)}
                            disabled={isModelLoading || cameraError}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 12px rgba(205, 180, 219, 0.4)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            title="Continuously track facial expression in the background while journaling"
                        >
                            {isModelLoading ? '⏳ Loading ML Models...' : '🟢 Live Track While Journaling'}
                        </button>

                        <button
                            onClick={() => startCamera(false)}
                            disabled={isModelLoading || cameraError}
                            className="btn-secondary"
                            style={{
                                padding: '10px 14px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                border: '1px solid var(--divider)',
                                background: 'white',
                                cursor: 'pointer'
                            }}
                            title="Take a single snapshot photo"
                        >
                            📸 Snapshot
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                        {isLiveTracking ? (
                            <button
                                onClick={() => setIsLiveTracking(false)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: '#fff3e0',
                                    color: '#e65100',
                                    border: '1px solid #ffe0b2',
                                    cursor: 'pointer'
                                }}
                            >
                                ⏸️ Pause Live
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsLiveTracking(true)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: '#e8f5e9',
                                    color: '#2e7d32',
                                    border: '1px solid #c8e6c9',
                                    cursor: 'pointer'
                                }}
                            >
                                ▶️ Resume Live
                            </button>
                        )}

                        <button
                            onClick={captureSnapshot}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                background: 'hsl(var(--card-bg))',
                                border: '1px solid var(--divider)',
                                cursor: 'pointer'
                            }}
                        >
                            🎯 Freeze Frame
                        </button>

                        <button
                            onClick={stopCamera}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                background: '#ffebee',
                                color: '#c62828',
                                border: '1px solid #ffcdd2',
                                cursor: 'pointer',
                                marginLeft: 'auto'
                            }}
                        >
                            Turn Off
                        </button>
                    </div>
                )}

                {cameraError && (
                    <small style={{ color: '#ff4d4d', fontSize: '0.75rem', width: '100%', display: 'block' }}>
                        ⚠️ {cameraError}
                    </small>
                )}

                {/* Current Emotion Pill */}
                {localMood && !isCameraActive && (
                    <div style={{
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'white',
                        padding: '6px 14px',
                        borderRadius: '50px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        border: '1px solid #eee'
                    }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>Last Detected:</span>
                        <span style={{
                            padding: '3px 10px',
                            fontSize: '0.85rem',
                            textTransform: 'capitalize',
                            fontWeight: '600',
                            borderRadius: '12px',
                            background: 'hsl(var(--primary) / 0.1)',
                            color: 'hsl(var(--primary))'
                        }}>
                            {localMood.emoji} {localMood.label}
                        </span>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    🔒 Edge privacy: All video frames are processed in-browser WebGL and never saved or transmitted.
                </small>
            </div>
        </div>
    );
};

export default FacialMoodCapture;
