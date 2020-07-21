import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '12341234',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('12341234');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const createAppointmentDate = new Date();

        await createAppointment.execute({
            date: createAppointmentDate,
            provider_id: '12341234',
        });

        expect(
            createAppointment.execute({
                date: createAppointmentDate,
                provider_id: '12341234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
