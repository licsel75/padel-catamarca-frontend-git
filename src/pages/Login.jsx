import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorApi, setErrorApi] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      setErrorApi(null);
      
      // Hacemos la petición a nuestro Backend
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      // El backend nos devuelve { token, user }
      const { token, user } = response.data;

      // Guardamos la sesión en el AuthContext
      login(user, token);

      // Redirigimos al usuario a la tienda (o al panel de admin si es admin)
      if (user.rol === 'admin') {
        navigate('/admin'); // Lo crearemos después
      } else {
        navigate('/torneos'); 
      }

    } catch (err) {
      // Si el backend dice que las credenciales son inválidas (401)
      setErrorApi(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-primary">Bienvenido de nuevo</h2>
          <p className="text-gray-500 mt-2">Ingresá a tu cuenta para gestionar tus torneos.</p>
        </div>

        {errorApi && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm font-semibold text-center">
            {errorApi}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'El email es obligatorio',
                pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
              })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              {...register('password', { required: 'La contraseña es obligatoria' })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-primary font-bold text-lg py-3 rounded-lg mt-2 hover:bg-lime-500 transition-colors"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          ¿No tenés cuenta? <Link to="/registro" className="text-secondary font-bold hover:underline">Registrate acá</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;