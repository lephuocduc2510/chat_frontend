import React from "react";
import './style.css'; // Để áp dụng CSS nếu cần



const AdminHome: React.FC = () => {
  return (
    <div className="admin-dashboard">
     
     <div className="admin-container" style={{ display: 'flex', minHeight: '100vh' }}>
    
     

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <header style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderBottom: '1px solid #ddd' }}>
          <h1>Admin Dashboard</h1>
        </header>
        
        <main style={{ padding: '1rem' }}>
          <h2>Welcome to the Admin Dashboard</h2>
          <p>This is the homepage for managing all the administrative functions.</p>
        </main>
      </div>
    </div>

      </div>
  );
};

export default AdminHome;
