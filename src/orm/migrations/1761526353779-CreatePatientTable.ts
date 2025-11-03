import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePatientTable1761526353779 implements MigrationInterface {
    name = 'CreatePatientTable1761526353779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "doctor" DROP CONSTRAINT "specialty_id_fk"
        `);
        await queryRunner.query(`
            ALTER TABLE "specialty" DROP CONSTRAINT "specialty_specialty_salary_check"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor" DROP CONSTRAINT "doctor_doctor_office_check"
        `);
        await queryRunner.query(`
            CREATE TABLE "medcard" (
                "id" SERIAL NOT NULL,
                "patient_id" integer NOT NULL,
                "medcard_chronic" character varying(50),
                "medcard_createdate" date NOT NULL,
                "medcard_bloodtype" character varying(3) NOT NULL DEFAULT 'O-',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4f782c6f23577a04f8eec8b52c8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "patient" (
                "id" SERIAL NOT NULL,
                "patient_fullname" character varying(40) NOT NULL,
                "patient_sex" character varying(10) NOT NULL DEFAULT 'other',
                "patient_address" character varying(30),
                "patient_registerdate" date NOT NULL,
                "patient_number" character varying(20),
                "patient_birthdaydate" date NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor" DROP CONSTRAINT "doctor_doctor_number_key"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor" DROP COLUMN "doctor_number"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD "doctor_number" character varying(10)
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD CONSTRAINT "UQ_bb7ed1923860b3ee1284429d3a8" UNIQUE ("doctor_number")
        `);
        await queryRunner.query(`
            ALTER TABLE "specialty"
            ADD CONSTRAINT "CHK_d042806295b9de2d3d180974e3" CHECK (
                    "specialty_salary" >= 8000.00
                    AND "specialty_salary" <= 25000.00
                )
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD CONSTRAINT "CHK_048b119c87a9ffb71862565e25" CHECK (
                    "doctor_office" BETWEEN 1 AND 999
                )
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD CONSTRAINT "FK_bb2b1ec7556ecdf92c8b6cc8cf7" FOREIGN KEY ("specialty_id") REFERENCES "specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "medcard"
            ADD CONSTRAINT "FK_b806a97d1613f9b3ac2cf37bef3" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "medcard" DROP CONSTRAINT "FK_b806a97d1613f9b3ac2cf37bef3"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor" DROP CONSTRAINT "FK_bb2b1ec7556ecdf92c8b6cc8cf7"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor" DROP CONSTRAINT "CHK_048b119c87a9ffb71862565e25"
        `);
        await queryRunner.query(`
            ALTER TABLE "specialty" DROP CONSTRAINT "CHK_d042806295b9de2d3d180974e3"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor" DROP CONSTRAINT "UQ_bb7ed1923860b3ee1284429d3a8"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor" DROP COLUMN "doctor_number"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD "doctor_number" character(10)
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD CONSTRAINT "doctor_doctor_number_key" UNIQUE ("doctor_number")
        `);
        await queryRunner.query(`
            DROP TABLE "patient"
        `);
        await queryRunner.query(`
            DROP TABLE "medcard"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD CONSTRAINT "doctor_doctor_office_check" CHECK (
                    (
                        (doctor_office >= 1)
                        AND (doctor_office <= 999)
                    )
                )
        `);
        await queryRunner.query(`
            ALTER TABLE "specialty"
            ADD CONSTRAINT "specialty_specialty_salary_check" CHECK (
                    (
                        (specialty_salary >= 8000.00)
                        AND (specialty_salary <= 25000.00)
                    )
                )
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD CONSTRAINT "specialty_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
