import { CustomerIdentity, EventAdapter } from "./stackAdapters";
import { PlanSnapshot } from "./planGateway";
import {
  buildIdempotencyKey,
  PlanActionFailure,
  PlanActionRequest,
  PlanActionResult,
  PlanActionSuccess
} from "./planActionContracts";
import {
  ActionEligibilityService,
  IdempotencyStore,
  SubscriptionGateway,
  SubscriptionMutationReceipt
} from "./subscriptionGateway";

function correlationId(actionId: string) {
  return `corr_${actionId}`;
}

function failure(
  request: PlanActionRequest,
  code: PlanActionFailure["errorCode"],
  stage: PlanActionFailure["failureStage"],
  message: string,
  retryable = false
): PlanActionFailure {
  return {
    ok: false,
    actionId: request.actionId,
    correlationId: correlationId(request.actionId),
    actionType: request.actionType,
    errorCode: code,
    retryable,
    failureStage: stage,
    customerMessage: message
  };
}

function planFingerprint(plan: PlanSnapshot) {
  return [
    plan.planId,
    plan.status,
    plan.quantity,
    plan.cadenceDays,
    plan.nextOrderDate,
    plan.nextShipmentDate
  ].join("|");
}

async function executeGatewayMutation(
  gateway: SubscriptionGateway,
  identity: CustomerIdentity,
  request: PlanActionRequest
): Promise<SubscriptionMutationReceipt> {
  switch (request.actionType) {
    case "skip_next_order":
      return gateway.skipNextOrder(identity, request);
    case "change_next_order_date":
      return gateway.changeNextOrderDate(identity, request);
    case "change_cadence":
      return gateway.changeCadence(identity, request);
    case "change_quantity":
      return gateway.changeQuantity(identity, request);
    case "change_product":
      return gateway.changeProduct(identity, request);
    case "pause_plan":
      return gateway.pausePlan(identity, request);
  }
}

export interface PlanActionDependencies {
  gateway: SubscriptionGateway;
  eligibility: ActionEligibilityService;
  idempotency: IdempotencyStore;
  events: EventAdapter;
}

export async function executePlanAction(
  identity: CustomerIdentity,
  request: PlanActionRequest,
  deps: PlanActionDependencies
): Promise<PlanActionResult<PlanSnapshot>> {
  if (!identity.doseCustomerId || identity.doseCustomerId !== request.doseCustomerId) {
    return failure(request, "IDENTITY_NOT_RESOLVED", "identity", "We could not safely match this plan to your account.");
  }

  const key = buildIdempotencyKey(request);
  const existing = await deps.idempotency.get(key);
  if (existing) {
    const refreshed = await deps.gateway.read(identity, request.subscriptionId);
    return {
      ok: true,
      actionId: request.actionId,
      correlationId: correlationId(request.actionId),
      actionType: request.actionType,
      previousValue: null,
      newValue: request.requestedValue,
      verificationStatus: "verified",
      plan: refreshed
    };
  }

  const currentPlan = await deps.gateway.read(identity, request.subscriptionId);

  if (
    request.renderedPlanFingerprint &&
    request.renderedPlanFingerprint !== planFingerprint(currentPlan)
  ) {
    return failure(
      request,
      "STALE_PLAN_STATE",
      "validation",
      "Your plan changed since this page loaded. Refreshing it is the safest next step."
    );
  }

  const eligibility = await deps.eligibility.evaluate(identity, currentPlan, request);
  if (!eligibility.eligible) {
    return failure(
      request,
      "ACTION_NOT_ELIGIBLE",
      "eligibility",
      eligibility.customerMessage ?? "This plan change is not available right now."
    );
  }

  await deps.events.track("app_plan_action_started", {
    action_id: request.actionId,
    dose_customer_id: request.doseCustomerId,
    subscription_id: request.subscriptionId,
    action_type: request.actionType,
    source_surface: request.sourceSurface
  });

  let receipt: SubscriptionMutationReceipt;
  try {
    receipt = await executeGatewayMutation(deps.gateway, identity, request);
  } catch {
    return failure(
      request,
      "VENDOR_TEMPORARILY_UNAVAILABLE",
      "submission",
      "We could not confirm that change yet. Your current plan has not been shown as updated.",
      true
    );
  }

  if (!receipt.accepted) {
    return failure(
      request,
      "VENDOR_REJECTED_ACTION",
      "submission",
      "That change could not be completed with the current plan settings."
    );
  }

  const refreshedPlan = await deps.gateway.read(identity, request.subscriptionId);

  await deps.idempotency.put(key, request.actionId, 86400);

  const success: PlanActionSuccess<PlanSnapshot> = {
    ok: true,
    actionId: request.actionId,
    correlationId: correlationId(request.actionId),
    actionType: request.actionType,
    previousValue: receipt.previousValue ?? null,
    newValue: receipt.expectedValue ?? request.requestedValue,
    verificationStatus: "verified",
    plan: refreshedPlan
  };

  await deps.events.track("app_plan_action_completed", {
    action_id: request.actionId,
    dose_customer_id: request.doseCustomerId,
    subscription_id: request.subscriptionId,
    action_type: request.actionType,
    verification_status: success.verificationStatus
  });

  return success;
}
