import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, X, Upload, FileText } from 'lucide-react';

const DashboardBlog = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    resumenCorto: '',
    contenido: '',
    autor: 'Pastelería Dulzura',
    imagenUrl: '',
    publicado: true
  });

  const { data: articulos = [], isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const res = await api.get('/blog');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (dataToSave) => {
      const fd = new FormData();
      fd.append('titulo', dataToSave.titulo);
      fd.append('resumenCorto', dataToSave.resumenCorto);
      fd.append('contenido', dataToSave.contenido);
      fd.append('autor', dataToSave.autor);
      fd.append('publicado', dataToSave.publicado);

      if (archivoImagen) {
        fd.append('imagen', archivoImagen);
      } else if (dataToSave.imagenUrl) {
        fd.append('imagenUrl', dataToSave.imagenUrl);
      }

      if (editingId) {
        return await api.put(`/blog/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        return await api.post('/blog', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-blog']);
      handleCloseModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-blog']);
    }
  });

  const handleOpenModal = (art = null) => {
    if (art) {
      setEditingId(art.id);
      setFormData({
        titulo: art.titulo,
        resumenCorto: art.resumenCorto,
        contenido: art.contenido,
        autor: art.autor || 'Pastelería Dulzura',
        imagenUrl: art.imagenUrl,
        publicado: art.publicado
      });
      setPreviewUrl(art.imagenUrl);
    } else {
      setEditingId(null);
      setFormData({
        titulo: '',
        resumenCorto: '',
        contenido: '',
        autor: 'Pastelería Dulzura',
        imagenUrl: '',
        publicado: true
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
    <AdminLayout title="Gestión de Artículos del Blog">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <p className="text-xs sm:text-sm text-dulzura-chocolate/70 break-words max-w-full">
          Publica artículos, consejos de reposteria e historias sobre el arte de la panadería.
        </p>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-dulzura-chocolate hover:bg-dulzura-darkChoco text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-dulzura-pink" />
          <span>Nuevo Artículo</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando artículos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-dulzura-chocolate min-w-[650px]">
              <thead className="bg-dulzura-warmGray text-xs uppercase font-bold text-dulzura-chocolate/70 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Artículo</th>
                  <th className="py-3.5 px-4">Autor</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articulos.map((art) => (
                  <tr key={art.id} className="hover:bg-dulzura-rose/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={art.imagenUrl} alt={art.titulo} className="w-14 h-10 rounded-lg object-cover border" />
                        <div>
                          <p className="font-bold text-dulzura-chocolate">{art.titulo}</p>
                          <p className="text-xs text-dulzura-chocolate/60 line-clamp-1">{art.resumenCorto}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold">{art.autor}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        art.publicado ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {art.publicado ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(art)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar artículo "${art.titulo}"?`)) {
                            deleteMutation.mutate(art.id);
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
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg font-bold text-dulzura-chocolate">
                {editingId ? 'Editar Artículo' : 'Nuevo Artículo'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Título del Artículo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Secretos para elegir la torta perfecta..."
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Resumen Corto (se muestra en las tarjetas)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Breve descripción del artículo..."
                  value={formData.resumenCorto}
                  onChange={(e) => setFormData({ ...formData, resumenCorto: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Contenido Completo del Artículo</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Escribe el contenido completo..."
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink font-sans"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Autor</label>
                  <input
                    type="text"
                    value={formData.autor}
                    onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Imagen Principal</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer border border-dashed border-gray-300 hover:border-dulzura-pink p-2 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-gray-600">
                      <Upload className="w-4 h-4 text-dulzura-pink" />
                      <span>Subir archivo</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold pt-2">
                <input
                  type="checkbox"
                  checked={formData.publicado}
                  onChange={(e) => setFormData({ ...formData, publicado: e.target.checked })}
                  className="w-4 h-4 text-dulzura-pink rounded"
                />
                <span>Publicar Artículo Inmediatamente</span>
              </label>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold">
                  Cancelar
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="w-1/2 py-2.5 rounded-xl bg-dulzura-chocolate text-white text-sm font-semibold">
                  Guardar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DashboardBlog;
