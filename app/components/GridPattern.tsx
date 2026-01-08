"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import gsap from "gsap";

const CELL_SIZE = 24;
const GRID_SIZE = 26; // Standardize grid chunk size

// Helper to create a blank grid
const createGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));

// Pattern 1: The "L" Corner (Dynamic orientation)
const createCornerPattern = (alignX: "left" | "right", alignY: "top" | "bottom") => {
  const grid = createGrid();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      // Calculate distance from the aligned edges
      const distX = alignX === "left" ? x : GRID_SIZE - 1 - x;
      const distY = alignY === "top" ? y : GRID_SIZE - 1 - y;

      // Vertical bar along aligned X edge (fades out as moving away from edge)
      const vBar = distX < 6 && Math.random() > (distX / 6) * 0.8;
      
      // Horizontal bar along aligned Y edge (fades out as moving away from edge)
      const hBar = distY < 6 && Math.random() > (distY / 6) * 0.8;
      
      // Extra chunk near the corner (intersection)
      const cornerChunk = distX < 8 && distY < 8 && Math.random() > 0.3;

      // Noise around the intersection
      const noise = distX < 10 && distY < 10 && Math.random() > 0.7;

      if (vBar || hBar || cornerChunk || noise) {
        grid[y][x] = true;
      }
      
      // Punch some random holes
      if (grid[y][x] && Math.random() > 0.9) {
        grid[y][x] = false;
      }
    }
  }
  return grid;
};

// Pattern 2: Heavy Foundation (Dynamic orientation)
const createFoundationPattern = (alignY: "top" | "bottom") => {
  const grid = createGrid();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const distY = alignY === "top" ? y : GRID_SIZE - 1 - y;
      
      // Stronger gravity towards the aligned Y edge
      // (1 - (distY / GRID_SIZE)) goes from 1 (at edge) to 0 (far side)
      const probability = Math.pow(1 - (distY / GRID_SIZE), 4); 
      if (Math.random() < probability) {
        grid[y][x] = true;
      }
    }
  }
  return grid;
};

// Pattern 3: Scattered Digital Noise (Orientation agnostic)
const createNoisePattern = () => {
  const grid = createGrid();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      // Perlin-ish noise simulation
      const noise = Math.sin(x * 0.5) * Math.cos(y * 0.5) + Math.random();
      if (noise > 1.2) {
        grid[y][x] = true;
      }
    }
  }
  return grid;
};

interface GridPatternProps {
  className?: string;
  opacity?: number;
  alignX?: "left" | "right";
  alignY?: "top" | "bottom";
}

export default function GridPattern({ 
  className = "", 
  opacity = 1,
  alignX = "left",
  alignY = "top"
}: GridPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0, width: 0, height: 0 });
  const [patternIndex, setPatternIndex] = useState(0);

  // Generate patterns based on current alignment props
  // We use useMemo so we don't regenerate the random patterns on every render, 
  // only when alignment changes (or on mount).
  const patterns = useMemo(() => [
    createCornerPattern(alignX, alignY),
    createCornerPattern(alignX, alignY), // Bias towards corner
    createFoundationPattern(alignY),
    createNoisePattern(),
  ], [alignX, alignY]);

  // Randomly pick a pattern on mount or when patterns regenerate
  useEffect(() => {
    setPatternIndex(Math.floor(Math.random() * patterns.length));
  }, [patterns]); // Re-roll if alignment changes

  // Measure container to calculate columns and rows
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          cols: Math.floor(width / CELL_SIZE),
          rows: Math.floor(height / CELL_SIZE),
          width,
          height,
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const activePattern = patterns[patternIndex];

  // Animate cells when they appear in view
  useEffect(() => {
    if (!containerRef.current || dimensions.cols === 0) return;

    const element = containerRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animation
            const ctx = gsap.context(() => {
              gsap.fromTo(
                ".grid-cell",
                { opacity: 0 },
                {
                  keyframes: [
                    { opacity: 1, duration: 0.1 },
                    { opacity: 0, duration: 0.1 },
                    { opacity: 0.5, duration: 0.1 },
                    { opacity: 0, duration: 0.1 },
                    { opacity: 1, duration: 0.5 }, // Settle at full opacity
                  ],
                  stagger: {
                    amount: 2, // Spread the flicker effect over 2 seconds
                    grid: [dimensions.rows, dimensions.cols],
                    from: "random",
                  },
                  // Ensure opacity ends at the prop value (which is 1 by default, but parent might set it)
                  onComplete: () => {
                     gsap.to(".grid-cell", { opacity: opacity, duration: 0.2 });
                  }
                }
              );
            }, containerRef);
            
            // Unobserve after triggering
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      // Cleanup GSAP context if component unmounts mid-animation
      gsap.killTweensOf(".grid-cell");
    };
  }, [dimensions, activePattern, opacity]);

  // Generate grid cells
  const cells = useMemo(() => {
    const grid = [];
    if (!activePattern) return null;

    for (let r = 0; r < dimensions.rows; r++) {
      for (let c = 0; c < dimensions.cols; c++) {
        // Tile the pattern if grid is larger than pattern
        // Invert lookup if aligning from bottom/right so the "edge" of the pattern 
        // (index 0 or 25 depending on generation) matches the "edge" of the container (r/c = 0)
        
        // When alignY='bottom', r=0 is the bottom row. 
        // The pattern generator puts the bottom feature at y=GRID_SIZE-1.
        // So we need to map r=0 -> y=GRID_SIZE-1.
        const patternRow = alignY === "bottom" 
          ? (GRID_SIZE - 1 - (r % GRID_SIZE)) 
          : r % GRID_SIZE;

        // When alignX='right', c=0 is the right column.
        // The pattern generator puts the right feature at x=GRID_SIZE-1.
        // So we need to map c=0 -> x=GRID_SIZE-1.
        const patternCol = alignX === "right" 
          ? (GRID_SIZE - 1 - (c % GRID_SIZE)) 
          : c % GRID_SIZE;
        
        // Safety check
        if (activePattern[patternRow] && activePattern[patternRow][patternCol]) {
          // Calculate positions based on alignment
          const leftPos = alignX === "left" 
            ? c * CELL_SIZE 
            : dimensions.width - (c + 1) * CELL_SIZE;
            
          const topPos = alignY === "top"
            ? r * CELL_SIZE
            : dimensions.height - (r + 1) * CELL_SIZE;

          grid.push(
            <div
              key={`${r}-${c}`}
              className="absolute bg-white grid-cell"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: leftPos,
                top: topPos,
                // Start invisible, let GSAP handle the rest
                opacity: 0, 
              }}
            />
          );
        }
      }
    }
    return grid;
  }, [dimensions, activePattern, alignX, alignY]); // Removed opacity from dep array as it's handled by GSAP now

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {cells}
    </div>
  );
}