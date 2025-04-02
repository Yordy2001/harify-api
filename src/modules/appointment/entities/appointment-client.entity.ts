import { UUID } from "crypto";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Appointment } from "./appointment.entity";
import { Client } from "src/modules/clients/entities/client.entity";


@Entity()
export class AppointmentClient {
    
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;

    @ManyToOne(()=> Appointment, {nullable: false, onDelete: 'CASCADE'})
    appoitment_id: Appointment;

    @ManyToOne(()=> Client, {nullable: false})
    client_id: Client;
}
