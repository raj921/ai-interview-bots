import { createSlice } from '@reduxjs/toolkit';

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    currentCandidateId: null,
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    isActive: false,
    isPaused: false,
    timeRemaining: 0,
    stage: 'upload'
  },
  reducers: {
    startInterview: (state, action) => {
      state.currentCandidateId = action.payload.candidateId;
      state.questions = action.payload.questions;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.isActive = true;
      state.isPaused = false;
      state.stage = 'interview';
      state.timeRemaining = action.payload.questions[0]?.timeLimit || 0;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
      if (state.questions[action.payload]) {
        state.timeRemaining = state.questions[action.payload].timeLimit;
      }
    },
    submitAnswer: (state, action) => {
      state.answers.push(action.payload);
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        state.timeRemaining = state.questions[state.currentQuestionIndex].timeLimit;
      } else {
        state.isActive = false;
        state.stage = 'completed';
      }
    },
    updateTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    pauseInterview: (state) => {
      state.isPaused = true;
    },
    resumeInterview: (state) => {
      state.isPaused = false;
    },
    resetInterview: (state) => {
      state.currentCandidateId = null;
      state.currentQuestionIndex = 0;
      state.questions = [];
      state.answers = [];
      state.isActive = false;
      state.isPaused = false;
      state.timeRemaining = 0;
      state.stage = 'upload';
    },
    setStage: (state, action) => {
      state.stage = action.payload;
    }
  }
});

export const {
  startInterview,
  setCurrentQuestion,
  submitAnswer,
  updateTimeRemaining,
  pauseInterview,
  resumeInterview,
  resetInterview,
  setStage
} = interviewSlice.actions;

export default interviewSlice.reducer;
