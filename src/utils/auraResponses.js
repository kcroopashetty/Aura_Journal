// Aura Affective & Situation-Specific Response Engine

// --- TOPIC TAXONOMY & KEYWORDS ---
const TOPIC_PATTERNS = {
    panic_attack: [
        'panic attack', "can't breathe", 'cannot breathe', 'heart racing', 'heart is pounding',
        'hyperventilating', 'shaking', 'trembling', 'suffocating', 'chest is tight', 'feel dizzy',
        'having an attack', 'freaking out'
    ],
    academic: [
        'exam', 'exams', 'test', 'tests', 'finals', 'midterm', 'midterms', 'assignment', 'assignments',
        'studying', 'studied', 'homework', 'grades', 'grade', 'gpa', 'semester', 'coursework',
        'professor', 'prof', 'syllabus', 'flunk', 'failed the test', 'failing class'
    ],
    breakup_relationship: [
        'breakup', 'broke up', 'broken up', 'ex-boyfriend', 'ex-girlfriend', 'my ex', 'dumped',
        'heartbroken', 'heartbreak', 'cheated on', 'partner', 'boyfriend', 'girlfriend', 'relationship',
        'dating', 'fought with my', 'fight with my partner', 'fell out of love'
    ],
    work_career: [
        'boss', 'manager', 'coworker', 'colleague', 'office', 'workplace', 'job', 'career',
        'meeting', 'meetings', 'presentation', 'workload', 'overworked', 'burnout', 'fired',
        'laid off', 'interview', 'interviews', 'client', 'salary', 'resigning', 'quit my job'
    ],
    sleep_insomnia: [
        "can't sleep", 'cannot sleep', 'insomnia', 'awake at', 'tossing and turning', 'nightmare',
        'nightmares', 'bedtime thoughts', 'sleep deprived', 'sleep deprivation', 'wide awake'
    ],
    loneliness: [
        'lonely', 'loneliness', 'alone', 'nobody cares', 'nobody understands', 'no friends',
        'feel isolated', 'feeling isolated', 'left out', 'invisible', 'nobody to talk to', 'abandoned'
    ],
    self_doubt: [
        'hate myself', 'worthless', 'i am a failure', "i'm a failure", 'not good enough', 'imposter',
        'stupid', 'idiot', 'ashamed', 'guilty', 'ugly', 'everyone is better than me', 'mess everything up'
    ],
    grief_loss: [
        'passed away', 'died', 'death', 'lost my dog', 'lost my cat', 'lost my pet', 'funeral',
        'grief', 'grieving', 'mourning'
    ],
    family_conflict: [
        'parents', 'mom', 'dad', 'mother', 'father', 'family fight', 'yelled at me', 'screamed at me',
        'strict parents', 'family drama', 'disappointed my parents', 'toxic family'
    ],
    celebration_win: [
        'got the job', 'got hired', 'passed my', 'passed the exam', 'graduated', 'promotion',
        'promoted', 'won', 'celebrate', 'celebrating', 'proud of myself', 'accomplished my', 'did it!'
    ]
};

