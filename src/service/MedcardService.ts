import { Patient } from 'orm/entities/patient/Patient';
import { Medcard } from 'orm/entities/medcard/Medcard';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';
import type { blood_type } from 'orm/entities/medcard/types';

class MedcardService {
    private medcardRepository = getRepository(Medcard);
    private patientRepository = getRepository(Patient); 
    async findAll(): Promise<Medcard[]> {
        return this.medcardRepository.find({
            relations: ['patient']
        });

    }
    async findById(id: number): Promise<Medcard> {
        const medcard = await this.medcardRepository.findOne({
            where: { id },
            relations: ['patient']
        });

        if (!medcard) {
            throw new CustomError(404, 'General', `Medcard with id:${id} not found.`);
        }

        return medcard;
    }
    async create(medcardData: { 
        patient_id: number; 
        medcard_chronic?: string;
        medcard_createdate: Date;
        medcard_bloodtype?: blood_type;
    }): Promise<Medcard> {
        const patient = await this.patientRepository.findOne({ where: { id: medcardData.patient_id } });
        if (!patient) {
            throw new CustomError(404, 'General', `Patient with id:${medcardData.patient_id} not found.`);
        }

        const medcard = this.medcardRepository.create({
            ...medcardData,
            patient
        });

        return this.medcardRepository.save(medcard);
    }
    async update(id: number, medcardData: { 
        patient_id?: number; 
        medcard_chronic?: string;
        medcard_createdate?: Date;
        medcard_bloodtype?: blood_type;
    }): Promise<Medcard> {
        const medcard = await this.medcardRepository.findOne({ where: { id }, relations: ['patient'] });
        if (!medcard) {
            throw new CustomError(404, 'General', `Medcard with id:${id} not found.`);
        }

        const patient = medcardData.patient_id ? await this.patientRepository.findOne({ where: { id: medcardData.patient_id } }) : medcard.patient;
        if (!patient) {
            throw new CustomError(404, 'General', `Patient with id:${medcardData.patient_id} not found.`);
        }

        await this.medcardRepository.update(id, {
            ...medcardData,
            patient
        });

        const updatedMedcard = await this.medcardRepository.findOne({
            where: { id },
            relations: ['patient']
        });

        if (!updatedMedcard) {
            throw new CustomError(404, 'General', `Medcard with id:${id} not found after update.`);
        }

        return updatedMedcard;
    }
    async delete(id: number): Promise<void> {
        const medcard = await this.medcardRepository.findOne({ where: { id } });
        if (!medcard) {
            throw new CustomError(404, 'General', `Medcard with id:${id} not found.`);
        }
        await this.medcardRepository.remove(medcard);
    }
}

export default MedcardService;
