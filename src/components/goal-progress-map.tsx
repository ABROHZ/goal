"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle2, Award } from "lucide-react";

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

  useEffect(() => {
    // Animate progress from 0 to current value
    const timer = setTimeout(() => {
      setAnimateProgress(goal.progress);
    }, 300);

    return () => clearTimeout(timer);
  }, [goal.progress]);

  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  const totalMilestones = goal.milestones.length;
  const progressPercentage =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : goal.progress;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Goal Progress Map
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
            <path
              d="M0,50 C100,20 200,80 300,50 C400,20 500,80 600,50 C700,20 800,80 800,50"
              fill="none"
              stroke="#dbeafe"
              strokeWidth="4"
            />
            <path
              d="M0,50 C100,20 200,80 300,50 C400,20 500,80 600,50 C700,20 800,80 800,50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="800"
              strokeDashoffset={800 - (800 * animateProgress) / 100}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>

          {/* Progress Dot */}
          <div
            className="absolute top-0 w-6 h-6 bg-blue-600 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-1000 ease-in-out"
            style={{
              left: `${animateProgress}%`,
              top: `${50 - Math.sin((animateProgress / 100) * Math.PI) * 30}%`,
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>

          {/* Start Point */}
          <div className="absolute left-0 top-1/2 w-3 h-3 bg-gray-400 rounded-full transform -translate-y-1/2"></div>

          {/* End Point */}
          <div className="absolute right-0 top-1/2 w-3 h-3 bg-green-500 rounded-full transform -translate-y-1/2"></div>

          {/* Milestone Markers */}
          {goal.milestones.map((milestone, index) => {
            const position = ((index + 1) / (goal.milestones.length + 1)) * 100;
            return (
              <div
                key={milestone.id}
                className={`absolute w-5 h-5 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer ${milestone.completed ? "bg-green-500" : "bg-gray-300"}`}
                style={{
                  left: `${position}%`,
                  top: `${50 - Math.sin((position / 100) * Math.PI) * 30}%`,
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
          <div className="font-medium">{progressPercentage}% Complete</div>
          <div className="text-muted-foreground">Goal</div>
        </div>
      </CardContent>
    </Card>
  );
}
