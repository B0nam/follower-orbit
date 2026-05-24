import './Tooltip.css';

export default function Tooltip({ follower }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="tooltip">
      <div className="tooltip-header">
        <span className="tooltip-avatar">{follower.avatar}</span>
        <span className="tooltip-username">{follower.username}</span>
      </div>
      <div className="tooltip-info">
        <div className="tooltip-row">
          <span className="tooltip-label">Desde:</span>
          <span className="tooltip-value">{formatDate(follower.createdAt)}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-label">Origem:</span>
          <span className="tooltip-value">{follower.origin}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-label">Comentários:</span>
          <span className="tooltip-value">{follower.comments.length}</span>
        </div>
      </div>
    </div>
  );
}