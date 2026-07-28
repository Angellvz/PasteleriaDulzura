import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, X, Tags } from 'lucide-react';
import CategoryIcon, { ICON_OPTIONS } from '../../components/common/CategoryIcon';

const DashboardCategorias = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    icono: 'Cake',
    orden: 0,
    activo: true
  });

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['admin-categorias'],
    queryFn: async () => {
      const res = await api.get('/categorias');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (dataToSave) => {
      if (editingId) {
        return await api.put(`/categorias/${editingId}`, dataToSave);
      } else {
        return await api.post('/categorias', dataToSave);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categorias']);
      handleCloseModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/categorias/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categorias']);
    }
  });

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingId(cat.id);
      setFormData({
        nombre: cat.nombre,
        icono: cat.icono || 'Cake',
        orden: cat.orden,
        activo: cat.activo
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre: '',
        icono: 'Cake',
        orden: categorias.length + 1,
        activo: true
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <AdminLayout title="Gestión de Categorías">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-dulzura-chocolate/70">
          Organiza las secciones del catálogo (ej. Tortas, Postres, Bocaditos por mayor, Panes).
        </p>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-dulzura-chocolate hover:bg-dulzura-darkChoco text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 text-dulzura-pink" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando categorías...</div>
        ) : (
          <table className="w-full text-left text-sm text-dulzura-chocolate">
            <thead className="bg-dulzura-warmGray text-xs uppercase font-bold text-dulzura-chocolate/70 border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Orden</th>
                <th className="py-3.5 px-4">Ícono</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4 text-center">Cant. Productos</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categorias.map((cat) => (
                <tr key={cat.id} className="hover:bg-dulzura-rose/20 transition-colors">
                  <td className="py-3 px-4 font-bold text-dulzura-chocolate/60">#{cat.orden}</td>
                  <td className="py-3 px-4">
                    <div className="w-9 h-9 rounded-xl bg-dulzura-pink/20 text-dulzura-chocolate flex items-center justify-center shadow-xs">
                      <CategoryIcon name={cat.icono} className="w-5 h-5" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-dulzura-chocolate">{cat.nombre}</td>
                  <td className="py-3 px-4 text-xs font-mono text-gray-500">{cat.slug}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 font-semibold text-xs">
                      {cat._count?.productos ?? 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      cat.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {cat.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(cat)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) {
                          deleteMutation.mutate(cat.id);
                        }
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg font-bold text-dulzura-chocolate">
                {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
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
                  placeholder="Ej. Tortas Especiales"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Ícono Representativo</label>
                <div className="grid grid-cols-5 gap-2 p-2 border border-gray-200 rounded-xl bg-gray-50 max-h-36 overflow-y-auto">
                  {ICON_OPTIONS.map((opt) => {
                    const SelectedIcon = opt.Icon;
                    const isSelected = formData.icono === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, icono: opt.id })}
                        title={opt.label}
                        className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected 
                            ? 'bg-dulzura-chocolate text-white shadow-md scale-105' 
                            : 'bg-white text-dulzura-chocolate border border-gray-100 hover:bg-dulzura-pink/20'
                        }`}
                      >
                        <SelectedIcon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dulzura-chocolate mb-1">Orden de despliegue</label>
                <input
                  type="number"
                  required
                  value={formData.orden}
                  onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-dulzura-pink"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold pt-2">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 text-dulzura-pink rounded"
                />
                <span>Categoría Activa</span>
              </label>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="w-1/2 py-2.5 rounded-xl bg-dulzura-chocolate text-white text-sm font-semibold hover:bg-dulzura-darkChoco transition-colors shadow-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DashboardCategorias;
