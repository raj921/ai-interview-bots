# Project Structure

```
interview-assistant/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── IntervieweeTab.js      # Candidate chat interface
│   │   ├── IntervieweeTab.css     # Styles for chat interface
│   │   ├── InterviewerTab.js      # Dashboard for viewing candidates
│   │   └── InterviewerTab.css     # Styles for dashboard
│   ├── store/
│   │   ├── store.js               # Redux store configuration
│   │   ├── candidatesSlice.js     # Candidate state management
│   │   └── interviewSlice.js      # Interview session state
│   ├── utils/
│   │   ├── resumeParser.js        # PDF/DOCX parsing utilities
│   │   └── aiService.js           # Question generation & evaluation
│   ├── App.js                     # Main app with tab navigation
│   ├── App.css                    # Main app styles
│   ├── index.js                   # App entry point with Redux Provider
│   └── index.css                  # Global styles
├── package.json
└── README.md
```

## Component Breakdown

### IntervieweeTab.js
**Purpose**: Candidate-facing interview interface

**Key Features**:
- Resume upload with drag-and-drop
- Missing field collection via chat
- Question-by-question interview flow
- Countdown timers per question
- Auto-submit on timeout
- Real-time AI feedback
- Progress tracking
- Welcome back modal for session restoration

**State Management**:
- Local state for current answer, chat messages, candidate info
- Redux state for interview progress, timers, questions, answers

### InterviewerTab.js
**Purpose**: Interviewer dashboard for candidate management

**Key Features**:
- Sortable candidate table
- Search functionality
- Rank display with trophy for #1
- Detailed candidate view modal
- Interview transcript display
- Score visualization
- AI summary display

**State Management**:
- Redux state for candidate list (read-only)
- Local state for search/filter/sort and modal

### Store Configuration

#### store.js
- Configures Redux Toolkit store
- Integrates redux-persist for localStorage
- Persists both candidates and interview slices

#### candidatesSlice.js
**Actions**:
- `addCandidate`: Add new candidate to list
- `updateCandidate`: Update candidate details
- `updateCandidateScore`: Set final score and summary

**State Structure**:
```javascript
{
  list: [
    {
      id: string,
      name: string,
      email: string,
      phone: string,
      startedAt: ISO timestamp,
      completedAt: ISO timestamp,
      questions: Question[],
      answers: Answer[],
      score: number (0-100),
      summary: string
    }
  ]
}
```

#### interviewSlice.js
**Actions**:
- `startInterview`: Initialize interview with questions
- `submitAnswer`: Submit current answer and move to next
- `updateTimeRemaining`: Tick down the timer
- `pauseInterview/resumeInterview`: Control interview flow
- `resetInterview`: Clear state for new interview
- `setStage`: Update interview stage

**State Structure**:
```javascript
{
  currentCandidateId: string,
  currentQuestionIndex: number,
  questions: Question[],
  answers: Answer[],
  isActive: boolean,
  isPaused: boolean,
  timeRemaining: number (seconds),
  stage: 'upload' | 'info-collection' | 'interview' | 'completed'
}
```

### Utility Functions

#### resumeParser.js
**Functions**:
- `parseResume(file)`: Main entry point
- `parsePDF(file)`: Extract text from PDF using PDF.js
- `parseDOCX(file)`: Extract text from DOCX using Mammoth
- `extractFieldsFromText(text)`: Regex-based field extraction

**Supported Fields**:
- Name (first non-email/phone line)
- Email (regex pattern)
- Phone (regex pattern with international support)

#### aiService.js
**Functions**:
- `generateQuestions()`: Returns 6 questions (2 easy, 2 medium, 2 hard)
- `evaluateAnswer(question, answer)`: Scores answer 0-10 with feedback
- `calculateFinalScore(answers)`: Computes percentage score
- `generateSummary(candidate, answers)`: Creates AI summary text

**Question Pools**:
- Easy: 5 questions (20s each)
- Medium: 5 questions (60s each)
- Hard: 5 questions (120s each)

**Scoring Logic**:
- Based on word count and question difficulty
- Provides contextual feedback
- Identifies strengths and areas for improvement

## Data Flow

### Interview Flow
1. Candidate uploads resume → Parse → Extract fields
2. If fields missing → Collect via chat → Validate
3. Generate 6 random questions → Start interview
4. For each question:
   - Display question with timer
   - Collect answer (or auto-submit on timeout)
   - Evaluate answer → Show feedback
   - Move to next question
5. After 6 questions:
   - Calculate final score
   - Generate summary
   - Update candidate record
   - Show completion message

### Dashboard Flow
1. Load candidates from Redux state
2. Filter by search text
3. Sort by selected criteria
4. Display in table
5. On "View Details":
   - Show candidate info
   - Display AI summary
   - Show Q&A transcript with scores

## State Persistence

**What's Persisted**:
- All candidate records
- Current interview progress
- Questions and answers
- Timers and stage

**When Data Persists**:
- Automatic on every Redux action
- Survives page refresh
- Survives browser close/reopen
- Cleared only when browser data is cleared

**How It Works**:
- Redux Persist middleware intercepts all actions
- Serializes state to JSON
- Stores in localStorage under 'persist:root'
- Rehydrates on app load

## Styling Approach

**Framework**: Ant Design (antd)
**Custom CSS**: Component-specific styling for layout
**Responsive**: Basic responsive design for mobile/tablet

**Key UI Elements**:
- Cards for sections
- Modal for candidate details
- Table with sorting/searching
- Progress bars for interview
- Tags for scores with color coding
- Chat-like message interface

## Future Enhancement Ideas

1. **Real AI Integration**: Replace mock AI with OpenAI/Claude API
2. **Rich Media**: Support video/audio recording
3. **Custom Question Banks**: Allow interviewers to add questions
4. **Multi-role Support**: Different question sets per role
5. **Analytics**: Candidate performance trends
6. **Export**: PDF reports, CSV exports
7. **Authentication**: Secure interviewer access
8. **Backend**: Save data to server for multi-device access
9. **Live Interview Mode**: Real-time interviewer observation
10. **Code Editor**: For technical coding questions
