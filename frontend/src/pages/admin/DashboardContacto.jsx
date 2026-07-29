import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, CheckCircle, PhoneCall, MapPin, Clock, Mail, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

const DashboardContacto = () => {
  const queryClient = useQueryClient();
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [imagenHeroFile, setImagenHeroFile] = useState(null);
  const [imagenHeroPreview, setImagenHeroPreview] = useState('');

  const [formData, setFormData] = useState({
    telefonoWhatsapp: '',
    direccion: '',
    horarios: '',
    emailContacto: '',
    mensajePlantillaWhatsapp: '',
    facebook: '',
    instagram: ''
  });

  const { data: contacto, isLoading } = useQuery({
    queryKey: ['admin-contacto'],
    queryFn: async () => {
      const res = await api.get('/contacto');
      return res.data;
    }
  });

  useEffect(() => {
    if (contacto) {
      let redes = {};
      try {
        redes = typeof contacto.redesSociales === 'string' ? JSON.parse(contacto.redesSociales) : (contacto.redesSociales || {});
      } catch (e) {
        redes = {};
      }

      setFormData({
        telefonoWhatsapp: contacto.telefonoWhatsapp || '',
        direccion: contacto.direccion || '',
        horarios: contacto.horarios || '',
        emailContacto: contacto.emailContacto || '',
        mensajePlantillaWhatsapp: contacto.mensajePlantillaWhatsapp || '',
        facebook: redes.facebook || '',
        instagram: redes.instagram || ''
      });

      setImagenHeroPreview(contacto.imagenHero || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&auto=format&fit=crop');
    }
  }, [contacto]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenHeroFile(file);
      setImagenHeroPreview(URL.createObjectURL(file));
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (dataToSave) => {
      const data = new FormData();
      data.append('telefonoWhatsapp', dataToSave.telefonoWhatsapp);
      data.append('direccion', dataToSave.direccion);
      data.append('horarios', dataToSave.horarios);
      data.append('emailContacto', dataToSave.emailContacto);
      data.append('mensajePlantillaWhatsapp', dataToSave.mensajePlantillaWhatsapp);
      data.append('redesSociales', JSON.stringify({
        facebook: dataToSave.facebook,
        instagram: dataToSave.instagram
      }));

      if (imagenHeroFile) {
        data.append('imagenHero', imagenHeroFile);
      } else if (contacto?.imagenHero) {
        data.append('imagenHero', contacto.imagenHero);
      }

      return await api.put('/contacto', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-contacto']);
      queryClient.invalidateQueries(['contacto-header']);
      queryClient.invalidateQueries(['contacto-info']);
      queryClient.invalidateQueries(['public-contacto-widget']);
      setGuardadoExitoso(true);
      setImagenHeroFile(null);
      setTimeout(() => setGuardadoExitoso(false), 4000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <AdminLayout title="Configuración de Contacto & Imagen de Fondo">
      <div className="max-w-4xl bg-white rounded-3xl p-8 border border-gray-200 shadow-xs space-y-6">
        
        <div className="border-b border-gray-100 pb-4">
          <h3 className="font-serif text-xl font-bold text-dulzura-chocolate">
            Configuración General, Fondo Hero & WhatsApp
          </h3>
          <p className="text-xs text-dulzura-chocolate/70 mt-1">
            Administra la imagen de fondo principal (Hero Banner), el número de pedidos por WhatsApp, la dirección física y tus redes sociales.
          </p>
        </div>

        {guardadoExitoso && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Configuración e Imagen de Fondo actualizadas correctamente.</span>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando datos de contacto...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECCIÓN 1: IMAGEN DE FONDO DE PORTADA (HERO BANNER) */}
            <div className="p-6 rounded-2xl bg-dulzura-rose/20 border border-dulzura-rose/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-dulzura-pink" />
                  <label className="block text-xs font-bold uppercase text-dulzura-chocolate">
                    Imagen de Fondo Principal (Hero Banner del Inicio)
                  </label>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-full border border-amber-300 self-start sm:self-auto">
                  📐 Recomendado: 1920 x 1080 px (16:9)
                </span>
              </div>

              {/* Guía de Medidas Sugeridas */}
              <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200/80 text-xs text-amber-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Recomendación de medidas para la imagen de portada:</span>
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900/90 pl-1">
                  <li><strong>Resolución óptima:</strong> 1920 x 1080 px o 1600 x 900 px (Horizontal panorámica).</li>
                  <li><strong>Tamaño de archivo máximo:</strong> 5 MB.</li>
                  <li><strong>Formatos soportados:</strong> JPG, PNG, WEBP.</li>
                </ul>
              </div>

              {/* Preview & Upload controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                {imagenHeroPreview ? (
                  <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden border-2 border-dulzura-pink shadow-md shrink-0">
                    <img src={imagenHeroPreview} alt="Vista previa de portada" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full sm:w-48 h-28 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 shrink-0">
                    Sin imagen
                  </div>
                )}

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    id="imagenHeroInput"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imagenHeroInput"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-dulzura-pink/60 text-dulzura-chocolate text-xs font-bold hover:bg-dulzura-rose/40 cursor-pointer shadow-xs transition-colors"
                  >
                    <Upload className="w-4 h-4 text-dulzura-pink" />
                    <span>{imagenHeroFile ? 'Cambiar Imagen Seleccionada' : 'Subir Nueva Imagen'}</span>
                  </label>
                  {imagenHeroFile && (
                    <p className="text-xs text-emerald-700 font-semibold truncate">
                      ✓ Seleccionada: {imagenHeroFile.name}
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* SECCIÓN 2: TELÉFONO Y CORREO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">
                  Número de WhatsApp (con código de país ej. 51987654321)
                </label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.telefonoWhatsapp}
                    onChange={(e) => setFormData({ ...formData, telefonoWhatsapp: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">
                  Correo Electrónico de Contacto
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.emailContacto}
                    onChange={(e) => setFormData({ ...formData, emailContacto: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">
                Dirección Física del Local
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">
                Horarios de Atención
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.horarios}
                  onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dulzura-rose/30 border border-dulzura-rose/50 space-y-3">
              <label className="block text-xs font-bold uppercase text-dulzura-chocolate">
                Plantilla del Mensaje de WhatsApp
              </label>
              <p className="text-xs text-dulzura-chocolate/70">
                Variables disponibles: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-dulzura-pink font-bold">{'{producto}'}</code> y <code className="bg-white px-1.5 py-0.5 rounded font-mono text-dulzura-pink font-bold">{'{precio}'}</code>.
              </p>
              <textarea
                rows={3}
                required
                value={formData.mensajePlantillaWhatsapp}
                onChange={(e) => setFormData({ ...formData, mensajePlantillaWhatsapp: e.target.value })}
                className="w-full p-3 rounded-xl border border-dulzura-rose/60 text-sm font-mono outline-none focus:border-dulzura-pink bg-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-8 py-3.5 rounded-2xl bg-dulzura-chocolate hover:bg-dulzura-darkChoco text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Save className="w-4 h-4 text-dulzura-pink" />
                <span>{updateMutation.isPending ? 'Guardando en Cloudinary...' : 'Guardar Cambios'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
};

export default DashboardContacto;
