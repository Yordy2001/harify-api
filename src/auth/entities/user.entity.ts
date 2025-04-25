import { Tenant } from 'src/tenant/entities/tenant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column({nullable: false})
  password: string;

  @Column({ nullable: false})
  name: string;

  @Column('text', { array: true, default: ['user'] })
  role: string[];

  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
