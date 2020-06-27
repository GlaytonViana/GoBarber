import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/Appointments.repository';

import ensureAuthenticated from '../middleware/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body;

    // Organiza os dados
    const parsedDate = parseISO(date);

    // Instancia o serviço que será usado
    const createAppointment = new CreateAppointmentService();

    // Executa o serviço
    const appointment = await createAppointment.execute({
        date: parsedDate,
        provider_id,
    });

    // Devolve o appointment criado
    return response.json(appointment);
});

export default appointmentsRouter;
