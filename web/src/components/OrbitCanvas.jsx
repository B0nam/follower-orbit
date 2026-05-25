import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Matter from 'matter-js';
import FollowerEmoji from './FollowerEmoji';
import './OrbitCanvas.css';

function generatePositions(count) {
  const positions = [];
  const padding = 15;

  for (let i = 0; i < count; i++) {
    positions.push({
      x: padding + Math.random() * (100 - padding * 2),
      y: padding + Math.random() * (100 - padding * 2)
    });
  }

  return positions;
}

const OrbitCanvas = forwardRef(function OrbitCanvas({ followers, onSelectFollower, onDragStart, onDragEnd }, ref) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const wallsRef = useRef([]);
  const followerBodiesRef = useRef([]);
  const mouseConstraintRef = useRef(null);
  const animationRef = useRef(null);
  const isDraggingRef = useRef(false);

  const [positions, setPositions] = useState(() => {
    const pos = generatePositions(followers.length);
    return followers.map((f, i) => ({ id: f.id, x: pos[i].x, y: pos[i].y }));
  });

  const spreadAll = () => {
    followerBodiesRef.current.forEach(body => {
      const angle = Math.random() * Math.PI * 2;
      const force = 0.5 + Math.random() * 0.5;
      Matter.Body.applyForce(body, body.position, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force
      });
      
      const velX = (Math.random() - 0.5) * 30;
      const velY = (Math.random() - 0.5) * 30;
      Matter.Body.setVelocity(body, Matter.Vector.create(velX, velY));
    });
  };

  useImperativeHandle(ref, () => ({
    spread: spreadAll
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engineRef.current = engine;

    const wallThickness = 100;
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { 
        isStatic: true, 
        restitution: 0.9,
        label: 'wall-top'
      }),
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { 
        isStatic: true, 
        restitution: 0.9,
        label: 'wall-bottom'
      }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { 
        isStatic: true, 
        restitution: 0.9,
        label: 'wall-right'
      }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { 
        isStatic: true, 
        restitution: 0.9,
        label: 'wall-left'
      })
    ];
    Matter.World.add(engine.world, walls);
    wallsRef.current = walls;

    const initialPositions = generatePositions(followers.length);
    const bodyPositions = initialPositions.map(pos => ({
      x: (pos.x / 100) * width,
      y: (pos.y / 100) * height
    }));

    const followerBodies = followers.map((follower, index) => {
      const body = Matter.Bodies.circle(bodyPositions[index].x, bodyPositions[index].y, 35, {
        restitution: 0.85,
        friction: 0,
        frictionAir: 0.015,
        density: 0.001,
        label: follower.id
      });
      body.followerId = follower.id;
      return body;
    });
    Matter.World.add(engine.world, followerBodies);
    followerBodiesRef.current = followerBodies;

    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.1,
        render: { visible: false }
      }
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.World.add(engine.world, mouseConstraint);

    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

    Matter.Events.on(mouseConstraint, 'startdrag', (e) => {
      if (e.body && e.body.followerId) {
        isDraggingRef.current = true;
        onDragStart?.();
      }
    });
    
    Matter.Events.on(mouseConstraint, 'enddrag', () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        onDragEnd?.();
      }
    });

    let lastTime = performance.now();
    
    const updatePositions = () => {
      const currentTime = performance.now();
      const delta = Math.min(currentTime - lastTime, 20);
      lastTime = currentTime;

      Matter.Engine.update(engine, delta);

      followerBodies.forEach(body => {
        const radius = 35;
        
        if (body.position.x - radius < 0) {
          Matter.Body.setPosition(body, Matter.Vector.create(radius + 1, body.position.y));
          Matter.Body.setVelocity(body, Matter.Vector.create(Math.abs(body.velocity.x) * 0.5, body.velocity.y));
        }
        if (body.position.x + radius > width) {
          Matter.Body.setPosition(body, Matter.Vector.create(width - radius - 1, body.position.y));
          Matter.Body.setVelocity(body, Matter.Vector.create(-Math.abs(body.velocity.x) * 0.5, body.velocity.y));
        }
        if (body.position.y - radius < 0) {
          Matter.Body.setPosition(body, Matter.Vector.create(body.position.x, radius + 1));
          Matter.Body.setVelocity(body, Matter.Vector.create(body.velocity.x, Math.abs(body.velocity.y) * 0.5));
        }
        if (body.position.y + radius > height) {
          Matter.Body.setPosition(body, Matter.Vector.create(body.position.x, height - radius - 1));
          Matter.Body.setVelocity(body, Matter.Vector.create(body.velocity.x, -Math.abs(body.velocity.y) * 0.5));
        }
      });

      const newPositions = followerBodies.map(body => ({
        id: body.followerId,
        x: (body.position.x / width) * 100,
        y: (body.position.y / height) * 100
      }));

      setPositions(newPositions);
      animationRef.current = requestAnimationFrame(updatePositions);
    };

    animationRef.current = requestAnimationFrame(updatePositions);

    const handleResize = () => {
      const newWidth = canvas.getBoundingClientRect().width;
      const newHeight = canvas.getBoundingClientRect().height;
      
      const walls = wallsRef.current;
      if (walls && walls.length === 4) {
        Matter.Body.setPosition(walls[0], Matter.Vector.create(newWidth / 2, -50));
        Matter.Body.setPosition(walls[1], Matter.Vector.create(newWidth / 2, newHeight + 50));
        Matter.Body.setPosition(walls[2], Matter.Vector.create(newWidth + 50, newHeight / 2));
        Matter.Body.setPosition(walls[3], Matter.Vector.create(-50, newHeight / 2));
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      Matter.Events.off(mouseConstraint);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, [followers, onDragStart, onDragEnd]);

  return (
    <div className="orbit-canvas" ref={canvasRef}>
      <div className="orbit-grid">
        {followers.map((follower) => {
          const pos = positions.find(p => p.id === follower.id) || { x: 50, y: 50 };
          return (
            <FollowerEmoji
              key={follower.id}
              follower={follower}
              position={pos}
              onSelect={onSelectFollower}
            />
          );
        })}
      </div>
      <div className="orbit-particles"></div>
    </div>
  );
});

export default OrbitCanvas;