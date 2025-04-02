import { UUID } from "crypto";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { BussinesService } from "src/modules/bussines-services/entities/bussines-service.entity";
import { Appointment } from "./appointment.entity";

@Entity('appointment_service')
export class AppoitmenService {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @ManyToOne(() => BussinesService, { nullable: false, eager: true })
    service: BussinesService;

    @ManyToOne(() => Appointment, { nullable: false, onDelete: 'CASCADE' })
    appointment: Appointment;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;
}
