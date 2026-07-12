/** Roles assignable through the members UI. OWNER is set once at org
 * creation and is never assigned/changed/removed here — see
 * BUILD-STEPS.md #12. */
export const ASSIGNABLE_ROLES = [
  "ADMIN",
  "COACH",
  "SCOREKEEPER",
  "PARENT",
  "PLAYER",
] as const;

export const ORG_TYPE_LABELS: Record<string, string> = {
  CLUB: "Club",
  LEAGUE_OPERATOR: "League / association",
  TOURNAMENT_HOST: "Tournament host",
};

export const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  COACH: "Coach",
  SCOREKEEPER: "Scorekeeper",
  PARENT: "Parent",
  PLAYER: "Player",
};
