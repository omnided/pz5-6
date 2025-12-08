import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import DoctorService from 'service/DoctorService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { doctor_fullname, doctor_number, doctor_office, specialty_id } = req.body;
  const doctorService = new DoctorService();
  try {
    const doctor = await doctorService.create({
      doctor_fullname,
      doctor_number,
      doctor_office,
      specialty_id
    });
    res.customSuccess(201, 'Doctor successfully created.', {
      id: doctor.id,
      doctor_fullname: doctor.doctor_fullname,
        doctor_number: doctor.doctor_number,
        doctor_office: doctor.doctor_office,
        specialty_name: doctor.specialty?.specialty_name
      });
    } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }
    
    const customError = new CustomError(500, 'Raw', 'Doctor creation failed', null, error);
    return next(customError);
  }
};
