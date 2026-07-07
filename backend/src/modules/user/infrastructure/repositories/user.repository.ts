import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  async save(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async getTopUsersByTreeCount(limit: number) {
    return this.repository
      .createQueryBuilder('user')
      .leftJoin('user.trees', 'tree')
      .select([
        'user.id AS id',
        'user.username AS username',
        'COUNT(tree.id)::int AS "treeCount"',
      ])
      .groupBy('user.id')
      .orderBy('"treeCount"', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getTopUsersByTotalTreeValue(limit: number) {
    return this.repository
      .createQueryBuilder('user')
      .leftJoin('user.trees', 'tree')
      .select([
        'user.id AS id',
        'user.username AS username',
        'COALESCE(SUM(tree.price), 0)::int AS "totalValue"',
      ])
      .groupBy('user.id')
      .orderBy('"totalValue"', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getTopUsersByMostExpensiveTree(limit: number) {
    return this.repository
      .createQueryBuilder('user')
      .leftJoin('user.trees', 'tree')
      .select([
        'user.id AS id',
        'user.username AS username',
        'COALESCE(MAX(tree.price), 0)::int AS "maxTreePrice"',
      ])
      .groupBy('user.id')
      .orderBy('"maxTreePrice"', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
