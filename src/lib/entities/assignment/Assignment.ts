import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";

@Entity()
export class Assignment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "deal_id" })
  dealId!: string;

  @Column()
  oldRep!: string;

  @Column()
  newRep!: string;

  @CreateDateColumn({ name: "changed_at" })
  changedAt!: Date;
}

