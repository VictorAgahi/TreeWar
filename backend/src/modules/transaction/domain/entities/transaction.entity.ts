import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../user/domain/entities/user.entity';

export enum TransactionAction {
  BUY = 'BUY',
  RECHARGE = 'RECHARGE',
}

export enum TransactionItemType {
  TREE = 'TREE',
  CREDITS = 'CREDITS',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: TransactionAction,
    default: TransactionAction.BUY,
  })
  action!: TransactionAction;

  @Column({
    type: 'enum',
    enum: TransactionItemType,
  })
  itemType!: TransactionItemType;

  @Column({ type: 'uuid' })
  itemId!: string;

  @Column({ type: 'varchar', length: 100 })
  itemName!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'float', nullable: true })
  lat!: number | null;

  @Column({ type: 'float', nullable: true })
  lng!: number | null;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
