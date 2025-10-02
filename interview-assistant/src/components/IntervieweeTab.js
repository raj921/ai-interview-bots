import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, Button, Input, Card, Progress, Typography, Space, message, Modal } from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { parseResume } from '../utils/resumeParser';
import { generateQuestions, evaluateAnswer, calculateFinalScore, generateSummary } from '../utils/aiService';
import { addCandidate, updateCandidate, updateCandidateScore } from '../store/candidatesSlice';
import { startInterview, submitAnswer, updateTimeRemaining, resetInterview, setStage } from '../store/interviewSlice';
import './IntervieweeTab.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const IntervieweeTab = () => {
  const dispatch = useDispatch();
  const interview = useSelector(state => state.interview);
  const candidates = useSelector(state => state.candidates.list);
  
  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '', phone: '' });
  const [missingFields, setMissingFields] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    if (interview.isActive && interview.isPaused) {
      setShowWelcomeBack(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (interview.isActive && !interview.isPaused && interview.timeRemaining > 0) {
      const timer = setInterval(() => {
        const newTime = interview.timeRemaining - 1;
        dispatch(updateTimeRemaining(newTime));
        
        if (newTime === 0) {
          handleSubmitAnswer(true);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview.isActive, interview.isPaused, interview.timeRemaining]);

  const handleFileUpload = async (file) => {
    try {
      const fields = await parseResume(file);
      setCandidateInfo(fields);
      
      const missing = [];
      if (!fields.name) missing.push('name');
      if (!fields.email) missing.push('email');
      if (!fields.phone) missing.push('phone');
      
      setMissingFields(missing);
      dispatch(setStage('info-collection'));
      
      if (missing.length > 0) {
        setChatMessages([{
          type: 'bot',
          text: `Thanks for uploading your resume! I need a bit more information. Please provide your ${missing.join(', ')}.`
        }]);
      } else {
        handleStartInterview(fields);
      }
      
      message.success('Resume uploaded successfully!');
      return false;
    } catch (error) {
      message.error(error.message || 'Failed to parse resume');
      return false;
    }
  };

  const handleInfoSubmit = () => {
    const missing = [];
    if (!candidateInfo.name) missing.push('name');
    if (!candidateInfo.email) missing.push('email');
    if (!candidateInfo.phone) missing.push('phone');
    
    if (missing.length > 0) {
      message.error(`Please provide: ${missing.join(', ')}`);
      return;
    }
    
    handleStartInterview(candidateInfo);
  };

  const handleStartInterview = async (info) => {
    const candidateId = Date.now().toString();
    
    setChatMessages([{ type: 'bot', text: `Welcome ${info.name}! Generating your personalized interview questions using AI... Please wait.` }]);
    
    try {
      const questions = await generateQuestions();
      
      const candidate = {
        id: candidateId,
        ...info,
        startedAt: new Date().toISOString(),
        questions: questions,
        answers: []
      };
      
      dispatch(addCandidate(candidate));
      dispatch(startInterview({ candidateId, questions }));
      
      setChatMessages([
        { type: 'bot', text: `Welcome ${info.name}! Let's begin your Full Stack Developer interview. You'll answer 6 questions: 2 Easy, 2 Medium, and 2 Hard. Good luck!` },
        { type: 'bot', text: `Question 1 (${questions[0].difficulty} - ${questions[0].timeLimit}s): ${questions[0].text}` }
      ]);
    } catch (error) {
      message.error(error.message || 'Failed to generate questions. Please check your API key.');
      dispatch(setStage('upload'));
    }
  };

  const handleSubmitAnswer = async (autoSubmit = false) => {
    const question = interview.questions[interview.currentQuestionIndex];
    const answerText = autoSubmit ? (currentAnswer || 'No answer provided') : currentAnswer;
    
    if (!autoSubmit && !answerText.trim()) {
      message.warning('Please provide an answer');
      return;
    }

    const tempMessages = [
      ...chatMessages,
      { type: 'user', text: answerText },
      { type: 'bot', text: 'Evaluating your answer with AI...' }
    ];
    setChatMessages(tempMessages);

    const evaluation = await evaluateAnswer(question, answerText);
    const answerObj = {
      questionIndex: interview.currentQuestionIndex,
      question: question.text,
      answer: answerText,
      score: evaluation.score,
      feedback: evaluation.feedback,
      submittedAt: new Date().toISOString()
    };
    
    dispatch(submitAnswer(answerObj));
    
    const newMessages = [
      ...chatMessages,
      { type: 'user', text: answerText },
      { type: 'bot', text: evaluation.feedback }
    ];

    const nextIndex = interview.currentQuestionIndex + 1;
    
    if (nextIndex < interview.questions.length) {
      const nextQuestion = interview.questions[nextIndex];
      const difficultyLabel = nextQuestion.difficulty.charAt(0).toUpperCase() + nextQuestion.difficulty.slice(1);
      newMessages.push({
        type: 'bot',
        text: `Question ${nextIndex + 1} (${difficultyLabel} - ${nextQuestion.timeLimit}s): ${nextQuestion.text}`
      });
    } else {
      const allAnswers = [...interview.answers, answerObj];
      const finalScore = calculateFinalScore(allAnswers);
      const candidate = candidates.find(c => c.id === interview.currentCandidateId) || candidateInfo;
      
      newMessages.push({
        type: 'bot',
        text: `Generating your final summary with AI... Please wait.`
      });
      setChatMessages(newMessages);
      
      const summary = await generateSummary(candidate, allAnswers);
      
      dispatch(updateCandidateScore({
        id: interview.currentCandidateId,
        score: finalScore,
        summary
      }));
      
      dispatch(updateCandidate({
        id: interview.currentCandidateId,
        answers: allAnswers
      }));
      
      newMessages[newMessages.length - 1] = {
        type: 'bot',
        text: `Congratulations! You've completed the interview. Your final score is ${finalScore}/100. ${summary}`
      };
    }
    
    setChatMessages(newMessages);
    setCurrentAnswer('');
  };

  const handleRestart = () => {
    dispatch(resetInterview());
    setCandidateInfo({ name: '', email: '', phone: '' });
    setMissingFields([]);
    setCurrentAnswer('');
    setChatMessages([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="interviewee-container">
      <Modal
        title="Welcome Back!"
        open={showWelcomeBack}
        onOk={() => setShowWelcomeBack(false)}
        onCancel={() => setShowWelcomeBack(false)}
      >
        <p>You have an unfinished interview session. Would you like to continue?</p>
      </Modal>

      {interview.stage === 'upload' && (
        <Card className="upload-card">
          <Title level={2}>AI Interview Assistant</Title>
          <Paragraph>Upload your resume (PDF or DOCX) to begin the interview</Paragraph>
          <Upload
            beforeUpload={handleFileUpload}
            accept=".pdf,.docx"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} size="large">
              Upload Resume
            </Button>
          </Upload>
        </Card>
      )}

      {interview.stage === 'info-collection' && missingFields.length > 0 && (
        <Card className="info-card">
          <Title level={3}>Complete Your Information</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {missingFields.includes('name') && (
              <Input
                placeholder="Full Name"
                value={candidateInfo.name}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
              />
            )}
            {missingFields.includes('email') && (
              <Input
                placeholder="Email"
                type="email"
                value={candidateInfo.email}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
              />
            )}
            {missingFields.includes('phone') && (
              <Input
                placeholder="Phone Number"
                value={candidateInfo.phone}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
              />
            )}
            <Button type="primary" onClick={handleInfoSubmit}>
              Start Interview
            </Button>
          </Space>
        </Card>
      )}

      {(interview.stage === 'interview' || interview.stage === 'completed') && (
        <div className="chat-container">
          <Card className="chat-header">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Question {interview.currentQuestionIndex + 1} of {interview.questions.length}</Text>
                {interview.isActive && (
                  <Text type={interview.timeRemaining < 10 ? 'danger' : 'default'}>
                    Time: {formatTime(interview.timeRemaining)}
                  </Text>
                )}
              </div>
              <Progress
                percent={((interview.currentQuestionIndex + (interview.stage === 'completed' ? 1 : 0)) / interview.questions.length) * 100}
                status="active"
              />
            </Space>
          </Card>

          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <Card size="small" className={msg.type}>
                  {msg.text}
                </Card>
              </div>
            ))}
          </div>

          {interview.isActive && (
            <div className="chat-input">
              <TextArea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
                disabled={!interview.isActive}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSubmitAnswer(false)}
                disabled={!interview.isActive}
                style={{ marginTop: 10 }}
              >
                Submit Answer
              </Button>
            </div>
          )}

          {interview.stage === 'completed' && (
            <Button type="primary" onClick={handleRestart} style={{ marginTop: 20 }}>
              Start New Interview
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default IntervieweeTab;
