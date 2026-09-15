import { loadPlan, PlanSnapshot } from "./planGateway";
import { CustomerIdentity, mockEventAdapter } from "./stackAdapters";

export type PlanIntent = "review_timing" | "review_inventory" | "review_quantity" | "review_product" | "support_help";

export async function getPlanExperience(identity: CustomerIdentity): Promise<PlanSnapshot> {
  const plan = await loadPlan(identity.doseCustomerId);
  await mockEventAdapter.track("app_plan_viewed", {
    dose_customer_id: identity.doseCustomerId,
    plan_id: plan.planId,
    status: plan.status
  });
  return plan;
}

export async function recordPlanIntent(identity: CustomerIdentity, plan: PlanSnapshot, intent: PlanIntent) {
  await mockEventAdapter.track("app_plan_intent_selected", {
    dose_customer_id: identity.doseCustomerId,
    plan_id: plan.planId,
    intent
  });
}
