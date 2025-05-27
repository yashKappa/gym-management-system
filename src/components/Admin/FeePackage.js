import React from 'react';
import { BsBellFill } from 'react-icons/bs'; // Notification icon (optional)

const FeePackage = () => {
  const packages = [
    {
      name: 'Basic Plan',
      price: '₹999/month',
      duration: '1 Month',
      features: ['Gym Access', 'Locker'],
      alertClass: 'alert-secondary',
    },
    {
      name: 'Standard Plan',
      price: '₹2499',
      duration: '3 Months',
      features: ['Gym Access', 'Locker', 'Diet Plan', 'Free T-Shirt'],
      alertClass: 'alert-primary',
    },
    {
      name: 'Premium Plan',
      price: '₹4499',
      duration: '6 Months',
      features: ['All Standard Features', 'Personal Trainer', 'Supplement Advice'],
      alertClass: 'alert-success',
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">📢 Gym Fee Packages</h2>
      <div className="row g-4">
        {packages.map((pkg, idx) => (
          <div className="col-12 col-md-4" key={idx}>
            <div className={`alert ${pkg.alertClass} shadow-sm`}>
              <h5 className="alert-heading d-flex align-items-center gap-2">
                <BsBellFill /> {pkg.name}
              </h5>
              <hr />
              <p><strong>Price:</strong> {pkg.price}</p>
              <p><strong>Duration:</strong> {pkg.duration}</p>
              <ul className="mb-2">
                {pkg.features.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>
              <div className="text-end">
                <button className="btn btn-sm btn-outline-dark">Choose Plan</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeePackage;
