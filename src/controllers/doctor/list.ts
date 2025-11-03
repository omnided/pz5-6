import {Request, Response, NextFunction} from 'express';
import DoctorService from 'service/DoctorService';
import { doctorResponseDto } from 'dto/doctorResponseDto';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const doctorService = new DoctorService();
  
  try {
    const doctors = await doctorService.findAll();
    const doctorDtos = doctors.map(doctor => new doctorResponseDto(doctor));
    res.customSuccess(200, 'List of doctors.', doctorDtos);
  } catch (error) {
    return next(error);
  }
};