// --- TOPIC-SPECIFIC EMPATHETIC RESPONSES ---
const TOPIC_RESPONSES = {
    panic_attack: [
        "I'm right here with you. Put both feet flat on the floor, relax your shoulders, and let's take a slow, gentle breath together. You are safe in this physical moment.",
        "Your body is in a state of high alarm right now, but this feeling will peak and then pass. You don't have to fight it—just let your breath slow down."
    ],
    academic: [
        "Academic pressure can feel suffocating when deadlines and expectations pile up. Remember: an exam or grade measures a moment in time, not your intelligence or your human worth.",
        "Studying under intense pressure drains both your mind and body. It's completely valid to feel exhausted. Let's break things down so you don't have to carry the whole semester at once."
    ],
    breakup_relationship: [
        "Relationship pain cuts so deeply because you invested genuine love and vulnerability. It's completely okay if you feel heartbroken, disoriented, or grieving today.",
        "Going through a breakup is emotionally and physically exhausting. Be as gentle with yourself as you would be with a dear friend nursing a heavy heart."
    ],
    work_career: [
        "Workplace demands and career expectations can push you toward severe burnout when you're carrying too much. Your job is what you do, not your identity or worth as a person.",
        "It sounds like work is draining your energy reserves. When the workload never seems to stop, giving yourself permission to disconnect is an act of self-preservation."
    ],
    sleep_insomnia: [
        "Tossing and turning with a racing mind in the dark is frustrating and lonely. When your brain won't shut off, forcing sleep usually makes it worse.",
        "Nighttime often magnifies all of our worries. Let's release the pressure to sleep right this second, and just focus on giving your body restful stillness."
    ],
    loneliness: [
        "Feeling lonely or disconnected from people is one of the heaviest emotional weights to carry. Even if it feels like nobody understands, your presence and voice matter here.",
        "I hear you. Feeling unseen or isolated hurts deeply. Thank you for reaching out and sharing this space with me today—you don't have to carry it all by yourself."
    ],
    self_doubt: [
        "That harsh voice in your head is being unfairly cruel to you right now. You are holding yourself to impossible standards that you would never demand of someone you love.",
        "Making a mistake or having a rough day does not make you a failure. You are human, learning, and navigating hard things. Give yourself the kindness you deserve."
    ],
    grief_loss: [
        "I am so deeply sorry for your loss. Grief has no schedule and no right or wrong timeline. Please give yourself all the time and space you need to feel whatever comes up.",
        "Holding space for grief is heavy and tender. There are no words to make it magically better, but I'm here to listen whenever you want to remember or let tears fall."
    ],
    family_conflict: [
        "Tension with family is especially exhausting because those relationships touch our deepest roots. It's completely understandable that this has left you feeling shaken or hurt.",
        "Navigating expectations and conflict at home can leave you feeling trapped or misunderstood. Remember that your feelings, boundaries, and perspective are valid."
    ],
    celebration_win: [
        "That is amazing news! Take a moment right now to truly soak this in—you put in the effort, you persevered, and you achieved it. I'm genuinely proud of you! ✨",
        "Celebrate this win! In the midst of all of life's demands, you made this happen. Let yourself feel full of joy and pride today! 🎉"
    ]
};

// Generic Fallback Responses by Dominant Mood
const MOOD_RESPONSES = {
    sad: [
        "I hear the heaviness in your words. When your energy is depleted, the kindest thing you can do is take everything one slow, gentle step at a time. 💙",
        "It's completely okay to not be okay right now. You don't have to put on a brave face here—your feelings are valid and safe with me."
    ],
    anxious: [
        "I can feel how wound up and tense things feel for you right now. Let's pause and ground ourselves—one breath, one moment at a time. 🌬️",
        "Anxiety tries to pull your thoughts into an overwhelming future. Let's gently bring your awareness back to the ground beneath you right now."
    ],
    stress: [
        "It sounds like your plate is overflowing and your mind is carrying too much. When everything feels urgent, remember that not everything has to be solved today.",
        "You've been pushing yourself hard. Give yourself permission to pause for just five minutes—the world can wait while you catch your breath."
    ],
    happy: [
        "I love hearing this lightness in your voice! Hold onto this warmth, savor the moment, and let it recharge your spirit. ✨",
        "What a wonderful reflection. These positive moments are anchors—thank you for sharing your joy today! 🌟"
    ],
    calm: [
        "There is such a grounded, peaceful clarity in what you wrote. Moments of stillness like this are so valuable for your emotional well-being. 🕊️",
        "Holding onto peace in a busy world is a quiet superpower. Carry this grounded calm forward with you today. 🌿"
    ],
    neutral: [
        "Thank you for reflecting and sharing your thoughts. Journaling your daily experiences is a powerful habit for self-discovery.",
        "I'm listening. Taking a few moments to check in with yourself like this gives your mind a clear space to process the day."
    ]
};

