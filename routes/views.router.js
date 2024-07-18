import { Router } from 'express';

const router = Router();

// Renderiza la vista principal
router.get('/', (req, res) => {
  res.render('home', { title: 'Inicio' });
});

// Renderiza la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
});

export default router;
