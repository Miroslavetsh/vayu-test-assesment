import { User } from "@prisma/client";
import prisma from "../config/prisma";

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }
}

export const userRepository = new UserRepository();
