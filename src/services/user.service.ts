import { User } from "@prisma/client";

import { userRepository } from "../repositories/user.repository";
import { UserResponse } from "../models/user.model";

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
}

export const userService = new UserService();
