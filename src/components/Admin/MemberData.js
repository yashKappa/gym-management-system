import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import './MemberData.css';

const MemberData = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [noneTrainerCount, setNoneTrainerCount] = useState(0);
  const [personalTrainerCount, setPersonalTrainerCount] = useState(0);

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const generateWeekLabels = (start) => {
    const labels = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      labels.push(formatDate(d));
    }
    return labels;
  };

  const fetchMembers = async () => {
    try {
      const memberRef = collection(db, 'member');
      const snapshot = await getDocs(memberRef);
      const members = snapshot.docs.map(doc => doc.data());

      setMemberCount(members.length);

      // Count trainer categories
      const noneCount = members.filter(m => m.trainer === "None").length;
      const personalCount = members.filter(m => m.trainer === "Personal Trainer").length;
      setNoneTrainerCount(noneCount);
      setPersonalTrainerCount(personalCount);

      // Weekly chart logic
      const now = new Date();
      now.setDate(now.getDate() + currentWeekOffset * 7);
      const weekStart = getWeekStart(now);
      const weekLabels = generateWeekLabels(weekStart);

      const counts = {};
      weekLabels.forEach(date => { counts[date] = 0; });

      members.forEach((member) => {
        if (member.joiningDateTime) {
          const joinDate = new Date(member.joiningDateTime);
          const joinStr = formatDate(joinDate);
          if (counts.hasOwnProperty(joinStr)) {
            counts[joinStr]++;
          }
        }
      });

      const data = weekLabels.map(date => ({
        date,
        count: counts[date],
      }));

      setWeeklyData(data);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentWeekOffset]);

  return (
    <div className="member-container">
      <h2>Total Members: {memberCount}</h2>
      <p>Trainer: None <strong>{noneTrainerCount}</strong></p>
      <p>Trainer: Personal Trainer <strong>{personalTrainerCount}</strong></p>

      <div className="bar-controls">
        <button onClick={() => setCurrentWeekOffset(prev => prev - 1)}>Previous Week</button>
        <button onClick={() => setCurrentWeekOffset(prev => prev + 1)}>Next Week</button>
      </div>

      <div className='graph'>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
           <defs>
    <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#000000ff" stopOpacity={1} />
      <stop offset="100%" stopColor="#777777ff" stopOpacity={1} />
    </linearGradient>
  </defs>
          <Bar dataKey="count" fill="url(#memberGradient)" name="New Members" />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MemberData;