// --- CARE MODE: Risk Detection ---
const riskKeywords = [
    'end it all', 'kill myself', 'want to die', 'no reason to live',
    'better off dead', "can't go on", 'suicide', 'self harm', 'self-harm',
    'hurt myself', 'give up on life', 'no point in living', "don't want to be here",
    'want to disappear', 'hopeless', 'nothing matters anymore', 'end my life',
    'cut myself', 'wish i was dead', 'take my own life'
];

export const detectRisk = (text) => {
    if (!text || typeof text !== 'string') return false;
    const lower = text.toLowerCase();
    return riskKeywords.some(keyword => lower.includes(keyword));
};

export const careResponses = [
    "I hear how much pain you are carrying right now, and I care about your safety above all else. 💙 You are not alone, and you do not have to carry this alone. Let's take a slow breath together.",
    "Thank you for trusting me with this truth. What you are feeling is real and heavy, but please know there is support waiting for you right now. 💙 Let's take this one gentle step at a time.",
    "I am here with you right now. 💙 Your life and your presence matter deeply. Let's slow everything down, ground your breath, and connect with people who can support you."
];

// Helper to detect specific topic from text
const detectTopic = (text) => {
    const lower = text.toLowerCase();
    for (const [topic, patterns] of Object.entries(TOPIC_PATTERNS)) {
        if (patterns.some(pattern => lower.includes(pattern))) {
            return topic;
        }
    }
    return null;
};

// 4. Intent Detection
const detectIntent = (text) => {
    const lower = text.toLowerCase();
    const offTopicKeywords = ['weather', 'what is 2+', 'python code', 'who won the match', 'tell me a joke about', 'stock price', 'bitcoin'];
    if (offTopicKeywords.some(w => lower.includes(w))) return 'off_topic';
    return 'emotional';
};

/**
 * Main response generator: Accurate, situation-aware, empathetic,
 * and proactively suggests ambient music + activities when user feels low.
 */
export const generateAuraResponse = (text, mood, userContext, history = []) => {
    const intent = detectIntent(text);

    if (intent === 'off_topic') {
        return "I'm here as your personal wellness and reflection journal. I'm all ears if you'd like to talk about how you're feeling or how your day has been. 💙";
    }

    const detectedTopic = detectTopic(text);
    let baseResponse = '';

    // 1. Topic-Specific or Mood-Specific Core
    if (detectedTopic && TOPIC_RESPONSES[detectedTopic]) {
        const pool = TOPIC_RESPONSES[detectedTopic];
        baseResponse = pool[Math.floor(Math.random() * pool.length)];
    } else {
        const moodPool = MOOD_RESPONSES[mood] || MOOD_RESPONSES.neutral;
        baseResponse = moodPool[Math.floor(Math.random() * moodPool.length)];
    }

    // 2. Persona Context Injection
    if (userContext && detectedTopic !== 'celebration_win') {
        const lowerContext = userContext.toLowerCase();
        if ((lowerContext.includes('student') || lowerContext.includes('study')) && (mood === 'stress' || mood === 'anxious' || detectedTopic === 'academic')) {
            baseResponse += " Being a student carries so much invisible pressure.";
        } else if (lowerContext.includes('professional') || lowerContext.includes('work')) {
            if (mood === 'stress' || detectedTopic === 'work_career') {
                baseResponse += " Career stress can easily consume your peace if you don't take time to recharge.";
            }
        }
    }

    // 3. Proactive Calming Music & Activity Suggestions when feeling low / stressed / anxious
    const isLowOrStressed = ['sad', 'stress', 'anxious'].includes(mood) ||
        ['panic_attack', 'academic', 'breakup_relationship', 'work_career', 'sleep_insomnia', 'loneliness', 'self_doubt'].includes(detectedTopic);

    if (isLowOrStressed) {
        // Suggest music + activities tailored to the specific distress
        if (detectedTopic === 'panic_attack') {
            baseResponse += "\n\n🌬️ Let's ground your body right now. I can put on some gentle rain sounds while we do a 4-7-8 breathing exercise together. [SUGGEST_MUSIC] [SHOW_EXERCISES]";
        } else if (detectedTopic === 'sleep_insomnia') {
            baseResponse += "\n\n🌧️ Would you like to put on some soft rain sounds or deep sleep meditation music while you rest your eyes? [SUGGEST_MUSIC]";
        } else if (detectedTopic === 'work_career' || detectedTopic === 'academic' || mood === 'stress') {
            baseResponse += "\n\n🎧 To help clear the mental fog, I can play some peaceful lo-fi focus beats or guide you through breaking this down into 3 tiny steps. [SUGGEST_MUSIC] [SHOW_EXERCISES]";
        } else if (detectedTopic === 'breakup_relationship' || detectedTopic === 'loneliness' || mood === 'sad') {
            baseResponse += "\n\n🎵 Would putting on some calm piano or relaxing lo-fi music bring a little comfort right now? We could also try a self-compassion exercise together. [SUGGEST_MUSIC] [SHOW_EXERCISES] [SHOW_GAMES]";
        } else {
            baseResponse += "\n\n🌿 Let's take care of your mind right now. I can start some soothing ambient soundscapes for you, or we can do a quick 1-minute calming exercise. [SUGGEST_MUSIC] [SHOW_EXERCISES]";
        }
    } else if (mood === 'happy' || detectedTopic === 'celebration_win') {
        baseResponse += "\n\n✨ Want to capture this good feeling with some uplifting acoustic melodies, or jot down a gratitude note? [SUGGEST_MUSIC] [SHOW_GAMES]";
    }

    return baseResponse;
};

