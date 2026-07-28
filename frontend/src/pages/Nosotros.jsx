import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Cake, Heart, Award, ShieldCheck, Sparkles, Users } from 'lucide-react';

const Nosotros = () => {
  const { data: contacto } = useQuery({
    queryKey: ['contacto-info'],
    queryFn: async () => {
      const res = await api.get('/contacto');
      return res.data;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-dulzura-cream">
      <Header />

      <main className="flex-grow py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
        
        {/* Banner principal */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest text-dulzura-pink uppercase">Nuestra Historia & Valores</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dulzura-chocolate">
            Amor, Tradición y Sabor Artesanal
          </h1>
          <p className="text-dulzura-chocolate/75 text-lg leading-relaxed">
            En Pastelería Dulzura preparamos cada receta como si fuera para nuestra propia familia: con paciencia, ingredientes seleccionados de origen local y pasión por los detalles.
          </p>
        </div>

        {/* Sección de Historia */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-dulzura-rose/50 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-dulzura-chocolate">
              Cómo Empezó Nuestro Sueño
            </h2>
            <p className="text-dulzura-chocolate/80 text-base leading-relaxed">
              Pastelería Dulzura abrió sus puertas con una misión muy clara: rescatar las recetas de pastelería y panadería tradicional que alegran los corazones. Desde nuestros inicios con un pequeño horno familiar, nos hemos caracterizado por el uso de mantequilla pura, crema natural y frutas frescas de temporada.
            </p>
            <p className="text-dulzura-chocolate/80 text-base leading-relaxed">
              Hoy atendemos a cientos de familias arequipeñas, empresas y eventos especiales, ofreciendo desde tortas de cumpleaños personalizadas hasta cajas de bocaditos al por mayor para celebraciones inolvidables.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-dulzura-rose/40 h-80">
            <img
              src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&auto=format&fit=crop"
              alt="Pasteleros trabajando en Pastelería Dulzura"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Nuestros Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-dulzura-rose/50 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-dulzura-rose/60 text-dulzura-chocolate flex items-center justify-center mx-auto">
              <Award className="w-7 h-7 text-dulzura-pink" />
            </div>
            <h3 className="font-serif text-xl font-bold text-dulzura-chocolate">Calidad Incondicional</h3>
            <p className="text-dulzura-chocolate/75 text-sm leading-relaxed">
              No usamos premezclas ni preservantes artificiales. Todo lo que servimos es 100% fresco y elaborado diariamente.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-dulzura-rose/50 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-dulzura-rose/60 text-dulzura-chocolate flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7 text-dulzura-pink" />
            </div>
            <h3 className="font-serif text-xl font-bold text-dulzura-chocolate">Pasión por el Detalle</h3>
            <p className="text-dulzura-chocolate/75 text-sm leading-relaxed">
              Cada decoración de torta y cada corte de hojaldre pasa por una estricta revisión visual para garantizar un acabado de revista.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-dulzura-rose/50 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-dulzura-rose/60 text-dulzura-chocolate flex items-center justify-center mx-auto">
              <Users className="w-7 h-7 text-dulzura-pink" />
            </div>
            <h3 className="font-serif text-xl font-bold text-dulzura-chocolate">Compromiso con el Cliente</h3>
            <p className="text-dulzura-chocolate/75 text-sm leading-relaxed">
              Tu satisfacción es nuestra prioridad. Brindamos atención directa por WhatsApp para resolver pedidos urgentes y personalizados.
            </p>
          </div>
        </div>

      </main>

      <Footer contacto={contacto} />
    </div>
  );
};

export default Nosotros;
