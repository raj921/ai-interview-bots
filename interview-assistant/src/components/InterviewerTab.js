import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Table, Card, Input, Select, Modal, Typography, Tag, Space, Divider, Button } from 'antd';
import { SearchOutlined, TrophyOutlined } from '@ant-design/icons';
import './InterviewerTab.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const InterviewerTab = () => {
  const candidates = useSelector(state => state.candidates.list);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const searchLower = searchText.toLowerCase();
      return (
        candidate.name?.toLowerCase().includes(searchLower) ||
        candidate.email?.toLowerCase().includes(searchLower) ||
        candidate.phone?.includes(searchText)
      );
    });

    filtered = filtered.filter(c => c.score !== undefined);

    switch (sortBy) {
      case 'score':
        return filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'name':
        return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'date':
        return filtered.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
      default:
        return filtered;
    }
  }, [candidates, searchText, sortBy]);

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setDetailsVisible(true);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 70,
      render: (_, __, index) => (
        <Space>
          {index === 0 && <TrophyOutlined style={{ color: 'gold', fontSize: 20 }} />}
          {index + 1}
        </Space>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score) => (
        <Tag color={getScoreColor(score)} style={{ fontSize: 16, fontWeight: 'bold' }}>
          {score}/100
        </Tag>
      )
    },
    {
      title: 'Completed',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => date ? new Date(date).toLocaleString() : 'N/A'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>View Details</Button>
      )
    }
  ];

  return (
    <div className="interviewer-container">
      <Card>
        <Title level={2}>Candidate Dashboard</Title>
        
        <Space style={{ marginBottom: 20, width: '100%', justifyContent: 'space-between' }}>
          <Input
            placeholder="Search by name, email, or phone"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          
          <Select value={sortBy} onChange={setSortBy} style={{ width: 200 }}>
            <Option value="score">Sort by Score</Option>
            <Option value="name">Sort by Name</Option>
            <Option value="date">Sort by Date</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredAndSortedCandidates}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'No candidates have completed interviews yet' }}
        />
      </Card>

      <Modal
        title={`Interview Details - ${selectedCandidate?.name}`}
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCandidate && (
          <div className="candidate-details">
            <Card size="small" style={{ marginBottom: 20 }}>
              <Title level={4}>Candidate Information</Title>
              <Text><strong>Name:</strong> {selectedCandidate.name}</Text><br />
              <Text><strong>Email:</strong> {selectedCandidate.email}</Text><br />
              <Text><strong>Phone:</strong> {selectedCandidate.phone}</Text><br />
              <Text><strong>Final Score:</strong> </Text>
              <Tag color={getScoreColor(selectedCandidate.score)} style={{ fontSize: 18, marginLeft: 10 }}>
                {selectedCandidate.score}/100
              </Tag>
            </Card>

            <Card size="small" style={{ marginBottom: 20 }}>
              <Title level={4}>AI Summary</Title>
              <Paragraph>{selectedCandidate.summary}</Paragraph>
            </Card>

            <Card size="small">
              <Title level={4}>Interview Transcript</Title>
              {selectedCandidate.answers?.map((answer, idx) => (
                <div key={idx} className="answer-section">
                  <Divider />
                  <Text strong>Question {idx + 1}:</Text>
                  <Paragraph>{answer.question}</Paragraph>
                  
                  <Text strong>Answer:</Text>
                  <Paragraph style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
                    {answer.answer}
                  </Paragraph>
                  
                  <Space>
                    <Text strong>Score:</Text>
                    <Tag color={answer.score >= 7 ? 'green' : answer.score >= 5 ? 'orange' : 'red'}>
                      {answer.score}/10
                    </Tag>
                    <Text type="secondary">{answer.feedback}</Text>
                  </Space>
                </div>
              ))}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewerTab;
