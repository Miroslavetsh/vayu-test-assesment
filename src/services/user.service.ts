import { User, UserStatus } from "@prisma/client";

import { userRepository } from "@repositories/user.repository";
import {
  UserResponse,
  PaginatedUsersResponse,
  UserStatusUpdate,
} from "@models/user.model";
import { GROUP_STATUSES } from "@lib/constants";

export class UserService {
  private mapUserToResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  async getAll(): Promise<UserResponse[]> {
    const users = await userRepository.findAll();
    return users.map(this.mapUserToResponse);
  }

  async getAllPaginated(
    limit: number,
    offset: number
  ): Promise<PaginatedUsersResponse> {
    const [users, total] = await Promise.all([
      userRepository.findAllPaginated(limit, offset),
      userRepository.count(),
    ]);

    return {
      data: users.map(this.mapUserToResponse),
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }

  async removeFromGroup(userId: number, groupId: number): Promise<void> {
    const relation = await userRepository.findUserGroupRelation(
      userId,
      groupId
    );
    if (!relation) throw new Error("User is not a member of this group");

    await userRepository.removeFromGroupAndUpdateStatus(
      userId,
      groupId,
      GROUP_STATUSES.EMPTY
    );
  }

  async updateStatuses(updates: UserStatusUpdate[]): Promise<{
    updated: number;
    failed: number;
    errors: string[];
  }> {
    const userIds = updates.map((u) => u.userId);
    const existingUsers = await userRepository.findByIds(userIds);
    const existingUserIds = new Set(existingUsers.map((u) => u.id));
    const missingUserIds = userIds.filter((id) => !existingUserIds.has(id));

    if (missingUserIds.length > 0) {
      throw new Error(`Users not found: ${missingUserIds.join(", ")}`);
    }

    const statusUpdates = updates.map(({ userId, status }) => ({
      userId,
      status,
    }));

    const result = await userRepository.batchUpdateStatuses(statusUpdates);

    return {
      updated: result.updated,
      failed: result.failed,
      errors:
        result.failed > 0 ? [`Failed to update ${result.failed} user(s)`] : [],
    };
  }
}

export const userService = new UserService();
