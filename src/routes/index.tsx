import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { View, ActivityIndicator } from 'react-native';

function Routes() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EAF8FE',
        }}
      >
        <ActivityIndicator size={52} color='#041318' />
      </View>
    );
  }

  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;
