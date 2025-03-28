"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Target, Plus, Trash2, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export default function GoalForm({
  onSubmit = () => {},
  onClose = () => {},
}: {
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        completed: false,
      },
    ]);
  };

  const updateMilestone = (
    id: string,
    field: keyof Milestone,
    value: string | boolean,
  ) => {
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone,
      ),
    );
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const goalData = {
        title,
        description,
        milestones: milestones.filter((m) => m.title.trim() !== ""),
        createdAt: new Date().toISOString(),
        targetDate: date ? date.toISOString() : null,
        progress: 0,
        streak: 0,
        lastUpdated: null,
      };

      await onSubmit(goalData);

      // Reset form
      setTitle("");
      setDescription("");
      setMilestones([]);
      setDate(new Date());

      // Close the form
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Create New Goal
        </CardTitle>
        <CardDescription>
          Define your goal and set milestones to track your progress
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto pb-6 mb-16">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="Enter your goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Target Completion Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                  disabled={isSubmitting}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Milestones</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMilestone}
                className="flex items-center gap-1"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" /> Add Milestone
              </Button>
            </div>

            {milestones.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add milestones to break down your goal into achievable steps
              </p>
            )}

            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex gap-3 items-start">
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <Input
                        placeholder="Milestone title"
                        value={milestone.title}
                        onChange={(e) =>
                          updateMilestone(milestone.id, "title", e.target.value)
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                    <Textarea
                      placeholder="Milestone description (optional)"
                      value={milestone.description || ""}
                      onChange={(e) =>
                        updateMilestone(
                          milestone.id,
                          "description",
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMilestone(milestone.id)}
                    className="text-gray-500 hover:text-red-500"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="fixed bottom-0 left-0 right-0 bg-white border-t pt-4 z-10">
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Goal...
              </>
            ) : (
              <>Create Goal</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
