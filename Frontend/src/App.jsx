import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import './App.css';

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <AuthProvider>
      <div className="app">
        {currentForm === 'login' ? (
          <Login onSwitchToSignUp={() => toggleForm('signup')} />
        ) : (
          <SignUp onSwitchToLogin={() => toggleForm('login')} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
