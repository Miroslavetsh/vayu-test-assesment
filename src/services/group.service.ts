import { Group } from "@prisma/client";

import { groupRepository } from "@repositories/group.repository";
import { GroupResponse, PaginatedGroupsResponse } from "@models/group.model";

export class GroupService {
  private mapGroupToResponse(group: Group): GroupResponse {
    return {
      id: group.id,
      name: group.name,
      status: group.status,
      createdAt: group.createdAt,
    };
  }

  async getAll(): Promise<GroupResponse[]> {
    const groups = await groupRepository.findAll();
    return groups.map(this.mapGroupToResponse);
  }

  async getAllPaginated(
    limit: number,
    offset: number
  ): Promise<PaginatedGroupsResponse> {
    const [groups, total] = await Promise.all([
      groupRepository.findAllPaginated(limit, offset),
      groupRepository.count(),
    ]);

    return {
      data: groups.map(this.mapGroupToResponse),
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }
}

export const groupService = new GroupService();
