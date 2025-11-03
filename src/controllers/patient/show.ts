import { PatientResponseDto } from 'dto/patientResponseDto';
import { Request, Response, NextFunction } from 'express';
import PatientService from 'service/PatientService';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const patientService = new PatientService();
  const id = Number(req.params.id);

  try {
    const patient = await patientService.findById(id);
    const patientdto = new PatientResponseDto(patient);
    res.customSuccess(200, 'Patient found.', patientdto);
  } catch (error) {
    return next(error);
  }
};