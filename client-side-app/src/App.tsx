import WeatherCharts from './components/WeatherCharts/WeatherCharts';
import './App.css';
import ShortListCharts from './components/WeatherCharts/ShortListCharts';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Live Weather Data Dashboard</h1>
      </header>
      <div className="content">
        <WeatherCharts />
        <ShortListCharts />
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Weather Data Dashboard
      </footer>
    </div>
  );
}

export default App;
