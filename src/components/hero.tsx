import Link from "next/link";
import { ArrowUpRight, Check, Target } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-black mb-8 tracking-tight">
              Track <span className="text-blue-600">Goals</span> with Visual
              Progress Maps
            </h1>

            <p className="text-xl text-black mb-12 max-w-2xl mx-auto leading-relaxed">
              Set meaningful goals, track daily progress, and visualize your
              journey with our intuitive wave-like goal maps. Stay consistent
              and celebrate milestones along the way.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium bg-[#000000]"
              >
                Start Tracking Goals
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-black">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Visual progress tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Daily consistency streaks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Milestone celebrations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
