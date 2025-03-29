import Link from "next/link";
import { Twitter, Linkedin, Github, Target } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Product</h3>
            <nav className="flex flex-col space-y-2">
              {[
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#pricing" },
                { name: "My Goals", href: "/dashboard" },
                { name: "Plans", href: "/pricing" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Resources</h3>
            <nav className="flex flex-col space-y-2">
              {[
                { name: "Goal Setting Guide", href: "#" },
                { name: "Habit Building Tips", href: "#" },
                { name: "Success Stories", href: "#" },
                { name: "FAQ", href: "#" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Company</h3>
            <nav className="flex flex-col space-y-2">
              {[
                { name: "About Us", href: "#" },
                { name: "Blog", href: "#" },
                { name: "Careers", href: "#" },
                { name: "Contact", href: "#" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <nav className="flex flex-col space-y-2">
              {[
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "Cookie Policy", href: "#" },
                { name: "GDPR", href: "#" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0 flex items-center">
            <Target className="h-4 w-4 mr-2 text-primary" />
            <span>© {currentYear} GoalWave. All rights reserved.</span>
          </div>

          <div className="flex space-x-4">
            {[
              { name: "Twitter", icon: <Twitter className="h-5 w-5" /> },
              { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
              { name: "GitHub", icon: <Github className="h-5 w-5" /> },
            ].map((item) => (
              <a
                key={item.name}
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label={item.name}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
