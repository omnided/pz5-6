import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import PatientService from 'service/PatientService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { patient_fullname, patient_sex, patient_address, patient_registerdate, patient_number, patient_birthdaydate } = req.body;
  const patientService = new PatientService();
  try {
    const patient = await patientService.create({
        patient_fullname,  
        patient_sex, 
        patient_address, 
        patient_registerdate, 
        patient_number, 
        patient_birthdaydate
    });
    res.customSuccess(201, 'Patient successfully created.', {
      id: patient.id,
      patient_fullname: patient.patient_fullname,
      patient_sex: patient.patient_sex,
      patient_address: patient.patient_address,
      patient_registerdate: patient.patient_registerdate,
      patient_number: patient.patient_number,
      patient_birthdaydate: patient.patient_birthdaydate
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }

    const customError = new CustomError(500, 'Raw', 'Patient creation failed', null, error);
    return next(customError);
  }
};