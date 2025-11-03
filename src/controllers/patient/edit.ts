import { Request, Response, NextFunction } from 'express';
import PatientService from 'service/PatientService';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const patientService = new PatientService();
  const id = Number(req.params.id);
  const { patient_fullname,  
        patient_sex, 
        patient_address, 
        patient_registerdate, 
        patient_number, 
        patient_birthdaydate } = req.body;

  try {
    const patient = await patientService.update(id, {
        patient_fullname,  
        patient_sex, 
        patient_address, 
        patient_registerdate, 
        patient_number, 
        patient_birthdaydate
    });
    res.customSuccess(200, 'Patient successfully updated.', patient);
  } catch (error) {
    return next(error);
  }
};