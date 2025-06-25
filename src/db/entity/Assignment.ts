import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn() id!: number;
  @Column() dealId!: string;
  @Column() oldRep!: string;
  @Column() newRep!: string;
  @CreateDateColumn() changedAt!: Date;
}
