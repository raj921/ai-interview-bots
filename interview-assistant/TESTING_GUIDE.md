# Testing Guide

## Manual Testing Checklist

### 1. Initial Setup
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm start` to start development server
- [ ] Verify app opens at `http://localhost:3000`
- [ ] Verify two tabs are visible: "Interviewee" and "Interviewer"

### 2. Interviewee Tab - Resume Upload

#### Test Case 1: Upload Valid PDF Resume
1. Stay on "Interviewee" tab
2. Click "Upload Resume" button
3. Select a PDF resume file
4. **Expected**: 
   - Success message appears
   - Name, email, phone extracted (if present in resume)
   - If all fields extracted, interview starts automatically
   - If fields missing, chat prompts for missing info

#### Test Case 2: Upload DOCX Resume
1. Click "Upload Resume"
2. Select a DOCX file
3. **Expected**: Same behavior as PDF

#### Test Case 3: Invalid File Type
1. Try to select a .txt or .jpg file
2. **Expected**: File picker filters out invalid types

#### Test Case 4: Missing Fields Collection
1. Upload a resume missing phone number
2. **Expected**: 
   - Chat message: "Please provide your phone"
   - Input fields appear for missing data
   - Cannot start interview until all fields filled

### 3. Interview Flow

#### Test Case 5: Question Display
1. Complete resume upload and info collection
2. **Expected**:
   - Welcome message with candidate name
   - First question appears (Easy, 20s timer)
   - Timer counts down from 20
   - Progress bar shows 0%

#### Test Case 6: Answer Submission
1. Type an answer in the text area
2. Click "Submit Answer"
3. **Expected**:
   - Answer appears in chat
   - AI feedback appears immediately
   - Score shown (0-10)
   - Next question appears
   - Timer resets for new question
   - Progress bar updates

#### Test Case 7: Timer Auto-Submit
1. Wait for timer to reach 0 without answering
2. **Expected**:
   - Answer auto-submits (empty or partial)
   - Feedback: "No answer provided" with score 0
   - Automatically moves to next question

#### Test Case 8: Complete Interview
1. Answer all 6 questions
2. **Expected**:
   - After 6th answer, completion message appears
   - Final score displayed (0-100)
   - AI summary shown
   - "Start New Interview" button appears

#### Test Case 9: Question Difficulty Progression
1. Observe questions during interview
2. **Expected**:
   - Q1-2: Easy (20s each)
   - Q3-4: Medium (60s each)
   - Q5-6: Hard (120s each)

### 4. Interviewer Dashboard

#### Test Case 10: View Candidates List
1. Complete at least one interview
2. Switch to "Interviewer" tab
3. **Expected**:
   - Table shows completed candidates
   - Columns: Rank, Name, Email, Phone, Score, Completed, Action
   - Top candidate has trophy icon
   - Sorted by score (highest first)

#### Test Case 11: Search Functionality
1. Have multiple candidates
2. Type name in search box
3. **Expected**: Table filters to matching candidates
4. Clear search
5. **Expected**: All candidates visible again

#### Test Case 12: Sort Functionality
1. Click sort dropdown
2. Select "Sort by Name"
3. **Expected**: Candidates sorted alphabetically
4. Select "Sort by Date"
5. **Expected**: Most recent first

#### Test Case 13: View Candidate Details
1. Click "View Details" on any candidate
2. **Expected**:
   - Modal opens
   - Shows candidate info (name, email, phone, score)
   - Shows AI summary
   - Shows complete interview transcript
   - Each Q&A has question, answer, score, feedback
   - Scores color-coded (green ≥7, orange 5-6, red <5)

#### Test Case 14: Multiple Candidates
1. Complete 3+ interviews with different scores
2. Switch to Interviewer tab
3. **Expected**:
   - All candidates listed
   - Correctly ranked by score
   - Search works across all
   - Each clickable for details

### 5. Data Persistence

#### Test Case 15: Session Restoration
1. Start an interview, answer 2 questions
2. Refresh the page (F5)
3. **Expected**:
   - "Welcome Back" modal appears
   - Interview state restored
   - Can continue from where left off
   - Chat history preserved

#### Test Case 16: Complete Data Persistence
1. Complete an interview
2. Close browser completely
3. Reopen and navigate to app
4. Switch to Interviewer tab
5. **Expected**: Candidate still appears with all data

#### Test Case 17: Multiple Sessions
1. Complete interview as "John Doe"
2. Click "Start New Interview"
3. Complete interview as "Jane Smith"
4. **Expected**:
   - Both candidates in dashboard
   - Each has separate data
   - No data mixed up

