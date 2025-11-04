import { Group } from "@prisma/client";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date | null;
  groups?: Group[];
}
