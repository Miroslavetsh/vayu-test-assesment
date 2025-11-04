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

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserGroupRelation(
    userId: number,
    groupId: number
  ): Promise<{ userId: number; groupId: number } | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    const relation = await prisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
      include: {
        group: true,
      },
    });

    if (!relation) return null;

    return {
      userId: relation.userId,
      groupId: relation.groupId,
    };
  }

  async removeFromGroupAndUpdateStatus(
    userId: number,
    groupId: number,
    emptyStatus: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.userGroup.delete({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      const usersCount = await tx.userGroup.count({
        where: { groupId },
      });

      if (usersCount === 0) {
        await tx.group.update({
          where: { id: groupId },
          data: { status: emptyStatus },
        });
      }
    });
  }
}

export const userRepository = new UserRepository();
