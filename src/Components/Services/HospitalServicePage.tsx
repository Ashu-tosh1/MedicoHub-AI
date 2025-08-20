import React from 'react';

const HospitalServicePage = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Hospital Services</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Welcome to our hospital! We offer a range of medical services to ensure your health and well-being.
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <strong>Emergency Care:</strong> 24/7 emergency services for urgent medical needs.
        </li>
        <li style={{ marginBottom: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <strong>Outpatient Services:</strong> Consultations, diagnostics, and minor procedures.
        </li>
        <li style={{ marginBottom: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <strong>Inpatient Care:</strong> Comfortable rooms and attentive care for admitted patients.
        </li>
        <li style={{ marginBottom: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <strong>Pharmacy:</strong> On-site pharmacy for all your medication needs.
        </li>
        <li style={{ marginBottom: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <strong>Laboratory & Diagnostics:</strong> Advanced lab tests and imaging services.
        </li>
      </ul>
    </div>
  );
};

export default HospitalServicePage;
