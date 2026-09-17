/*
  Production integration seams for My Dose.
  No credentials, tokens, or vendor SDKs belong in this client-side prototype.
  Server implementations should satisfy these contracts without changing UI behavior.
*/

import { runWithPolicy } from './asyncContract';

export const adapterContractVersion = 'member-data-v2';

const notConfigured = name => async () => {
  throw new Error(`${name} adapter not configured`);
};

export const memberDataAdapter = {
  getIdentity: notConfigured('Production identity'),
  getSubscription: notConfigured('Production subscription'),
  getOrders: notConfigured('Production order'),
  getRoutineState: notConfigured('Production routine'),
  getEducationState: notConfigured('Production education'),
  getLoyaltyState: notConfigured('Production loyalty'),
  persistRoutineAction: notConfigured('Production routine mutation'),
  updateSubscription: notConfigured('Production subscription mutation'),
  updatePaymentMethod: notConfigured('Production payment'),
};

export async function readMemberResource(reader, {
  lastKnownGood,
  resource,
  retries = 1,
  timeoutMs = 8000,
} = {}) {
  return runWithPolicy(reader, {
    retries,
    timeoutMs,
    fallbackData: lastKnownGood,
    metadata: { resource, contract_version: adapterContractVersion },
  });
}

export async function runAuthoritativeMutation(writer, payload, {
  resource,
  timeoutMs = 10000,
} = {}) {
  const result = await runWithPolicy(() => writer(payload), {
    retries: 0,
    timeoutMs,
    metadata: { resource, mutation: true, contract_version: adapterContractVersion },
  });

  // Production UI must only render a mutation as committed when the source of
  // truth has confirmed it. Optimistic UI may be used visually, but a failed
  // response must roll back and preserve the prior authoritative state.
  return result;
}

export function normalizeProductionMember({ identity, subscription, order, routine, lifecycle, education, loyalty, support, recommendation, check_in }) {
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
    check_in: check_in || { due: false, type: null },
    contract_version: adapterContractVersion,
  };
}

export const productionFoundation = {
  identity: 'passwordless auth -> canonical dose_customer_id',
  commerce: 'Shopify read adapter',
  subscription: 'Skio read/mutation adapter',
  events: 'RudderStack -> Mixpanel/Klaviyo/warehouse',
  routine: 'server-persisted routine state with optimistic UI + authoritative reread',
  loading: 'skeletons preserve layout and prevent content jumps',
  stale: 'last-known-good data remains visible with an explicit freshness label',
  errors: 'recover in place with retry; never imply a failed mutation succeeded',
  offline: 'browse cached state; queue no financial/subscription mutations without explicit server confirmation',
};
