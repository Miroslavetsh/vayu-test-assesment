import { Group } from "@prisma/client";
import prisma from "@config/prisma";

export class GroupRepository {
  async findAll(): Promise<Group[]> {
    return prisma.group.findMany();
  }

  async findAllPaginated(limit: number, offset: number): Promise<Group[]> {
    return prisma.group.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: "asc" },
    });
  }

  async count(): Promise<number> {
    return prisma.group.count();
  }
}

export const groupRepository = new GroupRepository();
