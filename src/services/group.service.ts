import { Group } from "@prisma/client";

import { groupRepository } from "../repositories/group.repository";
import { GroupResponse } from "../models/group.model";

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
}

export const groupService = new GroupService();
