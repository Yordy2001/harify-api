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

  @Column()
  email: string;

  @Column()
  password: string;

  @Column('text', { array: true, default: ['user'] })
  role: string[];

  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant
  // @ManyToMany(() => Tenant, (tenant) => tenant.users)
  // @JoinColumn({ name: 'tenant_id' })
  // tenant: Tenant;

  // @Column()
  // tenant_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
