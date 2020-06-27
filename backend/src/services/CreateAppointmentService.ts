import { startOfHour } from 'date-fns';

import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/Appointments.repository';
import AppError from '../errors/AppError';

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ date, provider_id }: Request): Promise<Appointment> {
        // Realiza a lógica do service
        const appointmentDate = startOfHour(date);

        // Habilita a conversa com o repositório
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );

        // Usa o repositório para pesquisar no banco
        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        // Retorno de horário já agendado como solicitado na regra de negócio
        if (findAppointmentInSameDate) {
            throw new AppError('This appointment already booked', 400);
        }

        // Altera no banco
        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
