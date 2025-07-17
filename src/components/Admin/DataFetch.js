import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import './DataFetch.css';

const DataFetch = () => {
  const [dietCounts, setDietCounts] = useState({
    beginner: 0,
    regular: 0,
    professional: 0,
  });

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

    return () => unsubscribe(); // Clean up listener
  }, []);

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const notificationsRef = collection(db, 'Details', 'Notifications', 'details');

    const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
      setNotificationCount(snapshot.size); // updates in real time
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

 const [supplementCount, setSupplementCount] = useState(0);

  useEffect(() => {
    const supplementsRef = collection(db, 'Details', 'Supplements', 'details');

    const unsubscribe = onSnapshot(supplementsRef, (snapshot) => {
      setSupplementCount(snapshot.size);
    }, (error) => {
      console.error('Error fetching supplements:', error);
    });

    return () => unsubscribe(); // Detach listener on unmount
  }, []);

   const [packCount, setPackCount] = useState(0);

  useEffect(() => {
    const packRef = collection(db, 'Details', 'pack', 'details');

    const unsubscribe = onSnapshot(packRef, (snapshot) => {
      setPackCount(snapshot.size);
    }, (error) => {
      console.error('Error fetching packs:', error);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  

  return (
  <div className="diet-card-container">
    <div className="card-box">
      <h3>Beginner Plans</h3>
      <p>{dietCounts.beginner}</p>
    </div>
    <div className="card-box">
      <h3>Regular Plans</h3>
      <p>{dietCounts.regular}</p>
    </div>
    <div className="card-box">
      <h3>Professional Plans</h3>
      <p>{dietCounts.professional}</p>
    </div>
    <div className="card-box">
      <h3>Notifications Sent</h3>
      <p>{notificationCount}</p>
    </div>
    <div className="card-box">
      <h3>Supplements Available</h3>
      <p>{supplementCount}</p>
    </div>
    <div className="card-box">
      <h3>Available Packs</h3>
      <p>{packCount}</p>
    </div>
  </div>
);
};

export default DataFetch;
