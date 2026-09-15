export interface PlanSnapshot {
  customerId: string;
  planId: string;
  productName: string;
  status: "active" | "paused" | "prepaid";
  quantity: number;
  cadenceDays: number;
  nextOrderDate: string;
  nextShipmentDate: string;
}

export async function loadPlan(customerId: string): Promise<PlanSnapshot> {
  return {
    customerId,
    planId: "plan_demo_001",
    productName: "Dose for Your Liver",
    status: "active",
    quantity: 3,
    cadenceDays: 24,
    nextOrderDate: "September 28",
    nextShipmentDate: "September 29"
  };
}
