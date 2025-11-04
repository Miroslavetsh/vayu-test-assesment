import prisma from '../config/prisma';
import { Group, User } from '@prisma/client';

export interface CreateGroupData {
  name: string;
  status: string;
}

export interface GroupWithUsers extends Group {
  users: Array<{
    user: User;
  }>;
}

export class GroupRepository {
  async findAll(): Promise<Group[]> {
    return prisma.group.findMany();
  }

  async findById(id: number): Promise<Group | null> {
    return prisma.group.findUnique({
      where: { id },
    });
  }

  async findByIdWithUsers(id: number): Promise<GroupWithUsers | null> {
    return prisma.group.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async create(data: CreateGroupData): Promise<Group> {
    return prisma.group.create({
      data,
    });
  }

  async update(id: number, data: Partial<CreateGroupData>): Promise<Group> {
    return prisma.group.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Group> {
    return prisma.group.delete({
      where: { id },
    });
  }

  async findByStatus(status: string): Promise<Group[]> {
    return prisma.group.findMany({
      where: { status },
    });
  }
}

export const groupRepository = new GroupRepository();

