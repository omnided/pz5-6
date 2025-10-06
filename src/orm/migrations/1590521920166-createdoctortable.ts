import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorTable1590521920166 implements MigrationInterface {
  name = 'CreateDoctorTable1590521920166';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE doctor (
                id SERIAL PRIMARY KEY NOT NULL,
                Specialty_id INT NOT NULL,
                Doctor_fullname VARCHAR(40) NOT NULL UNIQUE,
                Doctor_number CHAR(10) UNIQUE,
                Doctor_office INT NOT NULL CHECK (Doctor_office BETWEEN 1 AND 999),
                Doctor_workschedule VARCHAR(100),
                CONSTRAINT Specialty_id_fk FOREIGN KEY (Specialty_id) REFERENCES specialty (id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE doctor;`);
  }
}
