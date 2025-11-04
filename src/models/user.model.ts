import { Group } from "@prisma/client";
import { PaginationResponse } from "./pagination.model";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date | null;
  groups?: Group[];
}

export interface PaginatedUsersResponse {
  data: UserResponse[];
  pagination: PaginationResponse;
}
