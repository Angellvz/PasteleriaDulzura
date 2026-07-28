import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, X, Upload, Sparkles } from 'lucide-react';

const DashboardOfertas = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descripcionCorta: '',
    porcentajeDescuento: '',
    precioOferta: '',
    imagenUrl: '',
    activo: true
  });

  const { data: ofertas = [], isLoading } = useQuery({
    queryKey: ['admin-ofertas'],
    queryFn: async () => {
      const res = await api.get('/ofertas');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (dataToSave) => {
      const fd = new FormData();
      fd.append('titulo', dataToSave.titulo);
      fd.append('descripcionCorta', dataToSave.descripcionCorta);
      if (dataToSave.porcentajeDescuento) fd.append('porcentajeDescuento', dataToSave.porcentajeDescuento);
      if (dataToSave.precioOferta) fd.append('precioOferta', dataToSave.precioOferta);
      fd.append('activo', dataToSave.activo);

      if (archivoImagen) {
        fd.append('imagen', archivoImagen);
      } else if (dataToSave.imagenUrl) {
        fd.append('imagenUrl', dataToSave.imagenUrl);
      }

      if (editingId) {
        return await api.put(`/ofertas/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        return await api.post('/ofertas', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-ofertas']);
      handleCloseModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/ofertas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-ofertas']);
    }
  });

  const handleOpenModal = (oferta = null) => {
    if (oferta) {
      setEditingId(oferta.id);
      setFormData({
        titulo: oferta.titulo,
        descripcionCorta: oferta.descripcionCorta,
        porcentajeDescuento: oferta.porcentajeDescuento || '',
        precioOferta: oferta.precioOferta || '',
        imagenUrl: oferta.imagenUrl,
        activo: oferta.activo
      });
      setPreviewUrl(oferta.imagenUrl);
    } else {
      setEditingId(null);
      setFormData({
        titulo: '',
        descripcionCorta: '',
        porcentajeDescuento: '',
        precioOferta: '',
        imagenUrl: '',
        activo: true
      });
      setPreviewUrl('');
    }
    setArchivoImagen(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setArchivoImagen(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <AdminLayout title="Gestión de Ofertas Destacadas">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-dulzura-chocolate/70">
          Crea ofertas y promociones especiales que se mostrarán en el carrusel principal del inicio.
        </p>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-dulzura-chocolate hover:bg-dulzura-darkChoco text-white font-semibold text-sm flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4 text-dulzura-pink" />
          <span>Nueva Oferta</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando ofertas...</div>
        ) : (
          <table className="w-full text-left text-sm text-dulzura-chocolate">
            <thead className="bg-dulzura-warmGray text-xs uppercase font-bold text-dulzura-chocolate/70 border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Oferta</th>
                <th className="py-3.5 px-4">Descuento / Precio</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ofertas.map((of) => (
                <tr key={of.id} className="hover:bg-dulzura-rose/20">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={of.imagenUrl} alt={of.titulo} className="w-14 h-10 rounded-lg object-cover border" />
                      <div>
                        <p className="font-bold text-dulzura-chocolate">{of.titulo}</p>
                        <p className="text-xs text-dulzura-chocolate/60">{of.descripcionCorta}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {of.porcentajeDescuento && (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold mr-2">
                        -{of.porcentajeDescuento}% OFF
                      </span>
                    )}
                    {of.precioOferta && (
                      <span className="font-serif font-bold text-dulzura-chocolate">S/ {of.precioOferta.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      of.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {of.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(of)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar oferta "${of.titulo}"?`)) {
                          deleteMutation.mutate(of.id);
                        }
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg font-bold text-dulzura-chocolate">
                {editingId ? 'Editar Oferta' : 'Nueva Oferta'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Título de la Oferta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Combo Fin de Semana Dulce"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Resumen Corto</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej. Lleva 1 Torta Grande + 1/2 docena de alfajores con 20% OFF"
                  value={formData.descripcionCorta}
                  onChange={(e) => setFormData({ ...formData, descripcionCorta: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">% Descuento (opcional)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="Ej. 20"
                    value={formData.porcentajeDescuento}
                    onChange={(e) => setFormData({ ...formData, porcentajeDescuento: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Precio Oferta S/ (opcional)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej. 64.00"
                    value={formData.precioOferta}
                    onChange={(e) => setFormData({ ...formData, precioOferta: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Imagen de Banner</label>
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-16 h-12 rounded-lg object-cover border" />
                  )}
                  <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 hover:border-dulzura-pink p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-gray-600">
                    <Upload className="w-4 h-4 text-dulzura-pink" />
                    <span>Subir archivo</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold pt-2">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 text-dulzura-pink rounded"
                />
                <span>Oferta Activa</span>
              </label>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">
                  Cancelar
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="w-1/2 py-2.5 rounded-xl bg-dulzura-chocolate text-white text-sm font-semibold">
                  Guardar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DashboardOfertas;
