import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tree } from '../../../../modules/tree/domain/entities/tree.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true, nullable: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'int', default: 3000 })
  credits!: number;

  @OneToMany(() => Tree, (tree) => tree.owner)
  trees!: Tree[];
}