### 6. Edge Cases

#### Test Case 18: Very Short Answers
1. Answer questions with 1-2 words
2. **Expected**: Low scores (2-3/10) with feedback about brevity

#### Test Case 19: Very Long Answers
1. Answer with 100+ words
2. **Expected**: High scores (8-9/10) with positive feedback

#### Test Case 20: Empty Answer on Submit
1. Try to click Submit without typing
2. **Expected**: Warning message "Please provide an answer"

#### Test Case 21: Tab Switching During Interview
1. Start interview
2. Switch to Interviewer tab mid-interview
3. Switch back to Interviewee
4. **Expected**: Interview state preserved, can continue

#### Test Case 22: No Completed Interviews
1. Fresh app, no interviews done
2. Go to Interviewer tab
3. **Expected**: "No candidates have completed interviews yet"

### 7. UI/UX Testing

#### Test Case 23: Responsive Design
1. Resize browser window
2. Test on mobile viewport (375px)
3. Test on tablet (768px)
4. **Expected**: UI adapts reasonably to different sizes

#### Test Case 24: Timer Visual Warning
1. During interview, let timer go below 10s
2. **Expected**: Timer text turns red as warning

#### Test Case 25: Progress Bar Accuracy
1. Track progress bar through interview
2. **Expected**:
   - 0% at start
   - ~17% after Q1
   - ~33% after Q2
   - ~50% after Q3
   - ~67% after Q4
   - ~83% after Q5
   - 100% after Q6

### 8. Scoring Validation

#### Test Case 26: Score Calculation
1. Complete interview with known word counts:
   - Q1 (Easy): 25 words → Expected ~7-9/10
   - Q2 (Easy): 5 words → Expected ~3/10
   - Q3 (Medium): 45 words → Expected ~6/10
   - Q4 (Medium): 60 words → Expected ~9/10
   - Q5 (Hard): 80 words → Expected ~9/10
   - Q6 (Hard): 20 words → Expected ~2/10
2. Check final score calculation
3. **Expected**: Score = (sum of individual scores / 60) * 100

#### Test Case 27: AI Summary Quality
1. Complete interview with mixed performance
2. Check summary in dashboard
3. **Expected**:
   - Mentions performance level (excellent/good/average/poor)
   - Lists strengths if any questions scored ≥7
   - Lists improvements if questions scored <7

## Performance Testing

### Test Case 28: Load Time
1. Clear cache
2. Load app
3. **Expected**: Initial load < 3 seconds

### Test Case 29: Timer Accuracy
1. Use stopwatch to verify interview timer
2. **Expected**: Timer accurate within 1 second

### Test Case 30: Large Data Set
1. Complete 20+ interviews
2. Check Interviewer dashboard performance
3. **Expected**: 
   - Table loads smoothly
   - Search/sort remain fast
   - No lag when opening details

## Browser Compatibility

Test all major flows in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Known Limitations

1. **PDF Parsing**: Complex PDF layouts may not extract fields correctly
2. **AI Evaluation**: Basic word-count heuristic, not true AI
3. **No Backend**: Data only in browser, can't sync across devices
4. **No Real-time**: Timer continues even if browser tab inactive
5. **Bundle Size**: Large due to PDF.js and Ant Design (~600KB gzipped)

## Automated Testing (Future)

For production app, implement:
- Unit tests for Redux slices
- Integration tests for resume parsing
- E2E tests with Cypress/Playwright
- Component tests with React Testing Library

## Debugging Tips

### Issue: Resume not parsing
- Check console for PDF.js errors
- Verify PDF.js worker loaded correctly
- Try different PDF file

### Issue: Timer not counting
- Check Redux DevTools for state updates
- Verify `updateTimeRemaining` action firing
- Check for useEffect dependencies

### Issue: Data not persisting
- Check localStorage in DevTools
- Look for 'persist:root' key
- Verify redux-persist middleware

### Issue: Candidates not showing in dashboard
- Ensure interview completed (stage === 'completed')
- Check if score was calculated and saved
- Verify `updateCandidateScore` dispatched

## Sample Test Data

### Sample Resume Content (for testing)
```
John Doe
Full Stack Developer

Email: john.doe@example.com
Phone: (555) 123-4567

Experience:
- 5 years React development
- Node.js backend expertise
- MongoDB and PostgreSQL
```

### Expected Extraction
- Name: John Doe
- Email: john.doe@example.com
- Phone: (555) 123-4567
