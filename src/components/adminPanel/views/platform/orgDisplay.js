// The platform tenant (organization 1) is stored in the database under its
// pre-rebrand name — "Oryon Labs", slug "oryon-labs". The slug is also an
// identifier the public intake (chatbot / n8n `organization_slug`) relies on,
// so it must not be renamed from here; this only changes what the admin panel
// shows. Drop it once the row itself has been renamed server-side.

export const PLATFORM_ORG_ID = 1;
export const PLATFORM_ORG_NAME = 'OryonX';

export const isPlatformOrg = (org) =>
  !!org && (org.is_platform === true || Number(org.id) === PLATFORM_ORG_ID);

/** Returns the organization as it should be displayed: brand name, no legacy slug. */
export const normalizeOrganization = (org) =>
  isPlatformOrg(org) ? { ...org, name: PLATFORM_ORG_NAME, slug: null } : org;
