import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../../user/domain/entities/user.entity';

@Entity('trees')
export class Tree {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location!: { type: 'Point'; coordinates: [number, number] }; // [longitude, latitude]

  @Column({ type: 'int', default: 100 })
  price!: number;

  @Column({ nullable: true })
  ownerId!: string | null;

  @ManyToOne(() => User, (user) => user.trees, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner!: User | null;
}
