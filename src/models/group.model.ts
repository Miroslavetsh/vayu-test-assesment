import { User } from "@prisma/client";
import { PaginationResponse } from "@models/pagination.model";

export interface GroupResponse {
  id: number;
  name: string;
  status: string;
  createdAt: Date | null;
  users?: User[];
}

export interface PaginatedGroupsResponse {
  data: GroupResponse[];
  pagination: PaginationResponse;
}
