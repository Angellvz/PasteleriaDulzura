const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Poblando base de datos de Pastelería Dulzura...');

  // 1. Usuario Admin por defecto
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      usuario: 'admin',
      passwordHash,
      rol: 'ADMIN'
    }
  });
  console.log('👤 Admin creado:', admin.usuario);

  // 2. Configuración de Contacto
  const contacto = await prisma.contacto.upsert({
    where: { id: 'contacto-default' },
    update: {},
    create: {
      id: 'contacto-default',
      telefonoWhatsapp: '51987654321',
      direccion: 'Av. Primavera 456, Santiago de Surco, Lima',
      horarios: 'Lunes a Sábado: 8:00 am - 8:00 pm | Domingos: 9:00 am - 3:00 pm',
      redesSociales: JSON.stringify({
        facebook: 'https://facebook.com/pasteleriadulzura',
        instagram: 'https://instagram.com/pasteleriadulzura',
        tiktok: 'https://tiktok.com/@pasteleriadulzura'
      }),
      emailContacto: 'pedidos@pasteleriadulzura.pe',
      mensajePlantillaWhatsapp: 'Hola Pastelería Dulzura, quisiera consultar por el producto: {producto} (S/ {precio}). ¿Tienen disponibilidad para hoy?'
    }
  });

  // 3. Categorías
  const catTortas = await prisma.categoria.upsert({
    where: { slug: 'tortas' },
    update: {},
    create: { nombre: 'Tortas Especiales', slug: 'tortas', orden: 1, activo: true }
  });

  const catPostres = await prisma.categoria.upsert({
    where: { slug: 'postres' },
    update: {},
    create: { nombre: 'Postres Individuales', slug: 'postres', orden: 2, activo: true }
  });

  const catBocaditos = await prisma.categoria.upsert({
    where: { slug: 'bocaditos' },
    update: {},
    create: { nombre: 'Bocaditos por Mayor', slug: 'bocaditos', orden: 3, activo: true }
  });

  const catPanes = await prisma.categoria.upsert({
    where: { slug: 'panes' },
    update: {},
    create: { nombre: 'Panes Artesanales', slug: 'panes', orden: 4, activo: true }
  });

  console.log('📂 Categorías creadas');

  // 4. Productos iniciales
  await prisma.producto.createMany({
    data: [
      {
        nombre: 'Torta Selva Negra Premium',
        descripcion: 'Bizcochuelo de chocolate artesanal embebido en almíbar de cerezas, relleno de mermelada y crema chantilly.',
        precio: 65.0,
        precioMayor: 58.0,
        categoriaId: catTortas.id,
        imagenUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop',
        disponible: true,
        destacado: true
      },
      {
        nombre: 'Torta Tres Leches de Lúcuma',
        descripcion: 'Nuestra firma de la casa. Bizcochuelo suavecito bañado en tres leches enriquecidas con concentrado de lúcuma de seda.',
        precio: 58.0,
        precioMayor: 50.0,
        categoriaId: catTortas.id,
        imagenUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop',
        disponible: true,
        destacado: true
      },
      {
        nombre: 'Cheesecake de Frutos Rojos',
        descripcion: 'Base de galleta horneada con suave crema de queso y cobertura artesanal de arándanos, frambuesas y fresas.',
        precio: 55.0,
        precioMayor: 48.0,
        categoriaId: catPostres.id,
        imagenUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop',
        disponible: true,
        destacado: true
      },
      {
        nombre: 'Pie de Limón Clásico',
        descripcion: 'Crocante masa sablée rellena de crema ácida de limón criollo y suave merengue italiano dorado al soplete.',
        precio: 45.0,
        precioMayor: 40.0,
        categoriaId: catPostres.id,
        imagenUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop',
        disponible: true,
        destacado: false
      },
      {
        nombre: 'Caja de Alfajorcitos de Manjar (100 unids)',
        descripcion: 'Super delicados alfajorcitos de maicena deshacibles en boca con abundante manjar blanco casero.',
        precio: 45.0,
        precioMayor: 38.0,
        categoriaId: catBocaditos.id,
        imagenUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop',
        disponible: true,
        destacado: true
      },
      {
        nombre: 'Cancha & Mini Cuchinflí Mixto (50 unids)',
        descripcion: 'Bocaditos salados y dulces surtidos para fiestas corporativas y eventos familiares.',
        precio: 50.0,
        precioMayor: 42.0,
        categoriaId: catBocaditos.id,
        imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
        disponible: true,
        destacado: false
      },
      {
        nombre: 'Pan Baguette Tradicional',
        descripcion: 'Pan crujiente por fuera y miga suave por dentro, fermentación lenta con masa madre.',
        precio: 3.5,
        precioMayor: 2.8,
        categoriaId: catPanes.id,
        imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
        disponible: true,
        destacado: false
      },
      {
        nombre: 'Pan Ciabatta con Aceitunas (Paquete x6)',
        descripcion: 'Rústicos panes italianos elaborados con aceite de oliva extra virgen y aceitunas negras botija.',
        precio: 9.0,
        precioMayor: 7.5,
        categoriaId: catPanes.id,
        imagenUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop',
        disponible: true,
        destacado: true
      }
    ]
  });
  console.log('🍰 Productos creados');

  // 5. Ofertas iniciales
  await prisma.oferta.createMany({
    data: [
      {
        titulo: '¡Combo Fin de Semana Dulce!',
        descripcionCorta: 'Lleva cualquier Torta Grande + 1/2 docena de alfajores con 20% de descuento.',
        porcentajeDescuento: 20.0,
        precioOferta: 64.0,
        imagenUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        activo: true
      },
      {
        titulo: 'Descuento Especial Bocaditos por Mayor',
        descripcionCorta: '15% de descuento en pedidos mayores a 200 unidades para tus celebraciones.',
        porcentajeDescuento: 15.0,
        imagenUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop',
        activo: true
      }
    ]
  });
  console.log('🏷️ Ofertas creadas');

  // 6. Artículos de Blog iniciales
  await prisma.articulo.createMany({
    data: [
      {
        titulo: 'Los secretos para elegir el pastel perfecto para tu cumpleaños',
        slug: 'secretos-pastel-perfecto-cumpleanos',
        resumenCorto: 'Descubre cómo seleccionar el sabor, tamaño y diseño adecuado según la cantidad de invitados y la hora del evento.',
        contenido: `Elegir la torta para una fiesta puede ser divertido pero abrumador si no sabes por dónde comenzar. 
        
### 1. El cálculo por persona
Una porción estándar ronda los 100 a 120 gramos. Para 20 personas, una torta de 2 kg a 2.5 kg es el tamaño ideal.

### 2. El clima importa
Si tu fiesta es al aire libre en verano, evita coberturas de mantequilla expuestas al sol directo. Las tortas fondant o cheesecakes bien refrigerados aguantan mucho mejor.

### 3. Sabor universal
El chocolate y la vainilla con manjar son aciertos seguros que gustan tanto a niños como a adultos.`,
        imagenUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop',
        autor: 'Chef María Dulzura',
        publicado: true
      },
      {
        titulo: '¿Por qué la masa madre hace que el pan sea más saludable?',
        slug: 'masa-madre-beneficios-pan-saludable',
        resumenCorto: 'Te explicamos los beneficios de la fermentación natural en la digestión y el sabor crujiente de nuestros panes.',
        contenido: `En Pastelaría Dulzura horneamos diariamente panes con masa madre viva cultivada por más de 5 años.

### Beneficios clave:
- **Mayor digestibilidad:** Los microorganismos descomponen el gluten parcialmente durante las 24 horas de reposo.
- **Índice glucémico más bajo:** Ideal para mantener niveles estables de energía.
- **Sabor inolvidable:** Un toque ligeramente ácido con corteza dorada e irresistible.`,
        imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
        autor: 'Maestro Panadero Carlos',
        publicado: true
      }
    ]
  });
  console.log('📝 Artículos de blog creados');
  console.log('✅ Base de datos inicializada correctamente');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
