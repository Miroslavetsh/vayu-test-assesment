import prisma from '../config/prisma';
import { User, Group } from '@prisma/client';

export interface CreateUserData {
  name: string;
  email: string;
}

export interface UserWithGroups extends User {
  groups: Array<{
    group: Group;
  }>;
}

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByIdWithGroups(id: number): Promise<UserWithGroups | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(id: number, data: Partial<CreateUserData>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async addToGroup(userId: number, groupId: number): Promise<void> {
    await prisma.userGroup.create({
      data: {
        userId,
        groupId,
      },
    });
  }

  async removeFromGroup(userId: number, groupId: number): Promise<void> {
    await prisma.userGroup.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
  }
}

export const userRepository = new UserRepository();

