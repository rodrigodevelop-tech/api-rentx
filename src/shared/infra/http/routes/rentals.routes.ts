import { Router } from 'express';
import { CreateRentalController } from '../../../../modules/rentals/useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '../../../../modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '../../../../modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const rentalsRouter = Router();

const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalsRouter.post('/', ensureAuthenticated, createRentalController.handle);
rentalsRouter.get('/user', ensureAuthenticated, listRentalsByUserController.handle);
rentalsRouter.post(
  '/devolution/:id',
  ensureAuthenticated,
  devolutionRentalController.handle,
);

export { rentalsRouter };
