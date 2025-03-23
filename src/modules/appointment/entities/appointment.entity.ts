import { UUID } from "crypto";
import { User } from "src/auth/entities/user.entity";
import { Tenant } from "src/tenant/entities/tenant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { APPOITMENT_STATUS } from "../enums/appoitment-status.enum";


@Entity()
export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column('timestamp')
    start_time: Timestamp;

    @Column('timestamp')
    end_time: Timestamp;

    @Column({ type: 'varchar', enum: APPOITMENT_STATUS, default: APPOITMENT_STATUS.PENDING })
    status: string;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;

    @ManyToOne(() => Tenant, { nullable: false })
    tenant_id: Tenant;
    
    @ManyToOne(() => User, { nullable: false })
    user_id: User;
}
