import React from 'react';
import {
  BsBellFill,
  BsPeopleFill,
  BsHeartPulseFill,
  BsCapsule,
  BsCoin
} from 'react-icons/bs';

const dashboardItems = [
  {
    title: 'Diets',
    sidebarLabel: 'Diet Details',
    icon: <BsHeartPulseFill size={22} />,
    bg: 'alert-success'
  },
  {
    title: 'Members',
    sidebarLabel: 'Members',
    icon: <BsPeopleFill size={22} />,
    bg: 'alert-primary'
  },
  {
    title: 'Notifications',
    sidebarLabel: 'Notification',
    icon: <BsBellFill size={22} />,
    bg: 'alert-warning'
  },
  {
    title: 'Supplements',
    sidebarLabel: 'Supplement',
    icon: <BsCapsule size={22} />,
    bg: 'alert-info'
  },
  {
    title: 'Fee Packages',
    sidebarLabel: 'Fee Package',
    icon: <BsCoin size={22} />,
    bg: 'alert-danger'
  }
];

const Dashboard = ({ onSectionChange }) => {
  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">📊 Admin Dashboard</h2>
      <div className="row g-4">
        {dashboardItems.map((item, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className={`alert ${item.bg} shadow-sm rounded-3`}>
              <h5 className="alert-heading d-flex align-items-center gap-2 mb-3">
                {item.icon} {item.title}
              </h5>
              <p className="mb-3">
                Manage and view {item.title.toLowerCase()} details.
              </p>
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
