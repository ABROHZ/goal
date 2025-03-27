"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Trophy,
  Target,
  Flame,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
}

export default function AchievementsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // In a real app, you would fetch achievements from the database
        // For now, we'll use mock data
        setAchievements(getMockAchievements());
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const getMockAchievements = (): Achievement[] => {
    return [
      {
        id: "1",
        title: "Goal Setter",
        description: "Create your first goal",
        icon: "target",
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        unlockedAt: "2023-06-15",
        category: "goals",
      },
      {
        id: "2",
        title: "Milestone Master",
        description: "Complete 5 milestones",
        icon: "checkCircle2",
        progress: 3,
        maxProgress: 5,
        unlocked: false,
        category: "milestones",
      },
      {
        id: "3",
        title: "Consistency King",
        description: "Log progress for 7 consecutive days",
        icon: "flame",
        progress: 4,
        maxProgress: 7,
        unlocked: false,
        category: "streaks",
      },
      {
        id: "4",
        title: "Goal Achiever",
        description: "Complete your first goal",
        icon: "trophy",
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        category: "goals",
      },
      {
        id: "5",
        title: "30-Day Warrior",
        description: "Log progress for 30 days total",
        icon: "calendar",
        progress: 12,
        maxProgress: 30,
        unlocked: false,
        category: "streaks",
      },
      {
        id: "6",
        title: "Triple Threat",
        description: "Have 3 goals in progress simultaneously",
        icon: "target",
        progress: 2,
        maxProgress: 3,
        unlocked: false,
        category: "goals",
      },
    ];
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award className="h-8 w-8 text-yellow-500" />;
      case "trophy":
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case "target":
        return <Target className="h-8 w-8 text-blue-500" />;
      case "flame":
        return <Flame className="h-8 w-8 text-orange-500" />;
      case "calendar":
        return <Calendar className="h-8 w-8 text-purple-500" />;
      case "checkCircle2":
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      default:
        return <Award className="h-8 w-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Loading your achievements...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const inProgressAchievements = achievements.filter((a) => !a.unlocked);

  const goalAchievements = achievements.filter((a) => a.category === "goals");
  const milestoneAchievements = achievements.filter(
    (a) => a.category === "milestones",
  );
  const streakAchievements = achievements.filter(
    (a) => a.category === "streaks",
  );

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-1"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>
                Track your progress and unlock rewards
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {unlockedAchievements.length}/{achievements.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Achievements Unlocked
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="streaks">Streaks</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">
                Unlocked ({unlockedAchievements.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="mr-4 bg-background p-2 rounded-full">
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 border-green-200"
                        >
                          Unlocked
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Unlocked on{" "}
                          {new Date(
                            achievement.unlockedAt,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mt-8">
                In Progress ({inProgressAchievements.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start p-4 border rounded-lg"
                  >
                    <div className="mr-4 bg-muted p-2 rounded-full">
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div className="w-full">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress
                          value={
                            (achievement.progress / achievement.maxProgress) *
                            100
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goalAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="mr-4 bg-background p-2 rounded-full">
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 border-green-200"
                          >
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestoneAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="mr-4 bg-background p-2 rounded-full">
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 border-green-200"
                          >
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="streaks" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {streakAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="mr-4 bg-background p-2 rounded-full">
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 border-green-200"
                          >
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
