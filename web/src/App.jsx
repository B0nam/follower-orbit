import { useState, useRef, useCallback } from 'react';
import OrbitCanvas from './components/OrbitCanvas';
import Sidebar from './components/Sidebar';
import { mockFollowers } from './data/mockFollowers';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  const dragTimeoutRef = useRef(null);

  const handleOpenSidebar = () => {
    if (!isDragging) {
      setSidebarOpen(true);
    }
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedFollower(null);
  };

  const handleSelectFollower = (follower) => {
    setSelectedFollower(follower);
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  const handleSpread = () => {
    canvasRef.current?.spread();
  };

  const handleDragStart = useCallback(() => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 100);
  }, []);

  return (
    <div className="app">
      <div className="button-group">
        <button 
          className="spread-btn" 
          onClick={handleSpread} 
          title="Espalhar todos"
          disabled={isDragging}
        >
          <svg className="spread-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
        </button>
        <button 
          className="hamburger-btn" 
          onClick={handleOpenSidebar}
          disabled={isDragging}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <OrbitCanvas 
        ref={canvasRef}
        followers={mockFollowers} 
        onSelectFollower={handleSelectFollower}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        selectedFollower={selectedFollower}
        onSelectFollower={handleSelectFollower}
        followers={mockFollowers}
      />
      <div className="watermark">
        Made by <a href="https://www.tiktok.com/@b0nam" target="_blank" rel="noopener noreferrer">@b0nam</a>
      </div>
    </div>
  );
}

export default App;