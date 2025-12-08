import {Request, Response, NextFunction} from 'express';
import { PatientResponseDto } from 'dto/patientResponseDto';
import PatientService from 'service/PatientService';
export const list = async (req: Request, res: Response, next: NextFunction) => {
  const patientService = new PatientService();

  try {
    const patients = await patientService.findAll();
    const patientDtos = patients.map(patient => new PatientResponseDto(patient));
    res.customSuccess(200, 'List of patients.', patientDtos);
  } catch (error) {
    return next(error);
  }
};