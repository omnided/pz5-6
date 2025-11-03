import { Medcard } from 'orm/entities/medcard/Medcard';
import { Patient } from 'orm/entities/patient/Patient';

class PatientShortDto {
    id: number;
    patient_fullname: string;
    patient_sex: string;
    patient_birthdaydate: Date;

    constructor(patient: Patient) {
        this.id = patient.id;
        this.patient_fullname = patient.patient_fullname;
        this.patient_sex = patient.patient_sex;
        this.patient_birthdaydate = patient.patient_birthdaydate;
    }
}

export class MedcardResponseDto {
    id: number;
    patient_id: number;
    medcard_chronic: string;
    medcard_createdate: Date;
    medcard_bloodtype: string;
    patient?: PatientShortDto;

    constructor(medcard: Medcard) {
        this.id = medcard.id;
        this.patient_id = medcard.patient_id;
        this.medcard_chronic = medcard.medcard_chronic;
        this.medcard_createdate = medcard.medcard_createdate;
        this.medcard_bloodtype = medcard.medcard_bloodtype;
        if (medcard.patient) {
            this.patient = new PatientShortDto(medcard.patient);
        }
    }
}
