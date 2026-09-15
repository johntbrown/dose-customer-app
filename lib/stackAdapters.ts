import { PlanSnapshot } from "./planGateway";

export interface CustomerIdentity {
  doseCustomerId: string;
  shopifyCustomerId?: string;
  skioCustomerId?: string;
  klaviyoProfileId?: string;
}

export interface PlanAdapter {
  read(identity: CustomerIdentity): Promise<PlanSnapshot>;
  refresh(identity: CustomerIdentity): Promise<PlanSnapshot>;
}

export interface EventAdapter {
  track(eventName: string, properties: Record<string, string | number | boolean>): Promise<void>;
}

export const mockEventAdapter: EventAdapter = {
  async track(eventName, properties) {
    console.info("[RudderStack mock]", eventName, properties);
  }
};
