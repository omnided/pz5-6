import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Patient } from 'orm/entities/patient/Patient';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import validator from 'validator';

export const validatorPatientEdit = async (req: Request, res: Response, next: NextFunction) => {
  let { 
    patient_fullname, 
    patient_sex, 
    patient_address, 
    patient_registerdate,
    patient_number, 
    patient_birthdaydate 
  } = req.body;

  const errorsValidation: ErrorValidation[] = [];
  const patientId = req.params.id;

  // Проверка что patient существует
  if (patientId) {
    try {
      const patientRepository = getRepository(Patient);
      const patient = await patientRepository.findOne(patientId);
      if (!patient) {
        errorsValidation.push({ patient: `Patient with id ${patientId} not found` });
      }
    } catch (error) {
      errorsValidation.push({ patient: 'Invalid patient ID format' });
    }
  }

  // Преобразование и тримминг (только если поля переданы)
  patient_fullname = patient_fullname ? patient_fullname.toString().trim() : '';
  patient_sex = patient_sex ? patient_sex.toString().trim() : '';
  patient_address = patient_address ? patient_address.toString().trim() : '';
  patient_registerdate = patient_registerdate ? patient_registerdate.toString() : '';
  patient_number = patient_number ? patient_number.toString().trim() : '';
  patient_birthdaydate = patient_birthdaydate ? patient_birthdaydate.toString() : '';

  // Валидация patient_fullname (если передано)
  if (patient_fullname !== '') {
    if (!validator.isLength(patient_fullname, { min: 1, max: 40 })) {
      errorsValidation.push({ patient_fullname: 'Patient fullname must be between 1 and 40 characters' });
    }
  }

  // Валидация patient_sex (если передано)
  if (patient_sex !== '') {
    if (!['male', 'female', 'other'].includes(patient_sex)) {
      errorsValidation.push({ patient_sex: 'Patient sex must be one of: male, female, other' });
    }
  }

  // Валидация patient_address (если передано)
  if (patient_address !== '' && !validator.isLength(patient_address, { min: 0, max: 30 })) {
    errorsValidation.push({ patient_address: 'Patient address must be maximum 30 characters' });
  }

  // Валидация patient_registerdate (если передано)
  if (patient_registerdate !== '' && !validator.isDate(patient_registerdate)) {
    errorsValidation.push({ patient_registerdate: 'Patient register date must be a valid date' });
  }

  // Валидация patient_number (если передано)
  if (patient_number !== '') {
    if (!validator.isLength(patient_number, { min: 0, max: 20 })) {
      errorsValidation.push({ patient_number: 'Patient number must be maximum 20 characters' });
    } else if (!validator.isMobilePhone(patient_number, 'any', { strictMode: false })) {
      errorsValidation.push({ patient_number: 'Patient number must be a valid phone number' });
    }
  }

  // Валидация patient_birthdaydate (если передано)
  if (patient_birthdaydate !== '' && !validator.isDate(patient_birthdaydate)) {
    errorsValidation.push({ patient_birthdaydate: 'Patient birthday date must be a valid date' });
  }

  // Проверка что дата рождения не в будущем (если передано)
  if (patient_birthdaydate !== '' && validator.isDate(patient_birthdaydate)) {
    const birthDate = new Date(patient_birthdaydate);
    const today = new Date();
    if (birthDate > today) {
      errorsValidation.push({ patient_birthdaydate: 'Patient birthday date cannot be in the future' });
    }
  }

  // Проверка уникальности patient_fullname (если передано новое имя)
  if (patient_fullname !== '' && patientId) {
    try {
      const patientRepository = getRepository(Patient);
      const existingPatient = await patientRepository.findOne({
        where: { patient_fullname },
      });
      
      if (existingPatient && existingPatient.id !== parseInt(patientId)) {
        errorsValidation.push({ patient_fullname: `Patient with fullname '${patient_fullname}' already exists` });
      }
    } catch (error) {
      // Игнорируем ошибки поиска при валидации
    }
  }

  // Проверка уникальности patient_number (если передан новый номер)
  if (patient_number !== '' && patientId) {
    try {
      const patientRepository = getRepository(Patient);
      const existingPatient = await patientRepository.findOne({
        where: { patient_number },
      });
      
      if (existingPatient && existingPatient.id !== parseInt(patientId)) {
        errorsValidation.push({ patient_number: `Patient with number '${patient_number}' already exists` });
      }
    } catch (error) {
      // Игнорируем ошибки поиска при валидации
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400, 
      'Validation', 
      'Edit patient validation error', 
      null, 
      null, 
      errorsValidation
    );
    return next(customError);
  }
  
  return next();
};
