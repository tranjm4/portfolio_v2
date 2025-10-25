import React, { useRef, useEffect, useCallback, useState } from 'react';
import './InteractiveGrid.css';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  intensity: number;
}

interface Coordinate {
  x: number;
  y: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

interface GridBounds {
  horizontalRows: number;
  verticalCols: number;
  horizontalCols: number;
  verticalRows: number;
  intersectionRows: number;
  intersectionCols: number;
}

const InteractiveGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<Coordinate>({ x: 0, y: 0 });
  const delayedMousePos = useRef<Coordinate>({ x: 0, y: 0 });
  const mouseTrail = useRef<TrailPoint[]>([]);
  const animationFrame = useRef<number>(0);
  const lastMouseMoveTime = useRef<number>(0);
  const trailPointPool = useRef<TrailPoint[]>([]);
  const gridBounds = useRef<GridBounds>({ horizontalRows: 0, verticalCols: 0, horizontalCols: 0, verticalRows: 0, intersectionRows: 0, intersectionCols: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => !window.matchMedia('(prefers-color-scheme: light)').matches
  );

  const gridSize = 75;      // visual grid size (in px)
  const segmentSize = 75;   // interactive segment lengths (smaller -> more computation-heavy)

  // Optimized distance calculation with memoization
  const getDistanceSquared = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
  }, []);

  const getDistance = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(getDistanceSquared(x1, y1, x2, y2));
  }, [getDistanceSquared]);

  // Object pooling for trail points
  const getTrailPoint = useCallback((x: number, y: number, age: number): TrailPoint => {
    const pooled = trailPointPool.current.pop();
    if (pooled) {
      pooled.x = x;
      pooled.y = y;
      pooled.age = age;
      return pooled;
    }
    return { x, y, age };
  }, []);

  const returnTrailPoint = useCallback((point: TrailPoint) => {
    trailPointPool.current.push(point);
  }, []);

  // Pre-calculate grid boundaries
  const updateGridBounds = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    gridBounds.current = {
      horizontalRows: Math.ceil(height / gridSize),
      verticalCols: Math.ceil(width / gridSize),
      horizontalCols: Math.ceil(width / segmentSize),
      verticalRows: Math.ceil(height / segmentSize),
      intersectionRows: Math.ceil(height / gridSize) + 1,
      intersectionCols: Math.ceil(width / gridSize) + 1
    };
  }, [gridSize, segmentSize]);

  // Mount/unmount light/dark mode listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(!e.matches);
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  const getSegmentIntensity = useCallback((segmentX: number, segmentY: number) => {
    let maxIntensity = 0.2;

    // Add trail effects - use optimized distance calculation
    mouseTrail.current.forEach(trailPoint => {
      const trailDistance = getDistance(segmentX, segmentY, trailPoint.x, trailPoint.y);

      // Smaller trail effect
      const trailRadius = 80;
      if (trailDistance <= trailRadius) {
        const ageIntensity = (100 - trailPoint.age) / 100; // fade over 100 frames
        const distanceIntensity = (trailRadius - trailDistance) / trailRadius;
        const trailIntensity = ageIntensity * distanceIntensity * 1; // reduced intensity
        maxIntensity = Math.max(maxIntensity, trailIntensity);
      }
    });

    // Add ripple effects (only check if we have active ripples)
    let rippleIntensity = 0;
    if (ripples.length > 0) {
      ripples.forEach(ripple => {
        const rippleDistance = getDistance(segmentX, segmentY, ripple.x, ripple.y);

        // Create a wave effect - intensity peaks at the ripple radius
        const distanceFromWave = Math.abs(rippleDistance - ripple.radius);
        const waveWidth = 30;

        if (distanceFromWave < waveWidth) {
          const waveIntensity = (waveWidth - distanceFromWave) / waveWidth * 1.5;
          rippleIntensity = Math.max(rippleIntensity, waveIntensity * ripple.intensity);
        }
      });
    }

    return Math.max(maxIntensity, rippleIntensity);
  }, [getDistance, ripples]);

  const getSegmentAngle = (segmentX: number, segmentY: number, isVertical: boolean) => {
    const maxDistance = 300;

    let defaultAngle: number;
    if (isVertical) {
      defaultAngle = Math.PI / 2;
    }
    else {
      defaultAngle = 0;
    }

    const cursorDx = segmentX - delayedMousePos.current.x;
    const cursorDy = segmentY - delayedMousePos.current.y;
    const cursorDistance = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy);

    const intensity = Math.min(Math.max((maxDistance - cursorDistance) / maxDistance, 0), 0.6);

    // Set base angle to 0 for horizontal segments
    // Set base angle to pi/2 for vertical segments

    const cursorAngle = Math.atan2(-cursorDy, -cursorDx);

    let angleDiff = ((cursorAngle - defaultAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
    const smoothIntensity = Math.pow(intensity, 1.5);
    const finalAngle = defaultAngle + angleDiff * smoothIntensity;

    return finalAngle;

    // mouseTrail.current.forEach(trailPoint => {
    //   // Get distances to each trail point
    //   const trailDx = segmentX - trailPoint.x;
    //   const trailDy = segmentY - trailPoint.y;
    //   const trailDistance = Math.sqrt(trailDx * trailDx + trailDy * trailDy);
    //   const trailAngle = Math.atan2(trailDy, trailDx);


    // })
  }

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lineColor = isDarkMode ? 'white' : 'black';
    const bounds = gridBounds.current;

    // Draw horizontal line segments - use pre-calculated bounds
    for (let row = 0; row < bounds.horizontalRows; row++) {
      const y = row * gridSize;

      for (let col = 0; col < bounds.horizontalCols; col++) {
        const x = col * segmentSize;
        const intensity = getSegmentIntensity(x + segmentSize / 2, y);

        const thickness = Math.max(1, 1 + intensity * 2); // 1px to 3px (reduced)
        const opacity = Math.max(0.05, 0.05 + intensity * 0.2); // 0.05 to 0.25 (reduced)

        const angle = getSegmentAngle(x + segmentSize / 2, y, false);

        ctx.globalAlpha = opacity;
        ctx.fillStyle = lineColor;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillRect(-segmentSize / 2, -thickness / 2, segmentSize, thickness);
        ctx.restore()
      }
    }

    // Draw vertical line segments - use pre-calculated bounds
    for (let col = 0; col < bounds.verticalCols; col++) {
      const x = col * gridSize;
      for (let row = 0; row < bounds.verticalRows; row++) {
        const y = row * segmentSize;
        const intensity = getSegmentIntensity(x, y + segmentSize / 2);

        const thickness = Math.max(1, 1 + intensity * 2); // 1px to 3px (reduced)
        const opacity = Math.max(0.05, 0.05 + intensity * 0.25); // 0.05 to 0.25 (reduced)

        const angle = getSegmentAngle(x, y + segmentSize / 2, true);

        ctx.globalAlpha = opacity;
        ctx.fillStyle = lineColor;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillRect(-segmentSize / 2, -thickness / 2, segmentSize, thickness)
        ctx.restore();
      }
    }

    // Draw intersection dots - use pre-calculated bounds
    for (let row = 0; row < bounds.intersectionRows; row++) {
      for (let col = 0; col < bounds.intersectionCols; col++) {
        const x = col * gridSize;
        const y = row * gridSize;
        const intensity = getSegmentIntensity(x, y);

        const dotSize = 3 + intensity * 3; // 1.5px to 3px
        const opacity = 0.1 + intensity * 0.2; // 0.1 to 0.3

        ctx.globalAlpha = opacity;
        ctx.fillStyle = lineColor;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [getSegmentIntensity, getSegmentAngle, isDarkMode]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = performance.now();
    const throttleDelay = 16; // ~60fps throttling

    if (now - lastMouseMoveTime.current < throttleDelay) {
      return;
    }

    lastMouseMoveTime.current = now;
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Consolidated animation loop
  const animate = useCallback(() => {
    const lerpFactor = 0.05; // Lower = more delay, Higher = more responsive

    // Add current delayed position to trail before updating - use object pooling
    if (mouseTrail.current.length === 0 ||
      Math.abs(delayedMousePos.current.x - mouseTrail.current[mouseTrail.current.length - 1]?.x) > 5 ||
      Math.abs(delayedMousePos.current.y - mouseTrail.current[mouseTrail.current.length - 1]?.y) > 5) {

      const newTrailPoint = getTrailPoint(delayedMousePos.current.x, delayedMousePos.current.y, 0);
      mouseTrail.current.push(newTrailPoint);
    }

    // Update ages and remove old trail points with object pooling
    const activeTrail: TrailPoint[] = [];
    mouseTrail.current.forEach(point => {
      point.age += 1;
      if (point.age < 30) { // keep for 30 frames
        activeTrail.push(point);
      } else {
        returnTrailPoint(point); // return to pool
      }
    });
    mouseTrail.current = activeTrail;

    // Update delayed position
    delayedMousePos.current.x += (mousePos.current.x - delayedMousePos.current.x) * lerpFactor;
    delayedMousePos.current.y += (mousePos.current.y - delayedMousePos.current.y) * lerpFactor;

    // Update ripples
    setRipples(prev => {
      const updated = prev
        .map(ripple => ({
          ...ripple,
          radius: ripple.radius + 2.5, // slower expansion
          intensity: ripple.intensity * 0.98 // slower fade
        }))
        .filter(ripple => ripple.intensity > 0.1 && ripple.radius < ripple.maxRadius);

      return updated;
    });

    // Draw everything
    drawGrid();

    // Continue animation
    animationFrame.current = requestAnimationFrame(animate);
  }, [drawGrid, getTrailPoint, returnTrailPoint]);

  // Start consolidated animation loop
  useEffect(() => {
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [animate]);

  const handleClick = useCallback((e: MouseEvent) => {
    const newRipple: Ripple = {
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 500,
      intensity: 1.2
    };

    setRipples(prev => [...prev, newRipple]);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateGridBounds();
  }, [updateGridBounds]);

  useEffect(() => {
    handleResize();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleMouseMove, handleClick, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-grid-canvas"
    />
  );
};

export default InteractiveGrid;