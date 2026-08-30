import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Users, UserX, UserCheck, ChevronLeft, ChevronRight, ShieldAlert, Save } from 'lucide-react';
import './MemberData.css';

// ==========================================================================
// HELPER FUNCTIONS (Moved outside to prevent unnecessary re-creations)
// ==========================================================================
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

// ==========================================================================
// COMPONENT
// ==========================================================================
const MemberData = () => {
  // Member Stats & Chart State
  const [memberCount, setMemberCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [noneTrainerCount, setNoneTrainerCount] = useState(0);
  const [personalTrainerCount, setPersonalTrainerCount] = useState(0);

  // Admin Settings State
  const [maxAdmins, setMaxAdmins] = useState(null);
  const [loadingLimit, setLoadingLimit] = useState(true);
  const [message, setMessage] = useState('');

  const fetchMembers = useCallback(async () => {
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
  }, [currentWeekOffset]);

  const fetchAdminLimit = async () => {
    try {
      const docRef = doc(db, 'Settings', 'adminLimit');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMaxAdmins(docSnap.data().maxAdmins);
      } else {
        setMaxAdmins(3);
      }
    } catch (error) {
      console.error('Error fetching admin limit:', error);
      setMessage('Failed to load admin limit');
    } finally {
      setLoadingLimit(false);
    }
  };

  const handleSaveLimit = async () => {
    if (maxAdmins < 1) {
      setMessage('Admin limit must be at least 1');
      return;
    }
    try {
      await setDoc(doc(db, 'Settings', 'adminLimit'), { maxAdmins });
      setMessage('Admin limit updated successfully!');
    } catch (error) {
      console.error('Error saving admin limit:', error);
      setMessage('Failed to update admin limit');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    fetchAdminLimit();
  }, []);

  return (
    <div className="member-data-container">
      {/* HEADER SECTION */}
      <div className="member-header-section">
        <div>
          <h2 className="member-dashboard-title">Member Analytics & Control</h2>
          <p className="member-dashboard-subtitle">
            Track member registrations, trainer distributions, and configure administrative access limits.
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="member-stats-grid">
        <div className="member-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Members</span>
            <div className="stat-icon-wrapper emerald">
              <Users size={18} />
            </div>
          </div>
          <h3 className="stat-value">{memberCount}</h3>
        </div>

        <div className="member-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">No Trainer</span>
            <div className="stat-icon-wrapper amber">
              <UserX size={18} />
            </div>
          </div>
          <h3 className="stat-value">{noneTrainerCount}</h3>
        </div>

        <div className="member-stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Personal Trainer</span>
            <div className="stat-icon-wrapper blue">
              <UserCheck size={18} />
            </div>
          </div>
          <h3 className="stat-value">{personalTrainerCount}</h3>
        </div>
      </div>

      {/* CHART PANEL */}
      <div className="chart-panel mb-4">
        <div className="chart-header">
          <h4 className="chart-title">Weekly Member Registration Trend</h4>
          <div className="bar-controls">
            <button 
              className="week-nav-btn" 
              onClick={() => setCurrentWeekOffset(prev => prev - 1)}
            >
              <ChevronLeft size={16} /> Previous Week
            </button>
            <button 
              className="week-nav-btn" 
              onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            >
              Next Week <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="graph-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f1117', 
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar 
                dataKey="count" 
                fill="url(#memberGradient)" 
                name="New Members" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ADMIN SETTINGS CARD */}
      <div className="chart-panel admin-settings-card">
        <div className="chart-header">
          <h4 className="chart-title d-flex align-items-center gap-2">
            <ShieldAlert size={20} className="text-warning" /> Admin Configuration
          </h4>
        </div>

        {loadingLimit ? (
          <p className="text-muted">Loading admin limit settings...</p>
        ) : (
          <div className="admin-settings-form">
            <label className="form-label fw-semibold" htmlFor="adminLimitInput">
              Maximum Admin Accounts Allowed
            </label>
            <div className="d-flex flex-wrap align-items-center gap-3 mt-1">
              <input
                id="adminLimitInput"
                type="number"
                className="form-control admin-limit-input"
                min="1"
                value={maxAdmins || 1}
                onChange={(e) => setMaxAdmins(parseInt(e.target.value) || 1)}
                style={{ maxWidth: '200px' }}
              />
              <button className="save-btn" onClick={handleSaveLimit}>
                <Save size={16} /> Save Limit
              </button>
            </div>

            {message && (
              <div className="alert alert-info mt-3 py-2 px-3 small" role="alert">
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberData;