import { Request, Response, NextFunction } from 'express';
import DoctorService from 'service/DoctorService';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const doctorService = new DoctorService();
  const id = Number(req.params.id);
  const { doctor_fullname, doctor_number, doctor_office, specialty_id } = req.body;

  try {
    const doctor = await doctorService.update(id, {
      doctor_fullname,
      doctor_number, 
      doctor_office,
      specialty_id
    });
    res.customSuccess(200, 'Doctor successfully updated.', doctor);
  } catch (error) {
    return next(error);
  }
};