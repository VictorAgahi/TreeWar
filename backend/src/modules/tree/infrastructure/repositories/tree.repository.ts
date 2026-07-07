import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tree } from '../../domain/entities/tree.entity';

@Injectable()
export class TreeRepository {
  constructor(
    @InjectRepository(Tree)
    private readonly repository: Repository<Tree>,
  ) {}

  async findAll(): Promise<Tree[]> {
    return this.repository.find({
      relations: { owner: true },
      select: { owner: { id: true, username: true } },
    });
  }

  async findById(id: string): Promise<Tree | null> {
    return this.repository.findOne({
      where: { id },
      relations: { owner: true },
      select: { owner: { id: true, username: true } },
    });
  }

  async save(tree: Partial<Tree>): Promise<Tree> {
    const newTree = this.repository.create(tree);
    return this.repository.save(newTree);
  }

  async findByOwnerId(ownerId: string): Promise<Tree[]> {
    return this.repository.find({
      where: { ownerId },
      relations: { owner: true },
      select: { owner: { id: true, username: true } },
    });
  }
}
