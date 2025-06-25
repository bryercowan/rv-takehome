import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Deal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  deal_id!: string;

  @Column()
  company_name!: string;

  @Column()
  contact_name!: string;

  @Column()
  transportation_mode!: string;

  @Column()
  stage!: string;

  @Column("decimal")
  value!: number;

  @Column("decimal")
  probability!: number;

  @Column()
  created_date!: string;

  @Column()
  updated_date!: string;

  @Column()
  expected_close_date!: string;

  @Column()
  sales_rep!: string;

  @Column()
  origin_city!: string;

  @Column()
  destination_city!: string;

  @Column({ nullable: true })
  cargo_type?: string;

  @Column({ default: "Unassigned" })
  territory!: string;
}
