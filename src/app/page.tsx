import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, LineChart, Award } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-16 md:py-24 border-t">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Track Your Goals With Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our goal tracking platform helps you visualize progress, maintain
              consistency, and achieve meaningful results through an intuitive
              interface.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Target className="h-5 w-5" />,
                title: "Clear Goal Setting",
                description:
                  "Simple interface to define meaningful goals and milestones",
              },
              {
                icon: <TrendingUp className="h-5 w-5" />,
                title: "Visual Progress",
                description: "Interactive wave-like map showing your journey",
              },
              {
                icon: <LineChart className="h-5 w-5" />,
                title: "Daily Consistency",
                description:
                  "Track daily progress with satisfying visual feedback",
              },
              {
                icon: <Award className="h-5 w-5" />,
                title: "Milestone Celebrations",
                description: "Celebrate achievements along your journey",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "10K+", label: "Goals Achieved" },
              { value: "87%", label: "Completion Rate" },
              { value: "30+", label: "Days Average Streak" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 border-t">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How Goal Wave Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our unique wave-like visualization makes tracking progress
              intuitive and satisfying.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: 1,
                title: "Set Your Goal",
                description:
                  "Define your goal and break it down into achievable milestones along your journey.",
              },
              {
                step: 2,
                title: "Track Daily Progress",
                description:
                  "Log your daily progress with a simple click and watch your consistency streak grow.",
              },
              {
                step: 3,
                title: "Visualize Success",
                description:
                  "Watch your progress dot move along the wave map as you reach milestones and achieve your goal.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="font-medium">{item.step}</span>
                </div>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 border-t" id="pricing">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your goal-setting journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t">
        <div className="container max-w-3xl space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Achieve Your Goals?
          </h2>
          <p className="text-muted-foreground mx-auto">
            Join thousands of goal-setters who are visualizing their progress
            and celebrating their achievements.
          </p>
          <Button asChild size="lg">
            <a href="/dashboard">
              Start Tracking Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
