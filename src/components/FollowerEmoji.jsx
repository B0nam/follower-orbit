import { useState, useRef } from 'react';
import NameTag from './NameTag';
import CommentBalloon from './CommentBalloon';
import './FollowerEmoji.css';

export default function FollowerEmoji({ follower, position, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentComment, setCurrentComment] = useState(follower.comments[0]);
  const dragTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (follower.comments.length > 1) {
      const randomIndex = Math.floor(Math.random() * follower.comments.length);
      setCurrentComment(follower.comments[randomIndex]);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentComment(follower.comments[0]);
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    
    dragTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = true;
    }, 250);
  };

  const handleMouseUp = (e) => {
    e.stopPropagation();
    
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
    
    if (!isDraggingRef.current) {
      onSelect(follower);
    }
    
    isDraggingRef.current = false;
  };

  return (
    <div
      className="follower-emoji-container"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {isHovered && <CommentBalloon comment={currentComment} />}
      <NameTag name={follower.username} />
      <div className="emoji-wrapper">
        <span className="emoji">{follower.avatar}</span>
      </div>
    </div>
  );
}