import { PlanSnapshot } from "./planGateway";
import { CustomerIdentity } from "./stackAdapters";
import { PlanActionRequest, PlanActionValue } from "./planActionContracts";

export interface SubscriptionMutationReceipt {
  accepted: boolean;
  vendorRequestId?: string;
  previousValue?: PlanActionValue;
  expectedValue?: PlanActionValue;
}

export interface SubscriptionGateway {
  read(identity: CustomerIdentity, subscriptionId?: string): Promise<PlanSnapshot>;
  skipNextOrder(identity: CustomerIdentity, request: PlanActionRequest): Promise<SubscriptionMutationReceipt>;
  changeNextOrderDate(identity: CustomerIdentity, request: PlanActionRequest): Promise<SubscriptionMutationReceipt>;
  changeCadence(identity: CustomerIdentity, request: PlanActionRequest): Promise<SubscriptionMutationReceipt>;
  changeQuantity(identity: CustomerIdentity, request: PlanActionRequest): Promise<SubscriptionMutationReceipt>;
  changeProduct(identity: CustomerIdentity, request: PlanActionRequest): Promise<SubscriptionMutationReceipt>;
  pausePlan(identity: CustomerIdentity, request: PlanActionRequest): Promise<SubscriptionMutationReceipt>;
}

export interface IdempotencyStore {
  get(key: string): Promise<string | null>;
  put(key: string, actionId: string, ttlSeconds: number): Promise<void>;
}

export interface ActionEligibilityService {
  evaluate(identity: CustomerIdentity, plan: PlanSnapshot, request: PlanActionRequest): Promise<{
    eligible: boolean;
    reasonCode?: string;
    customerMessage?: string;
  }>;
}
