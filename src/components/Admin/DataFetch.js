import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { 
  Utensils, 
  Dumbbell, 
  Trophy, 
  Bell, 
  Pill, 
  Package 
} from 'lucide-react';
import './DataFetch.css';

const DataFetch = () => {
  const [dietCounts, setDietCounts] = useState({
    beginner: 0,
    regular: 0,
    professional: 0,
  });

  const [notificationCount, setNotificationCount] = useState(0);
  const [supplementCount, setSupplementCount] = useState(0);
  const [packCount, setPackCount] = useState(0);

  // Fetch Diet Counts
  useEffect(() => {
    const dietPlansRef = collection(db, 'Details', 'Diets', 'plans');
    const unsubscribe = onSnapshot(dietPlansRef, (snapshot) => {
      const counts = { beginner: 0, regular: 0, professional: 0 };
      snapshot.forEach((doc) => {
        const level = doc.data().level?.toLowerCase();
        if (level === 'beginner') counts.beginner += 1;
        else if (level === 'regular') counts.regular += 1;
        else if (level === 'professional') counts.professional += 1;
      });
      setDietCounts(counts);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Notification Count
  useEffect(() => {
    const notificationsRef = collection(db, 'Details', 'Notifications', 'details');
    const unsubscribe = onSnapshot(
      notificationsRef,
      (snapshot) => setNotificationCount(snapshot.size),
      (error) => console.error('Error fetching notifications:', error)
    );
    return () => unsubscribe();
  }, []);

  // Fetch Supplement Count
  useEffect(() => {
    const supplementsRef = collection(db, 'Details', 'Supplements', 'details');
    const unsubscribe = onSnapshot(
      supplementsRef,
      (snapshot) => setSupplementCount(snapshot.size),
      (error) => console.error('Error fetching supplements:', error)
    );
    return () => unsubscribe();
  }, []);

  // Fetch Pack Count
  useEffect(() => {
    const packRef = collection(db, 'Details', 'pack', 'details');
    const unsubscribe = onSnapshot(
      packRef,
      (snapshot) => setPackCount(snapshot.size),
      (error) => console.error('Error fetching packs:', error)
    );
    return () => unsubscribe();
  }, []);

  const cardsData = [
    { title: 'Beginner Plans', count: dietCounts.beginner, icon: Utensils, badgeColor: 'emerald' },
    { title: 'Regular Plans', count: dietCounts.regular, icon: Dumbbell, badgeColor: 'blue' },
    { title: 'Professional Plans', count: dietCounts.professional, icon: Trophy, badgeColor: 'purple' },
    { title: 'Notifications Sent', count: notificationCount, icon: Bell, badgeColor: 'amber' },
    { title: 'Supplements Available', count: supplementCount, icon: Pill, badgeColor: 'rose' },
    { title: 'Available Packs', count: packCount, icon: Package, badgeColor: 'cyan' },
  ];

  return (
    <div className="data-fetch-wrapper">
      {/* HEADER SECTION */}
      <div className="data-fetch-header">
        <h2 className="dashboard-title">System Overview</h2>
        <p className="dashboard-subtitle">
          Real-time telemetry and management statistics across active diet plans, notifications, and store inventories.
        </p>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="data-fetch-grid">
        {cardsData.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="data-card">
              <div className="card-header-flex">
                <span className="card-title">{card.title}</span>
                <div className={`card-icon-wrapper ${card.badgeColor}`}>
                  <IconComponent size={20} />
                </div>
              </div>
              <div className="card-body-flex">
                <h2 className="card-metric-value">{card.count}</h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataFetch;