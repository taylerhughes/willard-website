"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

export default function FunnelPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const ballSpawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const funnelBodiesRef = useRef<Matter.Body[]>([]);
  const staticBodiesRef = useRef<Matter.Body[]>([]);

  const [withWillard, setWithWillard] = useState(false); // Default to without Willard

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create engine with minimal gravity for horizontal float
    const engine = Matter.Engine.create({
      gravity: { x: 1, y: 0.05, scale: 0.001 },
      enableSleeping: false,
      positionIterations: 10,
      velocityIterations: 10,
    });
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

    // Create runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // Create boundaries (floor and ceiling)
    const floor = Matter.Bodies.rectangle(
      width / 2,
      height - 5,
      width * 2,
      10,
      { isStatic: true, render: { visible: false }, label: "floor" }
    );

    const ceiling = Matter.Bodies.rectangle(
      width / 2,
      5,
      width * 2,
      10,
      { isStatic: true, render: { visible: false }, label: "ceiling" }
    );

    // Create bucket/container on the right side
    // The bucket is at: right-0, top-[250px], w-[105px], h-[136px]
    const containerWidth = Math.min(width * 0.9, 1618);
    const containerLeft = (width - containerWidth) / 2;
    const bucketRight = containerLeft + containerWidth;
    const bucketWidth = 105;
    const bucketHeight = 136;
    const bucketTop = height / 2 - 318 + 250;
    const bucketBottom = bucketTop + bucketHeight;

    // Bottom wall of bucket (thicker for better collision, extends downward)
    const bucketFloor = Matter.Bodies.rectangle(
      bucketRight - bucketWidth / 2,
      bucketBottom + 10,
      bucketWidth,
      20,
      { isStatic: true, render: { visible: false }, label: "bucket" }
    );

    // Right wall of bucket (thicker for better collision, extends rightward)
    const bucketRightWall = Matter.Bodies.rectangle(
      bucketRight + 10,
      height / 2,
      20,
      bucketHeight,
      { isStatic: true, render: { visible: false }, label: "bucket" }
    );

    // Top wall of bucket (thicker for better collision, extends upward)
    const bucketCeiling = Matter.Bodies.rectangle(
      bucketRight - bucketWidth / 2,
      bucketTop - 10,
      bucketWidth,
      20,
      { isStatic: true, render: { visible: false }, label: "bucket" }
    );

    staticBodiesRef.current = [floor, ceiling, bucketFloor, bucketRightWall, bucketCeiling];
    Matter.Composite.add(engine.world, staticBodiesRef.current);

    // Run the engine and renderer
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Ball color palette - only blue hues
    const ballColors = [
      "#0028b7", "#0133eb", "#006cfd",
      "#6cabff", "#c3e0fd"
    ];

    // Ball spawning logic
    const spawnBall = () => {
      if (!engineRef.current) return;

      const containerWidth = Math.min(width * 0.9, 1618);
      const containerLeft = (width - containerWidth) / 2;
      const visionWidth = 539;

      // Spawn randomly within the Vision section
      const spawnX = containerLeft + Math.random() * visionWidth;
      const radius = 12 + Math.random() * 8;
      const yVariation = (Math.random() - 0.5) * (height * 0.4);
      const randomColor = ballColors[Math.floor(Math.random() * ballColors.length)];

      const ball = Matter.Bodies.circle(spawnX, height / 2 + yVariation, radius, {
        restitution: 0.5,
        friction: 0.005,
        density: 0.001,
        render: {
          fillStyle: randomColor,
          opacity: 0, // Start invisible
        },
        label: "ball",
        plugin: {
          fadeIn: true,
          fadeProgress: 0,
          birthTime: Date.now(),
          lifespan: 12000, // 12 seconds lifespan
        },
      });

      // Add initial velocity to the right
      Matter.Body.setVelocity(ball, { x: 1.5, y: 0 });
      Matter.Composite.add(engineRef.current.world, ball);
    };

    // Cleanup balls off-screen and handle transformations
    const updateBalls = () => {
      if (!engineRef.current) return;

      const allBodies = Matter.Composite.allBodies(engineRef.current.world);
      const centerX = width / 2;

      allBodies.forEach((body) => {
        if (body.label === "ball") {
          // Check lifespan and handle fade-out
          if (body.plugin?.birthTime && body.plugin?.lifespan) {
            const age = Date.now() - body.plugin.birthTime;
            const fadeOutStart = body.plugin.lifespan - 2000; // Start fading 2 seconds before death

            if (age >= body.plugin.lifespan) {
              // Remove ball after lifespan
              Matter.Composite.remove(engineRef.current!.world, body);
              return;
            } else if (age >= fadeOutStart) {
              // Fade out in the last 2 seconds
              const fadeOutProgress = (age - fadeOutStart) / 2000;
              body.render.opacity = Math.max(0, 1 - fadeOutProgress);
            }
          }

          // Remove balls off-screen
          if (body.position.x > width + 100 || body.position.x < -100) {
            Matter.Composite.remove(engineRef.current!.world, body);
          }

          // Add rightward force to keep balls moving
          Matter.Body.applyForce(body, body.position, { x: 0.00001, y: 0 });

          // Handle fade-in effect
          if (body.plugin?.fadeIn && body.plugin.fadeProgress < 1) {
            body.plugin.fadeProgress += 0.05; // Fade in over ~10 frames (0.5 seconds at 50ms intervals)
            body.render.opacity = Math.min(1, body.plugin.fadeProgress);
            if (body.plugin.fadeProgress >= 1) {
              body.plugin.fadeIn = false;
            }
          }

          // Store original color if not already stored
          if (!body.plugin) {
            body.plugin = { originalColor: body.render.fillStyle };
          }
          if (!body.plugin.originalColor) {
            body.plugin.originalColor = body.render.fillStyle;
          }

          // Transform balls in "With Willard" mode after passing through funnel
          if (withWillard) {
            if (body.position.x > centerX + 250 && body.render.fillStyle !== "#6cabff") {
              body.render.fillStyle = "#6cabff";
            }
          }

          // Reset to original color in "Without Willard" mode
          if (!withWillard && body.plugin.originalColor) {
            body.render.fillStyle = body.plugin.originalColor;
          }
        }
      });
    };

    // Run update loop
    const updateInterval = setInterval(updateBalls, 50);

    // Spawn balls continuously (even slower rate)
    ballSpawnIntervalRef.current = setInterval(spawnBall, 1200);

    // Spawn initial ball with delay to ensure physics engine is ready
    setTimeout(spawnBall, 500);

    // Handle window resize
    const handleResize = () => {
      if (renderRef.current) {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        renderRef.current.canvas.width = newWidth;
        renderRef.current.canvas.height = newHeight;
        renderRef.current.options.width = newWidth;
        renderRef.current.options.height = newHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (ballSpawnIntervalRef.current) {
        clearInterval(ballSpawnIntervalRef.current);
      }
      clearInterval(updateInterval);
      window.removeEventListener("resize", handleResize);
      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  // Handle mode switching
  useEffect(() => {
    if (!engineRef.current) return;

    const engine = engineRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;

    // Remove ALL existing funnel walls completely
    console.log("Removing funnel bodies:", funnelBodiesRef.current.length);
    funnelBodiesRef.current.forEach((body) => {
      Matter.Composite.remove(engine.world, body);
      Matter.World.remove(engine.world, body);
    });
    funnelBodiesRef.current = [];

    console.log("withWillard:", withWillard);
    console.log("Bodies in world after removal:", Matter.Composite.allBodies(engine.world).filter(b => b.label === "funnel").length);

    if (!withWillard) {
      // Ensure no funnel when withWillard is false
      console.log("No funnel - returning");
      return;
    }

    if (withWillard) {
      // Calculate positions to match the SVG funnel
      // New design: Vision=539px, Middle=540px, Delivery=434px
      const containerWidth = Math.min(width * 0.9, 1618);
      const containerLeft = (width - containerWidth) / 2;

      // Calculate x positions based on actual section widths
      const x1 = containerLeft + 539; // Left edge (end of Vision section)
      const x2 = containerLeft + 539 + 540; // Right edge of middle section
      const x3 = containerLeft + 539 + 540 + 434; // Right edge (start of PMF area)

      const y1Top = height / 2 - 318; // Top edge of 636px container
      const y2Top = height / 2 - (636 * 0.08); // 42% from center (neck)
      const y1Bottom = height / 2 + 318; // Bottom edge of 636px container
      const y2Bottom = height / 2 + (636 * 0.08); // 58% from center (neck)

      const wallThickness = 8;

      // Calculate lengths and angles for each wall segment
      // Top left converging wall (x1,y1Top -> x2,y2Top)
      const topLeftLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2Top - y1Top, 2));
      const topLeftAngle = Math.atan2(y2Top - y1Top, x2 - x1);
      const topLeftWall = Matter.Bodies.rectangle(
        (x1 + x2) / 2,
        (y1Top + y2Top) / 2,
        topLeftLength,
        wallThickness,
        {
          isStatic: true,
          angle: topLeftAngle,
          render: { visible: false },
          label: "funnel",
        }
      );

      // Bottom left converging wall (x1,y1Bottom -> x2,y2Bottom)
      const bottomLeftLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2Bottom - y1Bottom, 2));
      const bottomLeftAngle = Math.atan2(y2Bottom - y1Bottom, x2 - x1);
      const bottomLeftWall = Matter.Bodies.rectangle(
        (x1 + x2) / 2,
        (y1Bottom + y2Bottom) / 2,
        bottomLeftLength,
        wallThickness,
        {
          isStatic: true,
          angle: bottomLeftAngle,
          render: { visible: false },
          label: "funnel",
        }
      );

      // Top right straight horizontal wall (x2,y2Top -> x3,y2Top)
      const topRightLength = x3 - x2;
      const topRightWall = Matter.Bodies.rectangle(
        (x2 + x3) / 2,
        y2Top,
        topRightLength,
        wallThickness,
        {
          isStatic: true,
          angle: 0,
          render: { visible: false },
          label: "funnel",
        }
      );

      // Bottom right straight horizontal wall (x2,y2Bottom -> x3,y2Bottom)
      const bottomRightLength = x3 - x2;
      const bottomRightWall = Matter.Bodies.rectangle(
        (x2 + x3) / 2,
        y2Bottom,
        bottomRightLength,
        wallThickness,
        {
          isStatic: true,
          angle: 0,
          render: { visible: false },
          label: "funnel",
        }
      );

      funnelBodiesRef.current = [topLeftWall, bottomLeftWall, topRightWall, bottomRightWall];
      Matter.Composite.add(engine.world, funnelBodiesRef.current);
      console.log("Added funnel bodies:", funnelBodiesRef.current.length);
      console.log("Total funnel bodies in world:", Matter.Composite.allBodies(engine.world).filter(b => b.label === "funnel").length);
    }
  }, [withWillard]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 z-30" />

      {/* Three Sections Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1618px] h-[636px] pointer-events-none z-0 flex">
        {/* Section 1 - Vision */}
        <div className="relative w-[539px] h-full bg-[#222] rounded-tl-[24px] rounded-bl-[24px] flex flex-col items-center justify-center">
          <p className="font-bebas text-[68px] text-[rgba(255,255,255,0.13)] text-center tracking-[-0.68px] leading-[0.85]">
            VISION
          </p>
          <p className="absolute bottom-[56px] left-[56px] font-figtree text-[16px] text-white leading-[1.291] w-[154px]">
            {withWillard
              ? "Confidence direction of travel aligns vision with PMF"
              : "Founders best guess"}
          </p>
        </div>

        {/* Section 2 - Middle Section */}
        <div className={`relative w-[540px] h-full flex items-center justify-center px-[96px] py-[226px] ${
          withWillard
            ? "bg-[#f7f7f7]"
            : "bg-[#222] border-l-4 border-r-4 border-dashed border-[#666]"
        }`}>
          <div className={`font-bebas text-[68px] text-center tracking-[-0.68px] leading-[0.85] ${
            withWillard
              ? "text-[rgba(0,0,0,0.16)]"
              : "text-[rgba(255,255,255,0.13)]"
          }`}>
            {withWillard ? (
              <>
                <p className="mb-0">WILLARD</p>
                <p className="mb-0">PRODUCT</p>
                <p className="mb-0">LOOP</p>
              </>
            ) : (
              <>
                <p className="mb-0">GUESS</p>
                <p className="mb-0">WORK</p>
              </>
            )}
          </div>
        </div>

        {/* Section 3 - Delivery */}
        <div className="relative w-[434px] h-full bg-[#222] flex flex-col items-center justify-center">
          <p className="font-bebas text-[68px] text-[rgba(255,255,255,0.13)] text-center tracking-[-0.68px] leading-[0.85]">
            DELIVERY
          </p>
          <p className="absolute bottom-[56px] left-[56px] font-figtree text-[16px] text-white leading-[1.291] w-[231px]">
            {withWillard
              ? "Delivery teams only spend time on high confidence work"
              : "Low confidence work"}
          </p>
        </div>

        {/* PMF Container on the right */}
        <div className="absolute right-0 top-[250px] w-[105px] h-[136px] border-[12px] border-black border-l-0 bg-white z-10 pointer-events-none">
          {/* PMF Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-bebas text-[36px] text-black tracking-[-0.36px] leading-[0.85]">
              PMF
            </p>
          </div>
        </div>

        {/* Lost Runway bars above and below PMF */}
        <div className="absolute right-0 top-0 w-[105px] h-[250px] bg-[#ff4e31] rounded-tr-[24px] z-10 pointer-events-none">
          <div className="absolute left-1/2 top-[57px] -translate-x-1/2 w-[20px] h-[114px] flex items-center justify-center">
            <p className="font-bebas text-[28px] text-black tracking-[-0.28px] leading-[0.85] whitespace-nowrap" style={{ transform: "rotate(270deg)" }}>
              LOST RUNWAY
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-[386px] w-[105px] h-[250px] bg-[#ff4e31] rounded-br-[24px] z-10 pointer-events-none">
          <div className="absolute left-1/2 top-[68px] -translate-x-1/2 w-[20px] h-[114px] flex items-center justify-center">
            <p className="font-bebas text-[28px] text-black tracking-[-0.28px] leading-[0.85] whitespace-nowrap" style={{ transform: "rotate(270deg)" }}>
              LOST RUNWAY
            </p>
          </div>
        </div>

        {/* Color bar at bottom - only visible with Willard */}
        {withWillard && (
          <div className="absolute bottom-0 left-[539px] h-[8px] flex">
            <div className="bg-[#06144b] h-[8px] w-[39px]" />
            <div className="bg-[#011f90] h-[8px] w-[40px]" />
            <div className="bg-[#0028b7] h-[8px] w-[185px]" />
            <div className="bg-[#0133eb] h-[8px] w-[39px]" />
            <div className="bg-[#006cfd] h-[8px] w-[40px]" />
            <div className="bg-[#6cabff] h-[8px] w-[39px]" />
            <div className="bg-[#c3e0fd] h-[8px] w-[39px]" />
            <div className="bg-[#ff4e31] h-[8px] w-[40px]" />
            <div className="bg-[#ff7353] h-[8px] w-[39px]" />
            <div className="bg-[#ffa075] h-[8px] w-[40px]" />
          </div>
        )}
      </div>

      {/* Funnel SVG Overlay - Only visible with Willard */}
      {withWillard && (
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1618px] h-[636px] pointer-events-none z-15">
          {/* Top converging line */}
          <line
            x1="33.3%"
            y1="0%"
            x2="66.7%"
            y2="42%"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Bottom converging line */}
          <line
            x1="33.3%"
            y1="100%"
            x2="66.7%"
            y2="58%"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Top straight horizontal line */}
          <line
            x1="66.7%"
            y1="42%"
            x2="93.5%"
            y2="42%"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Bottom straight horizontal line */}
          <line
            x1="66.7%"
            y1="58%"
            x2="93.5%"
            y2="58%"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Toggle Button */}
      <div className="absolute top-8 left-8 z-40">
        <button
          onClick={() => setWithWillard(!withWillard)}
          className={`shadow-lg rounded-lg px-6 py-3 font-bebas text-[20px] tracking-[-0.2px] transition-all hover:shadow-xl pointer-events-auto ${
            withWillard
              ? "bg-black text-white"
              : "bg-white text-black border-2 border-black"
          }`}
        >
          {withWillard ? "Hide Willard's Impact" : "See What Willard Does"}
        </button>
      </div>
    </div>
  );
}
