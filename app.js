import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { create } from 'express-handlebars';
import path from 'path';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './controllers/product-manager.js';
import { __dirname } from './utils/utils.js'; // Asegúrate de que la ruta de utils.js es correcta

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a la base de datos MongoDB
const MONGO_URI = 'mongodb://localhost:27017/ecommerce';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a la base de datos MongoDB');
}).catch(error => {
  console.error('Error al conectar a la base de datos MongoDB:', error);
});

// Configurar middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar el motor de plantillas Handlebars
const hbs = create({
  extname: '.handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts')
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Configurar WebSockets
const io = new Server(server);
io.on('connection', socket => {
  console.log('Nuevo cliente conectado');

  socket.on('productAdded', async () => {
    const products = await ProductManager.getProducts();
    io.emit('updateProducts', products);
  });

  socket.on('productDeleted', async () => {
    const products = await ProductManager.getProducts();
    io.emit('updateProducts', products);
  });
});

export { io };

