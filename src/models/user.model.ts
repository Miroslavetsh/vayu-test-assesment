import { Group, UserStatus } from "@prisma/client";
import { PaginationResponse } from "@models/pagination.model";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  createdAt: Date | null;
  groups?: Group[];
}

export interface UserStatusUpdate {
  userId: number;
  status: UserStatus;
}

export interface BatchStatusUpdateRequest {
  updates: UserStatusUpdate[];
}

export interface PaginatedUsersResponse {
  data: UserResponse[];
  pagination: PaginationResponse;
}
