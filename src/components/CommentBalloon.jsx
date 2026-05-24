import './CommentBalloon.css';

export default function CommentBalloon({ comment }) {
  if (!comment) return null;

  return (
    <div className="comment-balloon">
      <div className="comment-content">
        {comment.content}
      </div>
    </div>
  );
}