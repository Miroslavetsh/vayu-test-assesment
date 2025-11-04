import { User } from "@prisma/client";
import prisma from "@config/prisma";

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findAllPaginated(limit: number, offset: number): Promise<User[]> {
    return prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: "asc" },
    });
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }
}

export const userRepository = new UserRepository();
