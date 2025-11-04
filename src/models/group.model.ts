import { User } from "@prisma/client";

export interface GroupResponse {
  id: number;
  name: string;
  status: string;
  createdAt: Date | null;
  users?: User[];
}