// --- Storage Logic ---

export const getConversations = () => {
    try {
        return JSON.parse(localStorage.getItem('aura_journal_conversations') || '[]');
    } catch {
        return [];
    }
};

export const saveMessage = (role, text) => {
    const conversations = getConversations();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let todayEntry = conversations.find(c => c.date === today);

    if (!todayEntry) {
        todayEntry = { date: today, messages: [] };
        conversations.unshift(todayEntry); // Add to beginning (newest first)
    }

    todayEntry.messages.push({ role, text, timestamp: new Date().toISOString() });

    // Store updated conversations
    localStorage.setItem('aura_journal_conversations', JSON.stringify(conversations));

    // Cleanup old entries beyond 30 days
    cleanupOldConversations();
};

export const cleanupOldConversations = () => {
    try {
        const conversations = getConversations();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

        const filtered = conversations.filter(c => c.date >= cutoffDate);

        if (filtered.length !== conversations.length) {
            localStorage.setItem('aura_journal_conversations', JSON.stringify(filtered));
        }
    } catch {
        // fail silently
    }
};

export const clearTodayConversation = () => {
    try {
        const conversations = getConversations();
        const today = new Date().toISOString().split('T')[0];
        const filtered = conversations.filter(c => c.date !== today);
        localStorage.setItem('aura_journal_conversations', JSON.stringify(filtered));
    } catch {
        // fail silently
    }
};

export const saveExerciseToDiary = (exerciseType, userResponse) => {
    saveMessage('user', `[Completed ${exerciseType}]\n${userResponse}`);

    const words = userResponse.split(/\s+/).filter(w => w.length > 4);
    const keyword = words.length > 0 ? words[Math.floor(Math.random() * words.length)].replace(/[.,!?]/g, '') : 'moment';

    const auraReplies = [
        `That sounds like a comforting ${keyword}. You gave your mind a place to rest 🌿`,
        `Thank you for sharing that ${keyword}. It's wonderful that you took this time for yourself ✨`,
        `Focusing on ${keyword} is a great step. I'm proud of you for trying this exercise 💙`,
        `Holding onto that ${keyword} can be very grounding. You did really well 🌟`
    ];

    const reply = auraReplies[Math.floor(Math.random() * auraReplies.length)];

    setTimeout(() => {
        saveMessage('aura', reply);
    }, 500);
};
