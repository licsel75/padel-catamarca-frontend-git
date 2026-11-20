import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import api from '../services/api';
import { DEPARTAMENTOS_CATAMARCA } from '../constants/departamentos';

function ClubForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [errorApi, setErrorApi] = useState(null);
    const [cargando, setCargando] = useState(Boolean(id));

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (id) {
            const cargarClub = async () => {
                try {
                    const res = await api.get(`/clubes/${id}`);
                    const club = res.data;
                    setValue('nombre', club.nombre);
                    setValue('direccion', club.direccion);
                    setValue('telefono', club.telefono);
                    setValue('departamento', club.departamento || 'Capital');
                    setValue('servicios', club.servicios ? club.servicios.join(', ') : '');
                } catch (err) {
                    setErrorApi('Error al cargar los datos del club');
                } finally {
                    setCargando(false);
                }
            };
            cargarClub();
        }
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            setErrorApi(null);

            // Convertimos el string separado por comas en un array limpio
            const serviciosArray = data.servicios
                ? data.servicios.split(',').map((s) => s.trim()).filter(Boolean)
                : [];

            const payload = {
                nombre: data.nombre,
                direccion: data.direccion,
                departamento: data.departamento,
                telefono: data.telefono,
                servicios: serviciosArray,

            };

            if (id) {
                await api.put(`/clubes/${id}`, payload);
                alert('Club actualizado ✅');
            } else {
                await api.post('/clubes', payload);
                alert('Club creado con éxito 🏟️');
            }

            navigate('/admin');
        } catch (err) {
            setErrorApi(err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar el club');
        }
    };

    if (cargando) return <p className="text-center mt-10">Cargando datos del club... ⏳</p>;

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-primary mb-6">
                    {id ? 'Editar Club' : 'Registrar Nuevo Club'}
                </h2>

                {errorApi && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 font-medium">
                        {errorApi}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Nombre del Club *</label>
                        <input
                            type="text"
                            placeholder="Ej: Los Pinos Pádel"
                            {...register('nombre', { required: 'El nombre del club es obligatorio' })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Departamento *</label>
                        <select
                            {...register('departamento', { required: 'Seleccioná un departamento' })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white"
                        >
                            {DEPARTAMENTOS_CATAMARCA.map((dep) => (
                                <option key={dep} value={dep}>
                                    {dep}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Dirección *</label>
                        <input
                            type="text"
                            placeholder="Ej: Av. Belgrano 1250, Catamarca"
                            {...register('direccion', { required: 'La dirección es obligatoria' })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                        />
                        {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Teléfono / WhatsApp *</label>
                        <input
                            type="text"
                            placeholder="Ej: 3834123456"
                            {...register('telefono', { required: 'El teléfono es obligatorio' })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                        />
                        {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Servicios (separados por coma)</label>
                        <input
                            type="text"
                            placeholder="Ej: Canchas blindex, Cantina, Estacionamiento, Vestuarios"
                            {...register('servicios')}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-2/3 bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-lime-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : (id ? 'Guardar Cambios' : 'Crear Club')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClubForm;