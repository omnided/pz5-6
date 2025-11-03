import { Entity, PrimaryGeneratedColumn, Column, Unique, Check, ManyToOne, JoinColumn } from 'typeorm';

import { Specialty } from '../specialty/Specialty';

@Entity('doctor')
@Check(`"Doctor_office" BETWEEN 1 AND 999`)
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'specialty_id' })
  specialty_id: number;

  @Column({ length: 40, unique: true, name: 'doctor_fullname' })
  doctor_fullname: string;

  @Column({ length: 10, nullable: true, unique: true, name: 'doctor_number' })
  doctor_number: string;

  @Column({ name: 'doctor_office' })
  doctor_office: number;

  @Column({ length: 100, nullable: true, name: 'doctor_workschedule' })
  doctor_workschedule: string;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;
}
