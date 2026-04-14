
import { Recommendation } from "../types";
import { RECOMMENDATIONS } from "../constants";

export function getRecommendation(type: string): Recommendation {
  return RECOMMENDATIONS[type as any] || RECOMMENDATIONS["Otro"];
}

export function isFollowUpUrgent(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  // Urgent if date is today or in the past
  return date <= now;
}
