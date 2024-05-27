import { invoice_routes } from "../Controllers/invoice.controller"
import { Router } from 'express'

let router = Router();

router.get(
  '/',
  invoice_routes.get_standard_message
);

router.get(
  '/invoice/clients',
  invoice_routes.get_clients
);

router.get(
  '/invoices',
  invoice_routes.get_all_invoices
);

router.get(
  '/invoices/size',
  invoice_routes.get_invoices_size
);

router.get(
  '/invoices/client/size',
  invoice_routes.get_invoices_client_size
);

router.get(
  '/invoice/all',
  invoice_routes.get_invoices
);


router.get(
  '/invoice/client',
  invoice_routes.get_invoice_by_client
);

router.get(
  '/invoice/client/page',
  invoice_routes.get_invoice_by_client_page
);

router.post(
  '/invoice/create',
  invoice_routes.create_invoices
);
export default router;
