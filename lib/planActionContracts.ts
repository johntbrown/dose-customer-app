export type PlanActionType =
  | "skip_next_order"
  | "change_next_order_date"
  | "change_cadence"
  | "change_quantity"
  | "change_product"
  | "pause_plan";

export type PlanActionErrorCode =
  | "UNAUTHENTICATED"
  | "IDENTITY_NOT_RESOLVED"
  | "PLAN_NOT_FOUND"
  | "PLAN_NOT_OWNED_BY_CUSTOMER"
  | "ACTION_NOT_SUPPORTED"
  | "ACTION_NOT_ELIGIBLE"
  | "STALE_PLAN_STATE"
  | "INVALID_REQUEST"
  | "FULFILLMENT_CUTOFF_REACHED"
  | "VENDOR_TEMPORARILY_UNAVAILABLE"
  | "VENDOR_REJECTED_ACTION"
  | "VERIFICATION_FAILED"
  | "EVENT_TRACKING_FAILED"
  | "UNKNOWN_ERROR";

export type PlanActionValue = string | number | boolean | null;

export interface PlanActionRequest {
  actionId: string;
  doseCustomerId: string;
  subscriptionId: string;
  actionType: PlanActionType;
  requestedValue: PlanActionValue;
  clientActionId: string;
  sourceSurface: "my_plan" | "cancel_flow" | "support_handoff";
  renderedPlanFingerprint?: string;
  reason?: string;
}

export interface PlanActionSuccess<TPlan> {
  ok: true;
  actionId: string;
  correlationId: string;
  actionType: PlanActionType;
  previousValue: PlanActionValue;
  newValue: PlanActionValue;
  verificationStatus: "verified";
  plan: TPlan;
}

export interface PlanActionFailure {
  ok: false;
  actionId: string;
  correlationId: string;
  actionType: PlanActionType;
  errorCode: PlanActionErrorCode;
  retryable: boolean;
  failureStage:
    | "authentication"
    | "identity"
    | "validation"
    | "eligibility"
    | "submission"
    | "verification"
    | "analytics";
  customerMessage: string;
}

export type PlanActionResult<TPlan> = PlanActionSuccess<TPlan> | PlanActionFailure;

export interface ActionEligibility {
  eligible: boolean;
  reasonCode?: string;
  customerMessage?: string;
}

export function buildIdempotencyKey(input: PlanActionRequest): string {
  return [
    input.doseCustomerId,
    input.subscriptionId,
    input.actionType,
    String(input.requestedValue),
    input.clientActionId
  ].join(":");
}
