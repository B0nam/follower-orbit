import { useState, useMemo } from 'react';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, selectedFollower, onSelectFollower, followers }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFollowers = useMemo(() => {
    if (!searchQuery.trim()) return followers;
    const query = searchQuery.toLowerCase();
    return followers.filter(f => 
      f.username.toLowerCase().includes(query) ||
      f.comments.some(c => c.content.toLowerCase().includes(query))
    );
  }, [followers, searchQuery]);

  return (
    <>
      <div 
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={onClose}>
          ✕
        </button>
        
        {selectedFollower ? (
          <div className="sidebar-detail">
            <button 
              className="back-to-list"
              onClick={() => onSelectFollower(null)}
            >
              ← Voltar à lista
            </button>
            <div className="detail-header">
              <span className="detail-avatar">{selectedFollower.avatar}</span>
              <div className="detail-name-row">
                <h2 className="detail-username">{selectedFollower.username}</h2>
                <a
                  href={`https://www.tiktok.com/@${selectedFollower.username.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tiktok-link-btn"
                >
                  <svg className="tiktok-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  Ver no TikTok
                </a>
              </div>
            </div>
            <div className="detail-info">
              <div className="detail-row">
                <span className="detail-label">Desde</span>
                <span className="detail-value">
                  {new Date(selectedFollower.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Origem</span>
                <span className="detail-value">{selectedFollower.origin}</span>
              </div>
            </div>
            <div className="detail-comments">
              <h3>Comentários ({selectedFollower.comments.length})</h3>
              <div className="comments-list">
                {selectedFollower.comments.map((comment, idx) => (
                  <div key={idx} className="comment-item">
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-meta">
                      <span className="comment-date">
                        {new Date(comment.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="comment-likes">❤ {comment.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="sidebar-list">
            <h2 className="sidebar-title">Seguidores</h2>
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search followers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {filteredFollowers.length === 0 ? (
              <div className="no-results">No followers found</div>
            ) : (
              <div className="followers-grid">
                {filteredFollowers.map((follower) => (
                  <button
                    key={follower.id}
                    className="follower-card"
                    onClick={() => onSelectFollower(follower)}
                  >
                    <span className="card-avatar">{follower.avatar}</span>
                    <span className="card-name">{follower.username}</span>
                    <span className="card-comments">{follower.comments.length} comentários</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}