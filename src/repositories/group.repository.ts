import { Group } from "@prisma/client";
import prisma from "../config/prisma";

export class GroupRepository {
  async findAll(): Promise<Group[]> {
    return prisma.group.findMany();
  }
}

export const groupRepository = new GroupRepository();
