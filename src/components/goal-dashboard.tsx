"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Plus, Target, TrendingUp, Award, Loader2 } from "lucide-react";
import GoalCard from "./goal-card";
import GoalForm from "./goal-form";
import GoalDetail from "./goal-detail";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { createClient } from "../../supabase/client";
import { useToast } from "./ui/use-toast";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  streak: number;
  milestones: Milestone[];
  createdAt: string;
  targetDate: string | null;
  lastUpdated: string | null;
}

export default function GoalDashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  // Load goals from Supabase on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-get-goals",
        );

        if (error) {
          console.error("Error fetching goals:", error);
          toast({
            title: "Error fetching goals",
            description: error.message,
            variant: "destructive",
          });
          // Fallback to localStorage if API fails
          const savedGoals = localStorage.getItem("goals");
          if (savedGoals) {
            setGoals(JSON.parse(savedGoals));
          }
        } else if (data) {
          // Transform the data to match our Goal interface
          const formattedGoals = data.map((goal: any) => ({
            id: goal.id,
            title: goal.title,
            description: goal.description || "",
            progress: goal.progress || 0,
            streak: goal.streak || 0,
            milestones:
              goal.milestones?.map((m: any) => ({
                id: m.id,
                title: m.title,
                description: m.description || "",
                completed: m.completed || false,
              })) || [],
            createdAt: goal.created_at,
            lastUpdated: goal.last_updated,
          }));
          setGoals(formattedGoals);
          // Also save to localStorage as backup
          localStorage.setItem("goals", JSON.stringify(formattedGoals));
        }
      } catch (error) {
        console.error("Error:", error);
        // Fallback to localStorage
        const savedGoals = localStorage.getItem("goals");
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const selectedGoal = selectedGoalId
    ? goals.find((goal) => goal.id === selectedGoalId)
    : null;

  const handleCreateGoal = async (goalData: Omit<Goal, "id">) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-goal",
        {
          body: {
            title: goalData.title,
            description: goalData.description,
            targetDate: goalData.targetDate,
            milestones: goalData.milestones.map((m) => ({
              title: m.title,
              description: m.description,
              completed: m.completed,
            })),
          },
        },
      );

      if (error) {
        console.error("Error creating goal:", error);
        toast({
          title: "Error creating goal",
          description: error.message,
          variant: "destructive",
        });
        // Fallback to local creation
        const newGoal = {
          ...goalData,
          id: Date.now().toString(),
        };
        setGoals([...goals, newGoal as Goal]);
      } else if (data?.goal) {
        // Format the returned goal to match our interface
        const newGoal = {
          id: data.goal.id,
          title: data.goal.title,
          description: data.goal.description || "",
          progress: data.goal.progress || 0,
          streak: data.goal.streak || 0,
          milestones: goalData.milestones, // Use the milestones from the form as they might not be returned by the API
          createdAt: data.goal.created_at,
          lastUpdated: data.goal.last_updated,
        };
        setGoals([...goals, newGoal as Goal]);
        toast({
          title: "Goal created",
          description: "Your goal has been created successfully",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Fallback to local creation
      const newGoal = {
        ...goalData,
        id: Date.now().toString(),
      };
      setGoals([...goals, newGoal as Goal]);
    }
    setIsFormOpen(false);
  };

  const handleLogProgress = async (goalId: string) => {
    try {
      // Call the log-progress function
      const { error } = await supabase.functions.invoke(
        "supabase-functions-log-progress",
        {
          body: { goalId },
        },
      );

      if (error) {
        console.error("Error logging progress:", error);
        toast({
          title: "Error logging progress",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const today = new Date();
          const lastUpdated = goal.lastUpdated
            ? new Date(goal.lastUpdated)
            : null;

          // Check if this is a consecutive day (streak)
          let newStreak = goal.streak;
          if (!lastUpdated) {
            // First time logging progress
            newStreak = 1;
          } else {
            const lastDate = new Date(lastUpdated);
            const diffTime = today.getTime() - lastDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              // Consecutive day
              newStreak += 1;
            } else if (diffDays > 1) {
              // Streak broken
              newStreak = 1;
            }
            // If same day, keep streak the same
          }

          // Calculate progress based on milestones
          const completedMilestones = goal.milestones.filter(
            (m) => m.completed,
          ).length;
          const totalMilestones = goal.milestones.length;
          const progress =
            totalMilestones > 0
              ? Math.round((completedMilestones / totalMilestones) * 100)
              : Math.min(100, goal.progress + 5); // Increment by 5% if no milestones

          return {
            ...goal,
            progress,
            streak: newStreak,
            lastUpdated: today.toISOString(),
          };
        }
        return goal;
      }),
    );
  };

  const handleToggleMilestone = async (
    goalId: string,
    milestoneId: string,
    completed: boolean,
  ) => {
    try {
      // Call the toggle-milestone function (you'll need to create this)
      const { error } = await supabase.functions.invoke(
        "supabase-functions-toggle-milestone",
        {
          body: { goalId, milestoneId, completed },
        },
      );

      if (error) {
        console.error("Error toggling milestone:", error);
        toast({
          title: "Error updating milestone",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((milestone) =>
            milestone.id === milestoneId
              ? { ...milestone, completed }
              : milestone,
          );

          // Calculate progress based on completed milestones
          const completedCount = updatedMilestones.filter(
            (m) => m.completed,
          ).length;
          const progress = Math.round(
            (completedCount / updatedMilestones.length) * 100,
          );

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
            lastUpdated: new Date().toISOString(),
          };
        }
        return goal;
      }),
    );
  };

  // If a goal is selected, show its details
  if (selectedGoal) {
    return (
      <GoalDetail
        goal={selectedGoal}
        onBack={() => setSelectedGoalId(null)}
        onLogProgress={handleLogProgress}
        onToggleMilestone={handleToggleMilestone}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          My Goals
        </h1>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <GoalForm
              onSubmit={handleCreateGoal}
              onClose={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" className="gap-1">
            <Target className="h-4 w-4" /> All Goals
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="gap-1">
            <TrendingUp className="h-4 w-4" /> In Progress
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            <Award className="h-4 w-4" /> Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your goals...</p>
            </div>
          ) : goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onLogProgress={handleLogProgress}
                  onViewDetails={(id) => setSelectedGoalId(id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first goal to start tracking your progress
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Your First Goal
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your goals...</p>
            </div>
          ) : goals.filter((goal) => goal.progress < 100).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals
                .filter((goal) => goal.progress < 100)
                .map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onLogProgress={handleLogProgress}
                    onViewDetails={(id) => setSelectedGoalId(id)}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Goals In Progress</h3>
              <p className="text-muted-foreground">
                All your goals are either completed or you haven't created any
                yet
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your goals...</p>
            </div>
          ) : goals.filter((goal) => goal.progress === 100).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals
                .filter((goal) => goal.progress === 100)
                .map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onLogProgress={handleLogProgress}
                    onViewDetails={(id) => setSelectedGoalId(id)}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Completed Goals</h3>
              <p className="text-muted-foreground">
                Keep working on your goals to see them here
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
