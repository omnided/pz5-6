import { Request, Response, NextFunction } from 'express';
import PatientService from 'service/PatientService';

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  const patientService = new PatientService();
  const id = Number(req.params.id);

  try {
    await patientService.delete(id);
    res.customSuccess(200, 'Patient successfully deleted.');
  } catch (error) {
    return next(error);
  }
};