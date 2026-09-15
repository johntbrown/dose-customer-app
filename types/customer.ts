export type RelationshipState =
  | "lead"
  | "one_time_purchaser"
  | "active_subscriber"
  | "paused_subscriber"
  | "former_subscriber";

export type AdherenceState =
  | "new"
  | "automatic"
  | "mostly_consistent"
  | "fragile"
  | "at_risk";

export type ProgressConfidence =
  | "unknown"
  | "optimistic"
  | "seeing_progress"
  | "unsure"
  | "disappointed";

export interface CustomerProfile {
  id: string;
  firstName: string;
  email: string;
  relationshipState: RelationshipState;
  product: string;
  lifecycleDay: number;
  adherenceState: AdherenceState;
  progressConfidence: ProgressConfidence;
  currentStreak: number;
  weeklyConsistency: number;
  nextChargeDate: string;
  nextShipmentDate: string;
  rewardStatus: string;
}
