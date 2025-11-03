import { Patient } from 'orm/entities/patient/Patient';

export class PatientResponseDto {
    id: number;
    patient_fullname: string;
    patient_sex: string;
    patient_registerdate: Date;
    patient_birthdaydate: Date;

    constructor(patient: Patient) {
        this.id = patient.id;
        this.patient_fullname = patient.patient_fullname;
        this.patient_sex = patient.patient_sex;
        this.patient_registerdate = patient.patient_registerdate;
        this.patient_birthdaydate = patient.patient_birthdaydate;
    }
}
