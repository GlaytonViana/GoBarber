import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Array<Appointment> = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointments = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );
        return findAppointments;
    }

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), provider_id, date });

        this.appointments.push(appointment);
        return appointment;
    }
}

export default FakeAppointmentsRepository;
