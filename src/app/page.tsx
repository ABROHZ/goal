import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  CheckCircle2,
  Target,
  TrendingUp,
  LineChart,
  Award,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">
              Why Track Your Goals With Us
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Our goal tracking platform helps you visualize progress, maintain
              consistency, and achieve meaningful results through an intuitive
              interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: "Clear Goal Setting",
                description:
                  "Simple interface to define meaningful goals and milestones",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Visual Progress",
                description: "Interactive wave-like map showing your journey",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "Daily Consistency",
                description:
                  "Track daily progress with satisfying visual feedback",
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Milestone Celebrations",
                description: "Celebrate achievements along your journey",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-black">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Goals Achieved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">87%</div>
              <div className="text-blue-100">Completion Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-blue-100">Days Average Streak</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">
              How Goal Wave Works
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Our unique wave-like visualization makes tracking progress
              intuitive and satisfying.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Set Your Goal
              </h3>
              <p className="text-black">
                Define your goal and break it down into achievable milestones
                along your journey.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Track Daily Progress
              </h3>
              <p className="text-black">
                Log your daily progress with a simple click and watch your
                consistency streak grow.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Visualize Success
              </h3>
              <p className="text-black">
                Watch your progress dot move along the wave map as you reach
                milestones and achieve your goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Choose the perfect plan for your goal-setting journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to Achieve Your Goals?
          </h2>
          <p className="text-black mb-8 max-w-2xl mx-auto">
            Join thousands of goal-setters who are visualizing their progress
            and celebrating their achievements.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Tracking Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
