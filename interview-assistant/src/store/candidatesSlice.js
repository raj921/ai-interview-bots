import { createSlice } from '@reduxjs/toolkit';

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    list: []
  },
  reducers: {
    addCandidate: (state, action) => {
      state.list.push(action.payload);
    },
    updateCandidate: (state, action) => {
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
    },
    updateCandidateScore: (state, action) => {
      const { id, score, summary } = action.payload;
      const index = state.list.findIndex(c => c.id === id);
      if (index !== -1) {
        state.list[index].score = score;
        state.list[index].summary = summary;
        state.list[index].completedAt = new Date().toISOString();
      }
    }
  }
});

export const { addCandidate, updateCandidate, updateCandidateScore } = candidatesSlice.actions;
export default candidatesSlice.reducer;
