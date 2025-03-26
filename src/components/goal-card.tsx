"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Target, CheckCircle2, Calendar, Award, Trash2 } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description: string;
    progress: number;
    streak: number;
    milestones: Milestone[];
    createdAt: string;
    lastUpdated: string | null;
  };
  onLogProgress: (goalId: string) => void;
  onViewDetails: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export default function GoalCard({
  goal,
  onLogProgress,
  onViewDetails,
  onDeleteGoal,
}: GoalCardProps) {
  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  const totalMilestones = goal.milestones.length;
  const progressPercentage =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : goal.progress;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const isUpdatedToday = () => {
    if (!goal.lastUpdated) return false;

    const today = new Date();
    const lastUpdated = new Date(goal.lastUpdated);

    return today.toDateString() === lastUpdated.toDateString();
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              {goal.title}
            </CardTitle>
            <CardDescription className="mt-1">
              Created on {formatDate(goal.createdAt)}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-amber-600 font-medium">
              <Calendar className="h-4 w-4" />
              <span>{goal.streak} day streak</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 mt-1"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteGoal(goal.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {goal.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {goal.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>
            {completedMilestones} of {totalMilestones} milestones completed
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(goal.id)}
          className="flex-1"
        >
          View Details
        </Button>

        <Button
          size="sm"
          onClick={() => onLogProgress(goal.id)}
          className="flex-1 gap-1"
          disabled={isUpdatedToday()}
        >
          {isUpdatedToday() ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Logged Today
            </>
          ) : (
            <>Log Progress</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
