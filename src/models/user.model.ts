import { Group } from "@prisma/client";

interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date | null;
  groups?: Group[];
}

export interface PaginatedUsersResponse {
  data: UserResponse[];
  pagination: Pagination;
}
