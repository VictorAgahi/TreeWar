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

  async getTopUsersByMostExpensiveTree(
    limit: number,
  ): Promise<
    { id: string; username: string; maxTreePrice: number; maxTreeId: string }[]
  > {
    return this.repository.query(
      `
      WITH RankedTrees AS (
        SELECT "ownerId", price, id,
               ROW_NUMBER() OVER(PARTITION BY "ownerId" ORDER BY price DESC) as rn
        FROM trees
        WHERE "ownerId" IS NOT NULL
      )
      SELECT u.id as "id", u.username as "username", COALESCE(r.price, 0)::int as "maxTreePrice", r.id as "maxTreeId"
      FROM users u
      LEFT JOIN RankedTrees r ON r."ownerId" = u.id AND r.rn = 1
      ORDER BY "maxTreePrice" DESC NULLS LAST
      LIMIT $1
    `,
      [limit],
    );
  }
}
