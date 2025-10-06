import { Entity, PrimaryGeneratedColumn, Column, Unique, Check, ManyToOne, JoinColumn } from 'typeorm';

import { Specialty } from '../specialty/Specialty';

@Entity('doctor')
@Check(`"Doctor_office" BETWEEN 1 AND 999`)
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Specialty_id: number;

  @Column({ length: 40, unique: true })
  Doctor_fullname: string;

  @Column({ length: 10, nullable: true, unique: true })
  Doctor_number: string;

  @Column()
  Doctor_office: number;

  @Column({ length: 100, nullable: true })
  Doctor_workschedule: string;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'Specialty_id' })
  specialty: Specialty;
}
