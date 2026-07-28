import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Image as ImageIcon,
  Check,
  X,
  Upload,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const DashboardProductos = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precioMayor: '',
    categoriaId: '',
    imagenUrl: '',
    disponible: true,
    destacado: false
  });

  // Fetch productos & categorias
  const { data: productos = [], isLoading } = useQuery({
    queryKey: ['admin-productos', busqueda],
    queryFn: async () => {
      const res = await api.get(`/productos?q=${encodeURIComponent(busqueda)}`);
      return res.data;
    }
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ['admin-categorias'],
    queryFn: async () => {
      const res = await api.get('/categorias');
      return res.data;
    }
  });

  // Save / Update mutation
  const saveMutation = useMutation({
    mutationFn: async (dataToSave) => {
      const fd = new FormData();
      fd.append('nombre', dataToSave.nombre);
      fd.append('descripcion', dataToSave.descripcion);
      fd.append('precio', dataToSave.precio);
      if (dataToSave.precioMayor) fd.append('precioMayor', dataToSave.precioMayor);
      fd.append('categoriaId', dataToSave.categoriaId);
      fd.append('disponible', dataToSave.disponible);
      fd.append('destacado', dataToSave.destacado);
      
      if (archivoImagen) {
        fd.append('imagen', archivoImagen);
      } else if (dataToSave.imagenUrl) {
        fd.append('imagenUrl', dataToSave.imagenUrl);
      }

      if (editingId) {
        return await api.put(`/productos/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        return await api.post('/productos', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-productos']);
      handleCloseModal();
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/productos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-productos']);
    }
  });

  // Quick Toggle Mutations
  const toggleDestacadoMutation = useMutation({
    mutationFn: async ({ id, nuevoDestacado }) => {
      const fd = new FormData();
      fd.append('destacado', nuevoDestacado);
      return await api.put(`/productos/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-productos']);
    }
  });

  const toggleDisponibleMutation = useMutation({
    mutationFn: async ({ id, nuevoDisponible }) => {
      const fd = new FormData();
      fd.append('disponible', nuevoDisponible);
      return await api.put(`/productos/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-productos']);
    }
  });

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditingId(prod.id);
      setFormData({
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio: prod.precio,
        precioMayor: prod.precioMayor || '',
        categoriaId: prod.categoriaId,
        imagenUrl: prod.imagenUrl,
        disponible: prod.disponible,
        destacado: prod.destacado
      });
      setPreviewUrl(prod.imagenUrl);
    } else {
      setEditingId(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        precioMayor: '',
        categoriaId: categorias[0]?.id || '',
        imagenUrl: '',
        disponible: true,
        destacado: false
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
    setPreviewUrl('');
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
    <AdminLayout title="Gestión de Productos">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-dulzura-pink outline-none text-sm bg-white"
          />
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-dulzura-chocolate hover:bg-dulzura-darkChoco text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4 text-dulzura-pink" />
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No hay productos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-dulzura-chocolate">
              <thead className="bg-dulzura-warmGray text-xs uppercase font-bold text-dulzura-chocolate/70 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Producto</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Precio Menor / Mayor</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-center">Destacado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-dulzura-rose/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imagenUrl}
                          alt={prod.nombre}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-dulzura-chocolate">{prod.nombre}</p>
                          <p className="text-xs text-dulzura-chocolate/60 line-clamp-1">{prod.descripcion}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-dulzura-rose/50 text-xs font-semibold">
                        {prod.categoria?.nombre || 'Sin cat'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold">S/ {prod.precio.toFixed(2)}</div>
                      {prod.precioMayor && (
                        <div className="text-xs text-emerald-700">Mayor: S/ {prod.precioMayor.toFixed(2)}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleDisponibleMutation.mutate({ id: prod.id, nuevoDisponible: !prod.disponible })}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          prod.disponible ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Haz clic para cambiar disponibilidad"
                      >
                        {prod.disponible ? 'Disponible' : 'Agotado'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleDestacadoMutation.mutate({ id: prod.id, nuevoDestacado: !prod.destacado })}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          prod.destacado 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Haz clic para destacar/quitar de portada"
                      >
                        {prod.destacado ? (
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" /> Sí
                          </span>
                        ) : (
                          'No'
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(prod)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar ${prod.nombre}?`)) {
                            deleteMutation.mutate(prod.id);
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        title="Eliminar"
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

      {/* Modal Crear / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-dulzura-chocolate">
                {editingId ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Categoría</label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink bg-white"
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Precio Mayor (opcional)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.precioMayor}
                    onChange={(e) => setFormData({ ...formData, precioMayor: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Descripción</label>
                <textarea
                  rows={3}
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                ></textarea>
              </div>

              {/* Subida física de Imagen (Multer) */}
              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Imagen del Producto</label>
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    />
                  )}
                  <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 hover:border-dulzura-pink p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-gray-600">
                    <Upload className="w-4 h-4 text-dulzura-pink" />
                    <span>Subir archivo desde PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="O ingresa una URL de imagen externa..."
                    value={formData.imagenUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imagenUrl: e.target.value });
                      setPreviewUrl(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.disponible}
                    onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                    className="w-4 h-4 text-dulzura-pink rounded focus:ring-dulzura-pink"
                  />
                  <span>Disponible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    className="w-4 h-4 text-dulzura-pink rounded focus:ring-dulzura-pink"
                  />
                  <span>Destacado en Home</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="w-1/2 py-3 rounded-xl bg-dulzura-chocolate text-white font-semibold text-sm shadow-md"
                >
                  {saveMutation.isPending ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default DashboardProductos;
