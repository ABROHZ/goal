"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle2, Award, AlertCircle } from "lucide-react";

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

  // Generate intermediate points for the path
  const generateIntermediatePoints = (count: number) => {
    const points = [];
    const segmentSize = 100 / (count + 1);

    for (let i = 1; i <= count; i++) {
      const position = segmentSize * i;
      points.push({
        id: `point-${i}`,
        position,
        completed: position <= adjustedProgress,
      });
    }

    return points;
  };

  // Generate 15 intermediate points for more granular progress visualization
  const intermediatePoints = generateIntermediatePoints(15);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Goal Progress Map
          {!checkIfLoggedToday(goal.lastUpdated) && (
            <div className="ml-auto flex items-center text-xs text-amber-600 gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Progress reduced (no daily log)</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative h-32 w-full overflow-hidden bg-blue-50 rounded-lg">
          {/* Wave Path */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop
                  offset="100%"
                  stopColor={getProgressColor(adjustedProgress)}
                />
              </linearGradient>
            </defs>
            <path
              d="M0,50 C25,10 50,90 75,30 C100,70 125,10 150,50 C175,10 200,90 225,30 C250,70 275,10 300,50 C325,10 350,90 375,30 C400,70 425,10 450,50 C475,10 500,90 525,30 C550,70 575,10 600,50 C625,10 650,90 675,30 C700,70 725,10 750,50 C775,10 800,50 800,50"
              fill="none"
              stroke="#dbeafe"
              strokeWidth="4"
            />
            <path
              d="M0,50 C25,10 50,90 75,30 C100,70 125,10 150,50 C175,10 200,90 225,30 C250,70 275,10 300,50 C325,10 350,90 375,30 C400,70 425,10 450,50 C475,10 500,90 525,30 C550,70 575,10 600,50 C625,10 650,90 675,30 C700,70 725,10 750,50 C775,10 800,50 800,50"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeDasharray="800"
              strokeDashoffset={800 - (800 * animateProgress) / 100}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>

          {/* Progress Dot */}
          <div
            className="absolute top-0 w-6 h-6 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-1000 ease-in-out z-10"
            style={{
              left: `${animateProgress}%`,
              top: `${50 - Math.sin((animateProgress / 100) * Math.PI * 4) * 40}%`,
              backgroundColor: getProgressColor(adjustedProgress),
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>

          {/* Start Point */}
          <div className="absolute left-0 top-1/2 w-3 h-3 bg-gray-400 rounded-full transform -translate-y-1/2"></div>

          {/* End Point */}
          <div className="absolute right-0 top-1/2 w-3 h-3 bg-green-500 rounded-full transform -translate-y-1/2"></div>

          {/* Intermediate Points */}
          {intermediatePoints.map((point) => (
            <div
              key={point.id}
              className={`absolute w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 ${point.completed ? "bg-blue-500" : "bg-gray-300"}`}
              style={{
                left: `${point.position}%`,
                top: `${50 - Math.sin((point.position / 100) * Math.PI * 4) * 40}%`,
                zIndex: 5,
              }}
            />
          ))}

          {/* Milestone Markers */}
          {goal.milestones.map((milestone, index) => {
            const position = ((index + 1) / (goal.milestones.length + 1)) * 100;
            return (
              <div
                key={milestone.id}
                className={`absolute w-5 h-5 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer transition-colors duration-300 ${milestone.completed ? "bg-green-500" : "bg-gray-300"}`}
                style={{
                  left: `${position}%`,
                  top: `${50 - Math.sin((position / 100) * Math.PI * 4) * 40}%`,
                  zIndex: 10,
                }}
                onClick={() => onMilestoneClick?.(milestone.id)}
                title={milestone.title}
              >
                {milestone.completed && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-muted-foreground">Start</div>
          <div
            className="font-medium"
            style={{ color: getProgressColor(progressPercentage) }}
          >
            {progressPercentage}% Complete
          </div>
          <div className="text-muted-foreground">Goal</div>
        </div>
      </CardContent>
    </Card>
  );
}
