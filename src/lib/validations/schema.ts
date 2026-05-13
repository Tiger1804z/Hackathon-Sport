import {z} from "zod";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const LevelSchema = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

// ─── PlayerProfile ────────────────────────────────────────────────────────────

export const upsertPlayerProfileSchema = z.object({
    fullName: z.string().min(2).max(100),
    city: z.string().min(2).max(100),
    favoriteSport: z.string().min(2).max(50),
    level: LevelSchema,
    position: z.string().max(50).optional(),
});

// ─── Tournament ───────────────────────────────────────────────────────────────

export const createTournamentSchema = z.object({
    name: z.string().min(2).max(100),
    sport: z.string().min(2).max(50),
    city: z.string().min(2).max(100),
    startDate: z.coerce.date().min(new Date()),
    entryFee: z.number().int().min(0),
    currency: z.string().length(3).default("CAD"),
});

export const updateTournamentSchema = createTournamentSchema.partial().extend({id: z.string().cuid()});

// ─── Team ─────────────────────────────────────────────────────────────────────

export const createTeamSchema = z.object({
  name: z.string().min(2).max(100),
  tournamentId: z.string().cuid(),
  maxCapacity: z.number().int().min(2).max(50).default(15),
});

export const updateTeamSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2).max(100).optional(),
  maxCapacity: z.number().int().min(2).max(50).optional(),
});

// ─── JoinRequest ──────────────────────────────────────────────────────────────

export const createJoinRequestSchema = z.object({
  teamId: z.string().cuid(),
  message: z.string().max(500).optional(),
});

export const joinRequestIdSchema = z.object({
  id: z.string().cuid(),
});


// ─── Match ────────────────────────────────────────────────────────────────────

export const createMatchSchema = z.object({
  teamAId: z.string().cuid(),
  teamBId: z.string().cuid(),
  date: z.coerce.date(),
  location: z.string().min(2).max(200),
}).refine((data) => data.teamAId !== data.teamBId, {
  message: "Team A and Team B must be different",
});

export const updateMatchScoreSchema = z.object({
  id: z.string().cuid(),
  scoreA: z.number().int().min(0),
  scoreB: z.number().int().min(0),
});

// ─── Types inférés ────────────────────────────────────────────────────────────

export type UpdatePlayerProfileInput = z.infer<typeof upsertPlayerProfileSchema>;
export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type CreateJoinRequestInput = z.infer<typeof createJoinRequestSchema>;
export type JoinRequestIdInput = z.infer<typeof joinRequestIdSchema>;
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchScoreInput = z.infer<typeof updateMatchScoreSchema>;