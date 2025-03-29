"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "../../supabase/supabase";
import { Badge } from "./ui/badge";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
    }
  };

  // Define features based on plan type
  const features = [
    "Goal tracking",
    "Progress visualization",
    "Daily consistency tracking",
  ];

  if (item.name !== "Free") {
    features.push("Unlimited goals", "Advanced analytics");
  }

  if (item.name === "Pro") {
    features.push("Priority support");
  }

  return (
    <Card className={`flex flex-col ${item.popular ? "border-primary" : ""}`}>
      <CardHeader>
        {item.popular && <Badge className="w-fit mb-2">Most Popular</Badge>}
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold">${item?.amount / 100}</span>
          <span className="text-muted-foreground ml-1">/{item?.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => handleCheckout(item.id)}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
