import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Assignment {
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

