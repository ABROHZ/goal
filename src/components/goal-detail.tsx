"use client";

import { useState, useRef } from "react";
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
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Target,
  Calendar,
  ArrowLeft,
  Award,
  CheckCircle2,
  Trash2,
  PenLine,
} from "lucide-react";
import GoalProgressMap from "./goal-progress-map";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface GoalDetailProps {
  goal: {
    id: string;
    title: string;
    description: string;
    progress: number;
    streak: number;
    milestones: Milestone[];
    createdAt: string;
    lastUpdated: string | null;
    notes?: string[];
  };
  onBack: () => void;
  onLogProgress: (goalId: string, note?: string) => void;
  onToggleMilestone: (
    goalId: string,
    milestoneId: string,
    completed: boolean,
  ) => void;
  onDeleteGoal: (goalId: string) => void;
}

export default function GoalDetail({
  goal,
  onBack,
  onLogProgress,
  onToggleMilestone,
  onDeleteGoal,
}: GoalDetailProps) {
  const [progressNote, setProgressNote] = useState("");
  const noteInputRef = useRef<HTMLTextAreaElement>(null);
  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  const totalMilestones = goal.milestones.length;
  const progressPercentage =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : goal.progress;

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not started";
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
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">Goal Details</h2>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="gap-1"
          onClick={() => onDeleteGoal(goal.id)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Goal
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-blue-600" />
                {goal.title}
              </CardTitle>
              <CardDescription className="mt-2">
                Created on {formatDate(goal.createdAt)}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-amber-600 font-medium">
                <Calendar className="h-4 w-4" />
                <span>{goal.streak} day streak</span>
              </div>
              {goal.lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Last updated: {formatDate(goal.lastUpdated)}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Description Section */}
          {goal.description && (
            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{goal.description}</p>
            </div>
          )}

          {/* Goal Progress Map */}
          <div className="py-6">
            <GoalProgressMap goal={goal} />
          </div>

          {/* Milestones Section */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Milestones ({completedMilestones}/{totalMilestones})
            </h3>

            <div className="space-y-3">
              {goal.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
                >
                  <Checkbox
                    id={`milestone-${milestone.id}`}
                    checked={milestone.completed}
                    onCheckedChange={(checked) => {
                      onToggleMilestone(
                        goal.id,
                        milestone.id,
                        checked as boolean,
                      );
                    }}
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={`milestone-${milestone.id}`}
                      className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {milestone.title}
                    </label>
                    {milestone.description && (
                      <p
                        className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                      >
                        {milestone.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {goal.milestones.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No milestones have been set for this goal.
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col space-y-4">
          {/* Progress Notes Section */}
          {goal.notes && goal.notes.length > 0 && (
            <div className="w-full space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <PenLine className="h-5 w-5 text-blue-500" />
                Progress Notes
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {goal.notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md text-sm"
                  >
                    <p className="text-muted-foreground">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Note Input */}
          <div className="w-full space-y-2">
            <Textarea
              ref={noteInputRef}
              placeholder="Add a note about your progress today..."
              className="w-full resize-none"
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
              disabled={isUpdatedToday()}
            />
          </div>

          <Button
            onClick={() => {
              onLogProgress(goal.id, progressNote);
              setProgressNote("");
            }}
            className="w-full gap-2"
            disabled={isUpdatedToday()}
          >
            {isUpdatedToday() ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Progress Logged Today
              </>
            ) : (
              <>Log Daily Progress</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
