import React from 'react';

const Notification = () => {
  const notifications = [
    { id: 1, title: 'New Member Joined', body: 'John Doe has joined the gym today.' },
    { id: 2, title: 'Fee Payment', body: 'Jane Smith has paid her membership fee.' },
    { id: 3, title: 'Trainer Assigned', body: 'Mike Ross has been assigned to a new client.' },
    { id: 4, title: 'Expire Package', body: 'Mike Ross has been assigned to a new client.' },
    { id: 5, title: 'Equipments', body: 'Mike Ross has been assigned to a new client.' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 15px' }}>
      <h3 style={{ marginBottom: 24, fontWeight: '600', fontSize: '1.8rem', color: '#222' }}>
        Notifications
      </h3>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {notifications.map(note => (
          <div
            key={note.id}
            style={{
              flex: '1 1 280px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 140,
              cursor: 'default',
              transition: 'box-shadow 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
          >
            <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.2rem', color: '#333' }}>
              {note.title}
            </h4>
            <p style={{ marginTop: 10, color: '#555', fontSize: '1rem', lineHeight: '1.4' }}>
              {note.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
