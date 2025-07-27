import React from 'react';

const OverviewCard = ({ label, value, color }) => (
  <div className="col-md-4">
    <div className="card text-center" style={{ backgroundColor: color, color: '#fff' }}>
      <div className="card-body">
        <h5>{label}</h5>
        <h3>{value}</h3>
      </div>
    </div>
  </div>
);

export default OverviewCard;
