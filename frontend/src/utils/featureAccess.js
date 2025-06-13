import React, { useState, useEffect } from 'react';
import api from './api';

/**
 * Hook untuk memeriksa akses fitur
 * @param {string} featureName - Nama fitur yang ingin diperiksa
 * @returns {Promise<boolean>} - Promise yang selalu mengembalikan true karena semua fitur tersedia
 */
export const checkFeatureAccess = async (featureName) => {
  return true;
};

/**
 * Daftar semua fitur yang tersedia (semua fitur)
 */
export const AVAILABLE_FEATURES = [
  'basic-tasks', 'advanced-tasks', 'task-templates', 'unlimited-tasks',
  'basic-habits', 'advanced-habits', 'habit-analytics', 'unlimited-habits',
  'ai-suggestions', 'ai-task-planning', 'ai-assistant', 'unlimited-ai',
  'basic-analytics', 'advanced-analytics', 'data-export'
];

/**
 * Komponen HOC untuk membungkus fitur berbayar
 * @param {React.Component} Component - Komponen yang akan dibungkus
 * @param {string} featureName - Nama fitur yang diperlukan
 * @param {React.Component} FallbackComponent - Komponen yang ditampilkan jika pengguna tidak memiliki akses
 * @returns {React.Component} - Komponen HOC
 */
export const withFeatureAccess = (Component, featureName, FallbackComponent = null) => {
  return function FeatureProtectedComponent(props) {
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const checkAccess = async () => {
        try {
          const access = await checkFeatureAccess(featureName);
          setHasAccess(access);
        } catch (error) {
          console.error('Error checking feature access:', error);
          setHasAccess(false);
        } finally {
          setIsLoading(false);
        }
      };
      
      checkAccess();
    }, [featureName]);
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!hasAccess) {
      if (FallbackComponent) {
        return <FallbackComponent featureName={featureName} {...props} />;
      }
      return (
        <div className="feature-locked">
          <h3>Fitur Terkunci</h3>
          <p>Fitur ini hanya tersedia pada paket yang lebih tinggi.</p>
          <button onClick={() => window.location.href = '/subscription'}>
            Upgrade Paket
          </button>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

/**
 * Hook untuk mendapatkan informasi fitur dan paket
 */
export const useSubscription = () => {
  const [features, setFeatures] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await api.get('/subscription/features');
        setFeatures(response.data.data[0]);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    
    fetchFeatures();
  }, []);
  
  return { 
    subscription: { plan: 'free', status: 'active' },
    features, 
    isLoading, 
    error 
  };
};

/**
 * Memeriksa apakah fitur tersedia (selalu tersedia)
 * @returns {boolean} - Selalu true karena semua fitur tersedia
 */
export const hasFeature = (featureName) => {
  return true;
};

export default {
  checkFeatureAccess,
  AVAILABLE_FEATURES,
  withFeatureAccess,
  useSubscription,
  hasFeature
}; 