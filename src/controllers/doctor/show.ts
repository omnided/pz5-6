import { doctorResponseDto } from 'dto/doctorResponseDto';
import { Request, Response, NextFunction } from 'express';
import DoctorService from 'service/DoctorService';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const doctorService = new DoctorService();
  const id = Number(req.params.id);

  try {
    const doctor = await doctorService.findById(id);
    const doctordto = new doctorResponseDto(doctor);
    res.customSuccess(200, 'Doctor found.', doctordto);
  } catch (error) {
    return next(error);
  }
};
