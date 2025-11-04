import { User } from "@prisma/client";

import { userRepository } from "@repositories/user.repository";
import { UserResponse, PaginatedUsersResponse } from "@models/user.model";
import { GROUP_STATUSES } from "@lib/constants";

export class UserService {
  private mapUserToResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
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
}

export const userService = new UserService();
