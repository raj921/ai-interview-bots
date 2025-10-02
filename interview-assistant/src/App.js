import React from 'react';
import { Tabs } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab';
import './App.css';

const { TabPane } = Tabs;

function App() {
  return (
    <div className="App">
      <Tabs defaultActiveKey="1" centered size="large">
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Interviewee
            </span>
          }
          key="1"
        >
          <IntervieweeTab />
        </TabPane>
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Interviewer
            </span>
          }
          key="2"
        >
          <InterviewerTab />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
