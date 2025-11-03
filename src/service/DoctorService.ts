import { Doctor } from 'orm/entities/doctor/Doctor';
import { Specialty } from 'orm/entities/specialty/Specialty';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

class DoctorService {
  private doctorRepository = getRepository(Doctor);
  private specialtyRepository = getRepository(Specialty);

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({
        relations: ['specialty']
    });
  }

  async findById(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ 
        where: { id },
        relations: ['specialty'] 
    });

    if (!doctor) {
      throw new CustomError(404, 'General', `Doctor with id:${id} not found.`);
    }

    return doctor;
  }

  async create(doctorData: { specialty_id: number; doctor_fullname: string; doctor_number: string; doctor_office: number }): Promise<Doctor> {
    const specialty = await this.specialtyRepository.findOne({ where: { id: doctorData.specialty_id } });

    if (!specialty) {
      throw new CustomError(404, 'General', `Specialty with id:${doctorData.specialty_id} not found.`);
    }

    const doctor = this.doctorRepository.create({
        ...doctorData,
        specialty: specialty    
    });
    return this.doctorRepository.save(doctor);
  }

  async update(id: number, doctorData: { specialty_id?: number; doctor_fullname?: string; doctor_number?: string; doctor_office?: number }): Promise<Doctor | undefined> {
    const existingDoctor = await this.doctorRepository.findOne({ where: { id } });

    if (!existingDoctor) {
      throw new CustomError(404, 'General', `Doctor with id:${id} not found.`);
    }

    if (doctorData.specialty_id) {
      const specialty = await this.specialtyRepository.findOne({
        where: { id: doctorData.specialty_id }
      });
      if (!specialty) {
        throw new CustomError(404, 'General', `Specialty with id:${doctorData.specialty_id} not found.`);
      }
    }

     await this.doctorRepository.update(id, doctorData);
     const updatedDoctor = await this.doctorRepository.findOne({ 
      where: { id },
      relations: ['specialty']
    });
    
    if (!updatedDoctor) {
      throw new CustomError(404, 'General', `Doctor with id:${id} not found after update.`);
    }

    return updatedDoctor;
  }

  async delete(id: number): Promise<void> {
   const doctor = await this.doctorRepository.findOne({ where: { id } });
   if (!doctor) {
     throw new CustomError(404, 'General', `Doctor with id:${id} not found.`);
   }
   await this.doctorRepository.remove(doctor);
  }
}

export default DoctorService;
