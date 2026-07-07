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
    return this.repository.find({ relations: { owner: true } });
  }

  async findById(id: string): Promise<Tree | null> {
    return this.repository.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  async save(tree: Partial<Tree>): Promise<Tree> {
    const newTree = this.repository.create(tree);
    return this.repository.save(newTree);
  }
}
