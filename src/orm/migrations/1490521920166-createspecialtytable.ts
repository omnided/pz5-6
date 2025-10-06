import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpecialtyTable1490521920166 implements MigrationInterface {
  name = 'CreateSpecialtyTable1490521920166';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE specialty (
                id SERIAL PRIMARY KEY NOT NULL,
                Specialty_name VARCHAR(30) NOT NULL,
                Specialty_salary NUMERIC(7,2),
                CHECK (Specialty_salary >= 8000.00 AND Specialty_salary <= 25000.00)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE specialty;`);
  }
}
