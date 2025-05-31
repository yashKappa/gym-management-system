import React from 'react';

const dashboardItems = [
  {
    title: 'Members',
    sidebarLabel: 'Members',
    icon: '👥',
    bg: 'alert-primary'
  },
  {
    title: 'Fee Packages',
    sidebarLabel: 'Fee Package',
    icon: '💰',
    bg: 'alert-danger'
  },
  {
    title: 'Notifications',
    sidebarLabel: 'Notification',
    icon: '🔔',
    bg: 'alert-warning'
  },
  {
    title: 'Supplements',
    sidebarLabel: 'Supplement',
    icon: '💊',
    bg: 'alert-info'
  },
  {
    title: 'Diets',
    sidebarLabel: 'Diet Details',
    icon: '🥗',
    bg: 'alert-success'
  }
];

const Dashboard = ({ onSectionChange }) => {

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">📊 Akatsuki-Gym Dashboard</h2>

      {/* Other Dashboard Items */}
      <div className="row g-4">
        {dashboardItems.map((item, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className={`alert ${item.bg} shadow-sm rounded-3`}>
              <h5 className="alert-heading d-flex align-items-center gap-2 mb-3">
                {item.icon} {item.title}
              </h5>
              <p className="mb-3">Manage and view {item.title.toLowerCase()} details.</p>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => onSectionChange(item.sidebarLabel)}
                >
                  Go to {item.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
