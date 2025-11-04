import { User } from "@prisma/client";

import { userRepository } from "../repositories/user.repository";
import { UserResponse, PaginatedUsersResponse } from "../models/user.model";

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
}

export const userService = new UserService();
