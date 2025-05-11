"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlayClientButtonProps extends ButtonProps {
  videoUrl?: string;
  buttonText?: string;
}

export default function PlayClientButton({ videoUrl, buttonText = "Play", variant = "default", size="lg", className, ...props }: PlayClientButtonProps) {
  const { toast } = useToast();

  const handlePlay = () => {
    if (videoUrl) {
      window.location.href = videoUrl;
    } else {
      toast({
        variant: "destructive",
        title: "Video Not Available",
        description: "The video URL for this content is missing.",
      });
    }
  };

  return (
    <Button onClick={handlePlay} variant={variant} size={size} className={className} {...props}>
      <PlayCircle className="mr-2 h-5 w-5" /> {buttonText}
    </Button>
  );
}
