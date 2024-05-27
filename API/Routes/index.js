import { Router } from 'express';
import invoice_routes from "./invoices"

const router = Router();

router.use(invoice_routes)

export default router;
