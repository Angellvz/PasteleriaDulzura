import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, CheckCircle, PhoneCall, MapPin, Clock, Mail, MessageSquare } from 'lucide-react';

const DashboardContacto = () => {
  const queryClient = useQueryClient();
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

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
    }
  }, [contacto]);

  const updateMutation = useMutation({
    mutationFn: async (dataToSave) => {
      const payload = {
        telefonoWhatsapp: dataToSave.telefonoWhatsapp,
        direccion: dataToSave.direccion,
        horarios: dataToSave.horarios,
        emailContacto: dataToSave.emailContacto,
        mensajePlantillaWhatsapp: dataToSave.mensajePlantillaWhatsapp,
        redesSociales: {
          facebook: dataToSave.facebook,
          instagram: dataToSave.instagram
        }
      };
      return await api.put('/contacto', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-contacto']);
      queryClient.invalidateQueries(['contacto-header']);
      queryClient.invalidateQueries(['contacto-info']);
      queryClient.invalidateQueries(['public-contacto-widget']);
      setGuardadoExitoso(true);
      setTimeout(() => setGuardadoExitoso(false), 4000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <AdminLayout title="Configuración de Contacto & WhatsApp">
      <div className="max-w-4xl bg-white rounded-3xl p-8 border border-gray-200 shadow-xs space-y-6">
        
        <div className="border-b border-gray-100 pb-4">
          <h3 className="font-serif text-xl font-bold text-dulzura-chocolate">
            Datos de la Pastelería & Plantilla WhatsApp
          </h3>
          <p className="text-xs text-dulzura-chocolate/70 mt-1">
            Modifica el número de recepción de pedidos, la dirección física y el mensaje prellenado que verán tus clientes al hacer clic en "Pedir por WhatsApp".
          </p>
        </div>

        {guardadoExitoso && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Configuración actualizada correctamente.</span>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando datos de contacto...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
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
                <span>{updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
};

export default DashboardContacto;
