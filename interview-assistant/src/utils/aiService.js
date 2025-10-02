import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('ERROR: REACT_APP_GEMINI_API_KEY is not configured in .env file!');
  console.error('Please add your Gemini API key to use AI features.');
}

let genAI;
let model;

const initializeGemini = () => {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
  }
  
  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(API_KEY);
      model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      console.log('Gemini AI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      throw new Error('Failed to initialize AI. Please check your API key.');
    }
  }
  
  return model;

};

export const generateQuestions = async () => {
  try {
    const aiModel = initializeGemini();

    const prompt = `Generate 6 technical interview questions for a Full Stack Developer position (React/Node.js).

Requirements:
- 2 EASY questions (20 seconds to answer): Basic JavaScript/React concepts
- 2 MEDIUM questions (60 seconds to answer): Practical implementation and frameworks
- 2 HARD questions (120 seconds to answer): System design and architecture

Return ONLY a JSON array with this exact format:
[
  {"text": "question text", "difficulty": "easy", "timeLimit": 20},
  {"text": "question text", "difficulty": "easy", "timeLimit": 20},
  {"text": "question text", "difficulty": "medium", "timeLimit": 60},
  {"text": "question text", "difficulty": "medium", "timeLimit": 60},
  {"text": "question text", "difficulty": "hard", "timeLimit": 120},
  {"text": "question text", "difficulty": "hard", "timeLimit": 120}
]

Important: Return ONLY the JSON array, no markdown, no code blocks, no explanation.`;

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const questions = JSON.parse(text);

    if (!Array.isArray(questions) || questions.length !== 6) {
      throw new Error('AI returned invalid questions format. Expected 6 questions.');
    }

    console.log('Successfully generated 6 questions using Gemini AI');
    return questions;
  } catch (error) {
    console.error('Failed to generate questions with Gemini AI:', error);
    throw new Error(`Failed to generate interview questions: ${error.message}`);
  }
};

export const evaluateAnswer = async (question, answer) => {
  if (!answer || answer.trim().length === 0) {
    return {
      score: 0,
      feedback: 'No answer provided.',
    };
  }

  try {
    const aiModel = initializeGemini();

    const prompt = `You are an expert technical interviewer evaluating a Full Stack Developer candidate.

Question (${question.difficulty} difficulty): ${question.text}

Candidate's Answer: ${answer}

Evaluate this answer and provide:
1. A score from 0-10 (where 10 is excellent, 7-9 is good, 4-6 is average, 0-3 is poor)
2. Constructive feedback (2-3 sentences)

Consider:
- Technical accuracy
- Completeness of the answer
- Depth of understanding
- Practical examples (if provided)
- Communication clarity

Return ONLY a JSON object with this exact format:
{"score": 8, "feedback": "Your feedback here"}

Important: Return ONLY the JSON object, no markdown, no code blocks, no explanation.`;

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const evaluation = JSON.parse(text);

    if (typeof evaluation.score !== 'number' || !evaluation.feedback) {
      throw new Error('AI returned invalid evaluation format. Expected score and feedback.');
    }

    evaluation.score = Math.max(0, Math.min(10, Math.round(evaluation.score)));

    console.log(`Answer evaluated: Score ${evaluation.score}/10`);
    return evaluation;
  } catch (error) {
    console.error('Failed to evaluate answer with Gemini AI:', error);
    throw new Error(`Failed to evaluate answer: ${error.message}`);
  }
};

export const calculateFinalScore = (answers) => {
  if (answers.length === 0) return 0;
  
  const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
  const maxScore = answers.length * 10;
  return Math.round((totalScore / maxScore) * 100);
};

export const generateSummary = async (candidate, answers) => {
  const score = calculateFinalScore(answers);
  
  try {
    const aiModel = initializeGemini();

    const questionAnswerPairs = answers
      .map((a, idx) => `Q${idx + 1} (${a.question.split(' ').slice(0, 10).join(' ')}...): Score ${a.score}/10`)
      .join('\n');

    const prompt = `You are an expert technical interviewer. Generate a professional summary for a Full Stack Developer candidate.

Candidate: ${candidate.name}
Final Score: ${score}/100

Individual Question Scores:
${questionAnswerPairs}

Create a concise professional summary (3-4 sentences) that includes:
1. Overall performance assessment
2. Key strengths observed
3. Areas for improvement
4. Hiring recommendation

Tone: Professional, constructive, specific

Return ONLY the summary text, no JSON, no formatting.`;

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    if (!summary || summary.length < 50) {
      throw new Error('AI returned invalid or too short summary.');
    }

    console.log(`Successfully generated summary for ${candidate.name}`);
    return summary;
  } catch (error) {
    console.error('Failed to generate summary with Gemini AI:', error);
    throw new Error(`Failed to generate candidate summary: ${error.message}`);
  }
};
