/*
  Production integration seams for My Dose.
  This file intentionally contains no credentials and performs no vendor calls.
  Server-side implementations can replace these adapters without changing UI contracts.
*/

export const adapterContractVersion = 'member-data-v1';

export const memberDataAdapter = {
  async getIdentity() {
    throw new Error('Production identity adapter not configured');
  },
  async getSubscription() {
    throw new Error('Production subscription adapter not configured');
  },
  async getOrders() {
    throw new Error('Production order adapter not configured');
  },
  async getRoutineState() {
    throw new Error('Production routine adapter not configured');
  },
  async persistRoutineAction() {
    throw new Error('Production routine mutation adapter not configured');
  },
};

export function normalizeProductionMember({ identity, subscription, order, routine, lifecycle, education, loyalty, support, recommendation }) {
  return {
    identity,
    product: subscription?.product || {},
    subscription: subscription?.state || subscription || {},
    order: order || {},
    routine: routine || {},
    lifecycle: lifecycle || {},
    education: education || {},
    loyalty: loyalty || {},
    support: support || {},
    recommendation: recommendation || {},
    check_in: { due: false, type: null },
    contract_version: adapterContractVersion,
  };
}

export const productionFoundation = {
  identity: 'passwordless auth -> canonical dose_customer_id',
  commerce: 'Shopify read adapter',
  subscription: 'Skio read/mutation adapter',
  events: 'RudderStack -> Mixpanel/Klaviyo/warehouse',
  routine: 'server-persisted routine state with optimistic UI + authoritative reread',
};
