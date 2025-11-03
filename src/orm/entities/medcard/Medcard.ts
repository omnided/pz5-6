import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from '../patient/Patient';
import { blood_type } from './types';

@Entity('medcard')
export class Medcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'patient_id',
    type: 'int',
    nullable: false
  })
  patient_id: number;

  @ManyToOne(() => Patient, patient => patient.medcards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({
    name: 'medcard_chronic',
    type: 'varchar',
    length: 50,
    nullable: true
  })
  medcard_chronic: string;

  @Column({
    name: 'medcard_createdate',
    type: 'date',
    nullable: false
  })
  medcard_createdate: Date;

  @Column({
    type: 'varchar',
    length: 3,
    name: 'medcard_bloodtype',
    default: 'O-' as blood_type,
  })
  medcard_bloodtype: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}