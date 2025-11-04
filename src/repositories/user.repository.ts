import { User, UserStatus } from "@prisma/client";
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

  async batchUpdateStatuses(
    updates: Array<{ userId: number; status: UserStatus }>
  ): Promise<{ updated: number; failed: number }> {
    let updated = 0;
    let failed = 0;

    const CHUNK_SIZE = 100;

    for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
      const chunk = updates.slice(i, i + CHUNK_SIZE);

      try {
        await prisma.$transaction(
          async (tx) => {
            const updatePromises = chunk.map(async ({ userId, status }) => {
              try {
                const result = await tx.user.updateMany({
                  where: { id: userId },
                  data: { status },
                });
                return { success: result.count > 0 };
              } catch {
                return { success: false };
              }
            });

            const results = await Promise.all(updatePromises);
            results.forEach((result) => {
              if (result.success) {
                updated++;
              } else {
                failed++;
              }
            });
          },
          {
            timeout: 30000,
            maxWait: 10000,
          }
        );
      } catch (error) {
        failed += chunk.length;
      }
    }

    return { updated, failed };
  }

  async findByIds(ids: number[]): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}

export const userRepository = new UserRepository();
