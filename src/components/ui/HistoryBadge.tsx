"use client";

import { HistoryScore } from "@/types";
import { HISTORY_SCORE_LABELS } from "@/lib/constants";

interface HistoryBadgeProps {
  score: HistoryScore;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

const scoreStyles = {
  CLEAN: "bg-green-500/20 text-green-400 border-green-500/30",
  POSSIBLE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-red-500/20 text-red-400 border-red-500/30",
};

const scoreLabels = {
  CLEAN: "Clean",
  POSSIBLE: "Possible",
  CONFIRMED: "Confirmed",
};

export function HistoryBadge({
  score,
  size = "md",
  showLabel = false,
}: HistoryBadgeProps) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${scoreStyles[score]}`}
      >
        <span
          className={`mr-1.5 h-2 w-2 rounded-full ${
            score === "CLEAN"
              ? "bg-green-400"
              : score === "POSSIBLE"
                ? "bg-yellow-400"
                : "bg-red-400"
          }`}
        />
        {scoreLabels[score]}
      </span>
      {showLabel && (
        <span className="text-xs text-muted">{HISTORY_SCORE_LABELS[score]}</span>
      )}
    </div>
  );
}