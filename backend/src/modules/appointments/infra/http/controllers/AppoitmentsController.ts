import { Request, Response } from 'express';

import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppoitmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { provider_id, date } = request.body;

        // Organiza os dados
        const parsedDate = parseISO(date);

        // Instancia o serviço que será usado
        const createAppointment = container.resolve(CreateAppointmentService);

        // Executa o serviço
        const appointment = await createAppointment.execute({
            date: parsedDate,
            provider_id,
        });

        // Devolve o appointment criado
        return response.json(appointment);
    }
}
