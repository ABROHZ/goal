"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle2, Award, AlertCircle, Target, Zap } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  milestones: Milestone[];
  lastUpdated: string | null;
}

interface GoalProgressMapProps {
  goal: Goal;
  onMilestoneClick?: (milestoneId: string) => void;
}

export default function GoalProgressMap({
  goal,
  onMilestoneClick,
}: GoalProgressMapProps) {
  const [animateProgress, setAnimateProgress] = useState(0);
  const [adjustedProgress, setAdjustedProgress] = useState(goal.progress);

  useEffect(() => {
    // Check if user has logged progress today
    const hasLoggedToday = checkIfLoggedToday(goal.lastUpdated);

    // Reduce progress if user hasn't logged today (by 5%)
    const reducedProgress = hasLoggedToday
      ? goal.progress
      : Math.max(0, goal.progress - 5);
    setAdjustedProgress(reducedProgress);

    // Animate progress from 0 to current value
    const timer = setTimeout(() => {
      setAnimateProgress(reducedProgress);
    }, 300);

    return () => clearTimeout(timer);
  }, [goal.progress, goal.lastUpdated]);

  // Function to check if progress was logged today
  const checkIfLoggedToday = (lastUpdated: string | null): boolean => {
    if (!lastUpdated) return false;

    const today = new Date();
    const lastDate = new Date(lastUpdated);

    return (
      today.getDate() === lastDate.getDate() &&
      today.getMonth() === lastDate.getMonth() &&
      today.getFullYear() === lastDate.getFullYear()
    );
  };

  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  const totalMilestones = goal.milestones.length;
  const progressPercentage =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : adjustedProgress;

  // Generate progress color based on percentage
  const getProgressColor = (percentage: number): string => {
    if (percentage < 25) return "#ef4444"; // red-500
    if (percentage < 50) return "#f97316"; // orange-500
    if (percentage < 75) return "#eab308"; // yellow-500
    return "#22c55e"; // green-500
  };

  // Generate dots for the path
  const generateDots = (count: number) => {
    const dots = [];
    const segmentSize = 100 / (count - 1);

    for (let i = 0; i < count; i++) {
      const position = segmentSize * i;
      // Add some randomness to Y position to create a more natural path
      const randomOffset = Math.sin(i * 0.5) * 15 + (Math.random() * 10 - 5);

      // Every 5th dot is a challenge (larger, different style)
      const isChallenge = i % 5 === 0 && i !== 0 && i !== count - 1;

      dots.push({
        id: `dot-${i}`,
        position,
        yOffset: randomOffset,
        completed: position <= adjustedProgress,
        isChallenge,
      });
    }

    return dots;
  };

  // Generate 40 dots for the progress path
  const dots = generateDots(40);

  return (
    <Card className="w-full overflow-hidden bg-gray-900 border-2 border-gray-800">
      <CardHeader className="pb-2 border-b border-gray-800">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-100">
          <Target className="h-5 w-5 text-blue-400" />
          Life's Journey Map
          {!checkIfLoggedToday(goal.lastUpdated) && (
            <div className="ml-auto flex items-center text-xs text-amber-400 gap-1 bg-amber-950/50 px-2 py-1 rounded-full">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Progress reduced (no daily log)</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-950 border border-gray-800 shadow-inner">
          {/* Star-like background */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute w-0.5 h-0.5 bg-gray-500 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-6">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={`grid-${i}`}
                className="border-[0.5px] border-gray-800/30"
              />
            ))}
          </div>

          {/* Start Point */}
          <div className="absolute left-0 top-1/2 w-5 h-5 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 border-2 border-gray-900 shadow-md z-20">
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-50"></div>
          </div>

          {/* End Point - Award Icon */}
          <div className="absolute right-0 top-1/2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full transform -translate-y-1/2 translate-x-1/2 border-2 border-gray-900 shadow-md z-20 flex items-center justify-center">
            <Award className="w-5 h-5 text-gray-900" />
            <div className="absolute inset-0 bg-amber-500 rounded-full animate-pulse opacity-30"></div>
          </div>

          {/* Progress Dots */}
          {dots.map((dot, index) => {
            // Calculate the size based on completion and challenge status
            const size = dot.isChallenge ? 8 : dot.completed ? 4 : 3;
            const opacity = dot.completed ? 1 : 0.3;

            // Determine color based on completion and challenge status
            let bgColor = dot.completed
              ? getProgressColor(dot.position)
              : "#4b5563"; // gray-600

            // Special styling for challenge dots
            let borderColor = "transparent";
            let shadowColor = "transparent";
            let zIndex = 5;

            if (dot.isChallenge) {
              bgColor = dot.completed ? "#8b5cf6" : "#4b5563"; // purple-500 if completed
              borderColor = dot.completed ? "#c4b5fd" : "#6b7280"; // purple-200 : gray-500
              shadowColor = dot.completed
                ? "rgba(139, 92, 246, 0.5)"
                : "transparent";
              zIndex = 10;
            }

            return (
              <div
                key={dot.id}
                className={`absolute rounded-full transition-all duration-500`}
                style={{
                  left: `${dot.position}%`,
                  top: `${50 + dot.yOffset}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: bgColor,
                  opacity,
                  transform: "translate(-50%, -50%)",
                  border: dot.isChallenge ? `2px solid ${borderColor}` : "none",
                  boxShadow: dot.isChallenge
                    ? `0 0 10px 2px ${shadowColor}`
                    : "none",
                  zIndex,
                }}
              >
                {dot.isChallenge && dot.completed && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <Zap className="h-4 w-4 text-purple-400" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Current Progress Indicator */}
          {animateProgress > 0 && (
            <div
              className="absolute top-0 w-6 h-6 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-1000 ease-in-out z-30"
              style={{
                left: `${animateProgress}%`,
                top: `${50 + Math.sin(animateProgress * 0.1) * 15}%`,
                background: `radial-gradient(circle at center, ${getProgressColor(adjustedProgress)}, ${getProgressColor(adjustedProgress)}cc)`,
                boxShadow: `0 0 15px 3px ${getProgressColor(adjustedProgress)}80`,
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}

          {/* Milestone Markers */}
          {goal.milestones.map((milestone, index) => {
            const position = ((index + 1) / (goal.milestones.length + 1)) * 100;
            const yOffset =
              Math.sin(position * 0.1) * 15 + (Math.random() * 6 - 3);

            return (
              <div
                key={milestone.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-transform duration-300 hover:scale-110 cursor-pointer group`}
                style={{
                  left: `${position}%`,
                  top: `${50 + yOffset}%`,
                }}
                onClick={() => onMilestoneClick?.(milestone.id)}
                title={milestone.title}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${milestone.completed ? "border-purple-400 bg-purple-600" : "border-gray-600 bg-gray-700"} shadow-md transition-colors duration-300`}
                >
                  {milestone.completed && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30">
                  {milestone.title}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-300">
          <div className="flex flex-col items-center">
            <div className="text-blue-400 font-medium">Start</div>
            <div className="text-xs text-gray-500">Day 1</div>
          </div>
          <div
            className={`font-medium px-3 py-1 rounded-full text-gray-900 transition-colors duration-300`}
            style={{ backgroundColor: getProgressColor(progressPercentage) }}
          >
            {progressPercentage}% Complete
          </div>
          <div className="flex flex-col items-center">
            <div className="text-amber-400 font-medium">Goal</div>
            <div className="text-xs text-gray-500">Achievement</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Progress Dots</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-3 h-3 bg-purple-600 rounded-full border border-purple-400"></div>
            <span>Challenge Point</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <span>Milestone</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Award className="w-3 h-3 text-amber-400" />
            <span>Achievement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
