import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TreeRepository } from '../infrastructure/repositories/tree.repository';
import { CreateTreeDto } from '../presentation/dtos/create-tree.dto';
import { User } from '../../user/domain/entities/user.entity';
import { Tree } from '../domain/entities/tree.entity';

@Injectable()
export class TreeService {
  constructor(
    private readonly treeRepository: TreeRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return this.treeRepository.findAll();
  }

  async getTreeById(id: string) {
    const tree = await this.treeRepository.findById(id);
    if (!tree) {
      throw new NotFoundException('Arbre non trouvé.');
    }
    return tree;
  }

  async createTree(dto: CreateTreeDto) {
    return this.treeRepository.save({
      name: dto.name,
      location: {
        type: 'Point',
        coordinates: [dto.lng, dto.lat],
      },
      price: dto.price ?? 100,
    });
  }

  async buyTree(
    treeId: string,
    userId: string,
    amount: number,
    lat: number,
    lng: number,
    newName?: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé.');
      }

      if (user.credits < amount) {
        throw new BadRequestException('Fonds insuffisants.');
      }

      let tree = await queryRunner.manager.findOne(Tree, {
        where: { id: treeId },
        lock: { mode: 'pessimistic_write' },
      });

      if (tree) {
        if (amount <= tree.price) {
          throw new BadRequestException(
            'Le montant doit être strictement supérieur au prix actuel.',
          );
        }

        if (tree.ownerId === userId) {
          throw new BadRequestException('Vous possédez déjà cet arbre.');
        }

        tree.ownerId = user.id;
        tree.price = amount;
        if (newName) {
          tree.name = newName;
        }
      } else {
        tree = queryRunner.manager.create(Tree, {
          id: treeId,
          name: newName || 'Nouvel Arbre',
          location: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          price: amount,
          ownerId: user.id,
        });
      }

      user.credits -= amount;

      await queryRunner.manager.save(user);
      const updatedTree = await queryRunner.manager.save(tree);

      await queryRunner.commitTransaction();
      return updatedTree;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
