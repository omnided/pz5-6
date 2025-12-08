import { Doctor } from "orm/entities/doctor/Doctor";
import { Specialty } from "orm/entities/specialty/Specialty";

class SpecialtyShortDto {
    id: number;
    specialty_name: string;

    constructor(specialty: Specialty) {
        this.id = specialty.id;
        this.specialty_name = specialty.specialty_name;
    }
}

export class doctorResponseDto {
    id: number;
    doctor_fullname: string;
    doctor_number: string;
    specialty_id: number;
    specialty_name: string;
    specialty?: SpecialtyShortDto;

    constructor(doctor: Doctor) {
        this.id = doctor.id;
        this.doctor_fullname = doctor.doctor_fullname;
        this.doctor_number = doctor.doctor_number;

        if (doctor.specialty) {
            this.specialty = new SpecialtyShortDto(doctor.specialty);
        }
    }
};
