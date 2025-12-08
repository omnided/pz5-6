import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import { getRepository } from 'typeorm';
import { Patient } from 'orm/entities/patient/Patient';
import { Medcard } from 'orm/entities/medcard/Medcard';

export const validatorMedcardEdit = async (req: Request, res: Response, next: NextFunction) => {
  let { 
    patient_id,
    medcard_chronic, 
    medcard_createdate,
    medcard_bloodtype
  } = req.body;

  const errorsValidation: ErrorValidation[] = [];
  const medcardId = req.params.id;

  // Проверка что medcard существует
  if (medcardId) {
    try {
      const medcardRepository = getRepository(Medcard);
      const medcard = await medcardRepository.findOne(medcardId);
      if (!medcard) {
        errorsValidation.push({ medcard: `Medcard with id ${medcardId} not found` });
      }
    } catch (error) {
      errorsValidation.push({ medcard: 'Invalid medcard ID format' });
    }
  }

  // Преобразование и тримминг (только если поля переданы)
  patient_id = patient_id ? patient_id.toString().trim() : '';
  medcard_chronic = medcard_chronic ? medcard_chronic.toString().trim() : '';
  medcard_createdate = medcard_createdate ? medcard_createdate.toString() : '';
  medcard_bloodtype = medcard_bloodtype ? medcard_bloodtype.toString().trim() : '';

  // Валидация patient_id (если передано)
  if (patient_id !== '') {
    if (!validator.isInt(patient_id, { min: 1 })) {
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

    // Проверка что у пациента еще нет медкарты (если меняется patient_id)
    if (patient_id !== '' && medcardId) {
      try {
        const medcardRepository = getRepository(Medcard);
        const existingMedcard = await medcardRepository.findOne({
          where: { patient_id: parseInt(patient_id) },
        });
        
        if (existingMedcard && existingMedcard.id !== parseInt(medcardId)) {
          errorsValidation.push({ patient_id: `Patient with ID ${patient_id} already has a medcard` });
        }
      } catch (error) {
        // Игнорируем ошибки поиска при валидации
      }
    }
  }

  // Валидация medcard_chronic (если передано)
  if (medcard_chronic !== '' && !validator.isLength(medcard_chronic, { min: 0, max: 50 })) {
    errorsValidation.push({ medcard_chronic: 'Chronic disease must be maximum 50 characters' });
  }

  // Валидация medcard_createdate (если передано)
  if (medcard_createdate !== '' && !validator.isDate(medcard_createdate)) {
    errorsValidation.push({ medcard_createdate: 'Medcard create date must be a valid date' });
  }

  // Валидация medcard_bloodtype (если передано)
  if (medcard_bloodtype !== '') {
    const validBloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    if (!validBloodTypes.includes(medcard_bloodtype)) {
      errorsValidation.push({ 
        medcard_bloodtype: `Blood type must be one of: ${validBloodTypes.join(', ')}` 
      });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400, 
      'Validation', 
      'Edit medcard validation error', 
      null, 
      null, 
      errorsValidation
    );
    return next(customError);
  }
  
  return next();
};