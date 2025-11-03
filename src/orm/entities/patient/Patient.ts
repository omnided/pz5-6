import { Entity, PrimaryGeneratedColumn, Column, Unique, Check, ManyToOne, JoinColumn } from 'typeorm';
import type { PatientSex } from './types';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Medcard } from '../medcard/Medcard';
@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 40,
    nullable: false,
    unique: true
  })
  patient_fullname: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    default: 'other' as PatientSex,
  })
  patient_sex: PatientSex;

  @Column({
    type: 'varchar', 
    length: 30,
    nullable: true
  })
  patient_address: string;

  @Column({
    type: 'date',
    nullable: false
  })
  patient_registerdate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    unique: true
  })
  patient_number: string;

  @Column({
    type: 'date', 
    nullable: false
  })
  patient_birthdaydate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Medcard, medcard => medcard.patient)
  medcards: Medcard[];
}