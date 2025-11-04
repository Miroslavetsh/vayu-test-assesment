import { z } from "zod";
import { UserStatus } from "@prisma/client";
import { MAX_BATCH_UPDATE_SIZE } from "@lib/constants";

export const userStatusUpdateSchema = z.object({
  userId: z.number().int().positive(),
  status: z.nativeEnum(UserStatus),
});

export const batchStatusUpdateSchema = z.object({
  updates: z
    .array(userStatusUpdateSchema)
    .min(1, "At least one user update is required")
    .max(
      MAX_BATCH_UPDATE_SIZE,
      `Maximum ${MAX_BATCH_UPDATE_SIZE} users can be updated at once`
    )
    .refine(
      (updates) => {
        const userIds = updates.map((u) => u.userId);
        return new Set(userIds).size === userIds.length;
      },
      {
        message: "Duplicate user IDs found in the update request",
      }
    ),
});
