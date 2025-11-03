import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import { getRepository } from 'typeorm';
import { Patient } from 'orm/entities/patient/Patient';
import { Medcard } from 'orm/entities/medcard/Medcard';

export const validatorMedcardCreate = async (req: Request, res: Response, next: NextFunction) => {
  let { 
    patient_id,
    medcard_chronic, 
    medcard_createdate,
    medcard_bloodtype
  } = req.body;
  
  const errorsValidation: ErrorValidation[] = [];

  // Преобразование и тримминг
  patient_id = !patient_id ? '' : patient_id.toString().trim();
  medcard_chronic = !medcard_chronic ? '' : medcard_chronic.toString().trim();
  medcard_createdate = !medcard_createdate ? '' : medcard_createdate.toString();
  medcard_bloodtype = !medcard_bloodtype ? '' : medcard_bloodtype.toString().trim();

  // Валидация patient_id
  if (validator.isEmpty(patient_id)) {
    errorsValidation.push({ patient_id: 'Patient ID is required' });
  } else if (!validator.isInt(patient_id, { min: 1 })) {
    errorsValidation.push({ patient_id: 'Patient ID must be a positive integer' });
  } else {
    // Проверка что пациент существует
    try {
      const patientRepository = getRepository(Patient);
      const patient = await patientRepository.findOne(parseInt(patient_id));
      if (!patient) {
        errorsValidation.push({ patient_id: `Patient with ID ${patient_id} not found` });
      }
    } catch (error) {
      errorsValidation.push({ patient_id: 'Invalid patient ID' });
    }
  }

  // Валидация medcard_chronic (опционально)
  if (medcard_chronic && !validator.isLength(medcard_chronic, { min: 0, max: 50 })) {
    errorsValidation.push({ medcard_chronic: 'Chronic disease must be maximum 50 characters' });
  }

  // Валидация medcard_createdate
  if (validator.isEmpty(medcard_createdate)) {
    errorsValidation.push({ medcard_createdate: 'Medcard create date is required' });
  } else if (!validator.isDate(medcard_createdate)) {
    errorsValidation.push({ medcard_createdate: 'Medcard create date must be a valid date' });
  }

  // Валидация medcard_bloodtype
  if (validator.isEmpty(medcard_bloodtype)) {
    errorsValidation.push({ medcard_bloodtype: 'Blood type is required' });
  } else {
    const validBloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    if (!validBloodTypes.includes(medcard_bloodtype)) {
      errorsValidation.push({ 
        medcard_bloodtype: `Blood type must be one of: ${validBloodTypes.join(', ')}` 
      });
    }
  }

  // Проверка что у пациента еще нет медкарты
  if (patient_id && validator.isInt(patient_id, { min: 1 })) {
    try {
      const medcardRepository = getRepository(Medcard);
      const existingMedcard = await medcardRepository.findOne({
        where: { patient_id: parseInt(patient_id) },
      });
      
      if (existingMedcard) {
        errorsValidation.push({ patient_id: `Patient with ID ${patient_id} already has a medcard` });
      }
    } catch (error) {
      // Игнорируем ошибки поиска при валидации
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400, 
      'Validation', 
      'Create medcard validation error', 
      null, 
      null, 
      errorsValidation
    );
    return next(customError);
  }
  
  return next();
};