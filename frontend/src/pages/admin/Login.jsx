import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Cake, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usuario, password);
      navigate('/admin/productos');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dulzura-darkChoco flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-dulzura-pink flex items-center justify-center mx-auto shadow-lg">
            <Cake className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-dulzura-chocolate">
            Pastelería Dulzura
          </h1>
          <p className="text-xs text-dulzura-chocolate/60 uppercase tracking-widest font-semibold">
            Acceso al Panel de Administración
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dulzura-chocolate uppercase mb-1">
              Usuario
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dulzura-chocolate/40" />
              <input
                type="text"
                required
                placeholder="Ingresa tu usuario (ej. admin)"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-dulzura-rose/60 focus:border-dulzura-pink outline-none text-sm text-dulzura-chocolate"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dulzura-chocolate uppercase mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dulzura-chocolate/40" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-dulzura-rose/60 focus:border-dulzura-pink outline-none text-sm text-dulzura-chocolate"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-dulzura-chocolate hover:bg-dulzura-darkChoco text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Ingresar al Dashboard</span>
                <ArrowRight className="w-4 h-4 text-dulzura-pink" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
