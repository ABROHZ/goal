import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Track your <span className="text-primary">goals</span> with visual
              progress
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Set meaningful goals, track daily progress, and visualize your
              journey with our intuitive goal maps.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#pricing">View pricing</Link>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            {[
              "Visual progress tracking",
              "Daily consistency streaks",
              "Milestone celebrations",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
