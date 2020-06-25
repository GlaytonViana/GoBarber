import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/Appointments.repository';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
    try {
        const { provider, date } = request.body;

        // Organiza os dados
        const parsedDate = parseISO(date);

        // Instancia o serviço que será usado
        const createAppointment = new CreateAppointmentService();

        // Executa o serviço
        const appointment = await createAppointment.execute({
            date: parsedDate,
            provider,
        });

        // Devolve o appointment criado
        return response.json(appointment);
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

export default appointmentsRouter;
