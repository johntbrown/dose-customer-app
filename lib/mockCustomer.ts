import { CustomerProfile } from "../types/customer";

export const mockCustomer: CustomerProfile = {
  id: "cust_demo_001",
  firstName: "John",
  email: "demo@example.com",
  relationshipState: "active_subscriber",
  product: "Dose for Your Liver",
  lifecycleDay: 18,
  adherenceState: "mostly_consistent",
  progressConfidence: "optimistic",
  currentStreak: 12,
  weeklyConsistency: 86,
  nextChargeDate: "September 28",
  nextShipmentDate: "September 29",
  rewardStatus: "Travel Case unlocked at Order 3"
};

export function getNextBestAction(customer: CustomerProfile) {
  if (customer.relationshipState === "paused_subscriber") {
    return {
      title: "Plan your restart",
      body: "Check what you have left and choose the best date to resume."
    };
  }

  if (customer.adherenceState === "fragile" || customer.adherenceState === "at_risk") {
    return {
      title: "Make today easy",
      body: "Missing a day does not erase your progress. Pick your routine back up today."
    };
  }

  if (customer.lifecycleDay >= 18 && customer.lifecycleDay <= 24) {
    return {
      title: "Your next order is coming up",
      body: "Check your inventory and make sure your shipment timing still fits your routine."
    };
  }

  return {
    title: "Keep your routine going",
    body: "Stay consistent and complete your next progress check when it becomes available."
  };
}
