
import './App.css';
import AuthProvider from './Auth/AuthProvider';
import AppRouter from './Routers/AppRouter';

function App() {
  return (
    <div>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </div>
  );
}

export default App;
