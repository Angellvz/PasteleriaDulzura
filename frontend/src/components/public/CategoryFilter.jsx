import React from 'react';
import { Grid } from 'lucide-react';
import CategoryIcon from '../common/CategoryIcon';

const CategoryFilter = ({ categorias, categoriaSeleccionada, onSelectCategoria }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 my-8">
      {/* Botón Todas */}
      <button
        onClick={() => onSelectCategoria('')}
        className={`px-5 py-3 min-h-[44px] rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 ${
          categoriaSeleccionada === ''
            ? 'bg-dulzura-chocolate text-white shadow-lg ring-2 ring-dulzura-chocolate/20'
            : 'bg-white text-dulzura-chocolate border border-dulzura-rose/60 hover:bg-dulzura-rose/30 shadow-xs'
        }`}
      >
        <Grid className="w-4 h-4" />
        <span>Todas las Delicias</span>
      </button>

      {/* Botones de Categorías */}
      {categorias?.map((cat) => {
        const isSelected = categoriaSeleccionada === cat.slug || categoriaSeleccionada === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategoria(cat.slug)}
            className={`px-5 py-3 min-h-[44px] rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 ${
              isSelected
                ? 'bg-dulzura-chocolate text-white shadow-lg ring-2 ring-dulzura-chocolate/20'
                : 'bg-white text-dulzura-chocolate border border-dulzura-rose/60 hover:bg-dulzura-rose/30 shadow-xs'
            }`}
          >
            <CategoryIcon name={cat.icono || cat.slug} className={`w-4 h-4 ${isSelected ? 'text-dulzura-pink' : 'text-dulzura-chocolate/70'}`} />
            <span>{cat.nombre}</span>
            {cat._count?.productos !== undefined && (
              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-dulzura-rose text-dulzura-chocolate'}`}>
                {cat._count.productos}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
