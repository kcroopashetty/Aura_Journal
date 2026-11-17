// Enhanced local sentiment and affective analysis (Lexicon-based with weighted scoring)

const keywords = {
  stress: [
    'stress', 'stressed', 'overwhelmed', 'overwhelming', 'deadline', 'deadlines', 'exam', 'exams',
    'fail', 'failed', 'failing', 'pressure', 'burnout', 'burned out', 'busy', 'workload', 'burdened',
    'swamped', 'hectic', 'exhausting', 'frustrated', 'demanding', 'unprepared', 'behind schedule',
    'too much to do', 'pile of work', 'drowning', 'pushed to the limit', 'suffocating'
  ],
  anxious: [
    'anxious', 'anxiety', 'worried', 'worry', 'worries', 'panic', 'panicking', 'nervous', 'scared',
    'dread', 'dreading', 'fret', 'uneasy', 'tense', 'tension', 'apprehensive', 'fear', 'fearful',
    'shaking', 'trembling', 'racing heart', "can't breathe", 'hyperventilating', 'terrified', 'on edge',
    'overthinking', 'racing thoughts', 'restless', 'unease', 'what if', 'freaking out'
  ],
  calm: [
    'relax', 'relaxed', 'relaxing', 'peace', 'peaceful', 'calm', 'calming', 'breathe', 'breathing',
    'meditate', 'meditation', 'quiet', 'sleep', 'sleeping', 'rest', 'rested', 'serene', 'tranquil',
    'content', 'at ease', 'stillness', 'grounded', 'balanced', 'soothing', 'gentle', 'unwind'
  ],
  sad: [
    'sad', 'sadness', 'depressed', 'depression', 'lonely', 'loneliness', 'alone', 'cry', 'crying',
    'cried', 'hopeless', 'tired', 'exhausted', 'gloomy', 'miserable', 'heartbroken', 'breakup',
    'broke up', 'hurt', 'hurting', 'pain', 'empty', 'numb', 'grief', 'mourning', 'loss', 'worthless',
    'nobody cares', 'unloved', 'disappointed', 'isolated', 'tears', 'heavy heart', 'rejected', 'dumped'
  ],
  happy: [
    'happy', 'happiness', 'joy', 'joyful', 'excited', 'exciting', 'good', 'great', 'love', 'loved',
    'proud', 'accomplished', 'wonderful', 'fantastic', 'amazing', 'grateful', 'gratitude', 'thankful',
    'blessed', 'smiling', 'smile', 'laugh', 'laughing', 'thrilled', 'celebrate', 'passed', 'graduated',
    'promotion', 'win', 'winning', 'beautiful', 'delighted', 'optimistic', 'hopeful'
  ]
};

// Intensifiers & Negations
const intensifiers = ['very', 'really', 'extremely', 'so', 'completely', 'totally', 'absolutely', 'deeply'];
const negations = ['not', "don't", 'never', 'no', 'hardly', 'scarcely'];

export const analyzeSentiment = (text, voiceEmotion = null) => {
  if (!text || typeof text !== 'string') {
    return { scores: { stress: 0, anxious: 0, calm: 0, sad: 0, happy: 0 }, dominant: 'neutral', needsIntervention: false };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.replace(/[^a-zA-Z\s']/g, ' ').split(/\s+/).filter(Boolean);

  const scores = {
    stress: 0,
    anxious: 0,
    calm: 0,
    sad: 0,
    happy: 0
  };

  // Word-by-word scoring with negation and intensifier sensitivity
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    const isNegated = negations.includes(prevWord);
    const isIntensified = intensifiers.includes(prevWord);
    const weight = isIntensified ? 2.0 : 1.0;

    Object.keys(keywords).forEach(category => {
      if (keywords[category].includes(word)) {
        if (isNegated) {
          // If negated happy ("not happy"), shift toward sad
          if (category === 'happy') scores.sad += 1.5;
          else if (category === 'calm') scores.anxious += 1.5;
        } else {
          scores[category] += weight;
        }
      }
    });
  }

  // Multi-word phrase matching
  Object.keys(keywords).forEach(category => {
    keywords[category].forEach(phrase => {
      if (phrase.includes(' ') && lowerText.includes(phrase)) {
        scores[category] += 2.5;
      }
    });
  });

  // Incorporate voice emotion if available
  if (voiceEmotion && voiceEmotion.emotion) {
    const voiceWeight = (voiceEmotion.confidence / 100) || 0.6;
    const emotionMap = {
      'stressed': 'stress',
      'excited': 'happy',
      'sad': 'sad',
      'calm': 'calm'
    };

    const mappedEmotion = emotionMap[voiceEmotion.emotion];
    if (mappedEmotion && scores[mappedEmotion] !== undefined) {
      scores[mappedEmotion] += voiceWeight * 3;
    }
  }

  // Calculate dominant emotion
  let dominant = 'neutral';
  let maxScore = 0;

  Object.entries(scores).forEach(([emotion, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominant = emotion;
    }
  });

  // Threshold check: If maxScore is very low or 0, it's truly neutral
  if (maxScore < 0.8) {
    dominant = 'neutral';
  }

  // Intervention logic
  const criticalMoods = scores.stress + scores.sad + scores.anxious;
  const positiveMoods = scores.happy + scores.calm;
  const needsIntervention = criticalMoods > 1.5 && criticalMoods >= positiveMoods;

  return {
    scores,
    dominant,
    needsIntervention
  };
};
