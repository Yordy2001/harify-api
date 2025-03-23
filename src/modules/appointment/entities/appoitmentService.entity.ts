import { UUID } from "crypto";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { AppointmentClient } from "./appointment-client.entity";
import { BussinesService } from "src/modules/bussines-services/entities/bussines-service.entity";

@Entity()
export class AppoitmenService {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @ManyToOne(() => BussinesService, { nullable: false })
    bussines_service_id: BussinesService;

    @ManyToOne(() => AppointmentClient, { nullable: false })
    appoitment_client_id: AppointmentClient;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;
}