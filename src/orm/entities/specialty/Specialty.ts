import { Entity, PrimaryGeneratedColumn, Column, Check } from 'typeorm';

@Entity('specialty')
@Check('"Specialty_salary" >= 8000.00 AND "Specialty_salary" <= 25000.00')
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  Specialty_name: string;

  @Column('numeric', { precision: 7, scale: 2, nullable: true })
  Specialty_salary: number;
}
