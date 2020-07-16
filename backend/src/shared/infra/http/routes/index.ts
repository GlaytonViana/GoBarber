import { Router } from 'express';
import appoitmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/appointments', appoitmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRoutes);

export default routes;
