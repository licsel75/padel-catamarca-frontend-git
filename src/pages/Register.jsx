import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import api from '../services/api';

function Register() {
    // Uso React Hook Form para manejar las validaciones y el estado del formulario sin re-renders innecesarios.
    // Extraigo "watch" para observar en tiempo real qué rol elige el usuario y comparar las contraseñas.
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            rol: 'jugador'
        }
    });

    const [errorApi, setErrorApi] = useState(null);
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const navigate = useNavigate();

    // Observo los valores actuales de "rol" y "password" mientras el usuario escribe o selecciona
    const rolSeleccionado = watch('rol');
    const passwordActual = watch('password');

    const onSubmit = async (data) => {
        try {
            setErrorApi(null);

            // Envío los datos al endpoint público de registro de mi Backend.
            // No mando "confirmarPassword" porque solo sirve para validar acá en el Frontend.
            await api.post('/auth/register', {
                nombre: data.nombre,
                email: data.email,
                password: data.password,
                rol: data.rol
            });

            // Muestro el mensaje de confirmación antes de redirigir al Login
            setRegistroExitoso(true);
            setTimeout(() => {
                navigate('/login');
            }, 2500);

        } catch (err) {
            // Si express-validator devuelve un array de errores o el controlador tira un mensaje, lo capturo acá
            const mensajeBackend =
                err.response?.data?.errores?.[0]?.msg ||
                err.response?.data?.error ||
                err.response?.data?.mensaje ||
                'Error al registrar el usuario';

            setErrorApi(mensajeBackend);
        }
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-surface px-4 py-10">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-black text-primary">Crear Cuenta</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Sumate al circuito de pádel de Catamarca
                    </p>
                </div>

                {/* Cartel de éxito tras crear la cuenta */}
                {registroExitoso && (
                    <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg mb-6 text-sm font-semibold text-center">
                        ✅ ¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...
                    </div>
                )}

                {/* Cartel de error si el email ya existe o falla una validación del Backend */}
                {errorApi && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm font-semibold text-center">
                        {errorApi}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* CAMPO NOMBRE */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre completo *</label>
                        <input
                            type="text"
                            {...register('nombre', {
                                required: 'El nombre es obligatorio',
                                minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' }
                            })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Ej: Juan Pérez"
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.nombre.message}</p>}
                    </div>

                    {/* CAMPO EMAIL */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'El email es obligatorio',
                                pattern: { value: /^\S+@\S+$/i, message: 'Ingresá un email válido' }
                            })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="tu@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
                    </div>

                    {/* SELECTOR DE ROL */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de cuenta *</label>
                        <select
                            {...register('rol')}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white font-medium"
                        >
                            <option value="jugador">🎾 Jugador (Ver torneos y guardar favoritos)</option>
                            <option value="profesor">🎓 Profesor de Pádel (Clases y clínicas)</option>
                            <option value="organizador">🏆 Organizador de Torneos</option>
                            <option value="dueño_club">🏟️ Dueño / Encargado de Club</option>
                        </select>

                        {/* Aviso dinámico cuando elige un rol que requiere aprobación del Admin */}
                        {['organizador', 'dueño_club', 'profesor'].includes(rolSeleccionado) && (
                            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-lg mt-2">
                                ℹ️ Por seguridad, las cuentas de <strong>Organizador</strong>, <strong>Dueño de Club</strong> o <strong>Profesor</strong> quedan pendientes hasta que un administrador las apruebe.
                            </p>
                        )}
                    </div>

                    {/* CAMPO CONTRASEÑA */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña *</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'La contraseña es obligatoria',
                                minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' }
                            })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Mínimo 6 caracteres"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password.message}</p>}
                    </div>

                    {/* CONFIRMAR CONTRASEÑA */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Repetir contraseña *</label>
                        <input
                            type="password"
                            {...register('confirmarPassword', {
                                required: 'Confirmá tu contraseña',
                                validate: (valor) => valor === passwordActual || 'Las contraseñas no coinciden'
                            })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="••••••••"
                        />
                        {errors.confirmarPassword && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">{errors.confirmarPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || registroExitoso}
                        className="w-full bg-secondary text-primary font-bold text-lg py-3 rounded-lg mt-2 hover:bg-lime-500 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Iniciá sesión acá
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;