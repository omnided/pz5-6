import { Patient } from 'orm/entities/patient/Patient';
import { Medcard } from 'orm/entities/medcard/Medcard';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';
import type { PatientSex } from 'orm/entities/patient/types';

class PatientService {
    private patientRepository = getRepository(Patient);
    async findAll(): Promise<Patient[]> {
        return this.patientRepository.find({
            relations: ['medcards']
        });
    }
    async findById(id: number): Promise<Patient> {
        const patient = await this.patientRepository.findOne({
            where: { id },
            relations: ['medcards']
        });
        if (!patient) {
            throw new CustomError(404,'General', `Patient with id:${id} not found.`);
        }
        return patient;
    }
    async create(patientData: { 
        patient_fullname: string; 
        patient_sex: PatientSex; 
        patient_address?: string; 
        patient_registerdate: Date; 
        patient_number?: string; 
        patient_birthdaydate: Date; 
    }): Promise<Patient> {
        const existingPatient = await this.patientRepository.findOne({ where: { patient_fullname: patientData.patient_fullname } });
        if (existingPatient) {
            throw new CustomError(400, 'General', `Patient with fullname:${patientData.patient_fullname} already exists.`);
        }
    const patient = this.patientRepository.create({
        ...patientData
    });
    return this.patientRepository.save(patient);
  }
    async update(id: number, patientData: {
        patient_fullname?: string;
        patient_sex?: PatientSex;
        patient_address?: string;
        patient_registerdate?: Date;
        patient_number?: string;
        patient_birthdaydate?: Date;
    }): Promise<Patient> {
        const existingPatient = await this.patientRepository.findOne({ where: { id } });
        if (!existingPatient) {
            throw new CustomError(404, 'General', `Patient with id:${id} not found.`);
        }

        await this.patientRepository.update(id, patientData);
        const updatedPatient = await this.patientRepository.findOne({
            where: { id },
            relations: ['medcards']
        });

    if (!updatedPatient) {
        throw new CustomError(404, 'General', `Patient with id:${id} not found after update.`);
    }

    return updatedPatient;
    }

    async delete(id: number): Promise<void> {
        const patient = await this.patientRepository.findOne({ where: { id } });
        if (!patient) {
            throw new CustomError(404, 'General', `Patient with id:${id} not found.`);
        }
        await this.patientRepository.remove(patient);
    }
}
export default PatientService;
