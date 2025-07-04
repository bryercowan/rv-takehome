import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Territory {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column("simple-array") states!: string[];
}


