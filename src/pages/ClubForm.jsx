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
  const [esAdmin, setEsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  // Verifico si el usuario actual es administrador (revisando localStorage, JWT o backend)
  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const clave = localStorage.key(i);
          const valor = localStorage.getItem(clave);
          if (valor && valor.includes('"admin"')) {
            setEsAdmin(true);
            return;
          }
          // También reviso si el valor es un JWT que trae rol: "admin" en su payload
          if (valor && valor.split('.').length === 3) {
            try {
              const payload = JSON.parse(atob(valor.split('.')[1]));
              if (payload?.rol === 'admin') {
                setEsAdmin(true);
                return;
              }
            } catch {
              // No es un JWT válido, continuo buscando
            }
          }
        }

        const res = await api.get('/auth/me').catch(() => api.get('/users/perfil'));
        if (res?.data?.rol === 'admin' || res?.data?.user?.rol === 'admin') {
          setEsAdmin(true);
        }
      } catch {
        setEsAdmin(false);
      }
    };

    verificarAdmin();
  }, []);

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
          setValue('ubicacionMaps', club.ubicacionMaps || '');
          setValue('sitioWeb', club.sitioWeb || '');
          setValue('instagram', club.instagram || '');
          setValue('facebook', club.facebook || '');
          setValue('x', club.x || '');
          setValue('esSponsor', Boolean(club.esSponsor));
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

      const serviciosArray = data.servicios
        ? data.servicios.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        nombre: data.nombre,
        direccion: data.direccion,
        departamento: data.departamento,
        telefono: data.telefono,
        servicios: serviciosArray,
        ubicacionMaps: data.ubicacionMaps?.trim() || '',
        sitioWeb: data.sitioWeb?.trim() || '',
        instagram: data.instagram?.trim() || '',
        facebook: data.facebook?.trim() || '',
        x: data.x?.trim() || '',
        ...(esAdmin ? { esSponsor: Boolean(data.esSponsor) } : {})
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
          {/* OPCIÓN EXCLUSIVA ADMIN: MARCAR COMO SPONSOR */}
          {esAdmin && (
            <label className="flex items-center justify-between gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
              <div>
                <span className="block text-sm font-extrabold text-amber-900">
                  ⭐ Club Sponsor / Auspiciante Oficial
                </span>
                <span className="block text-xs text-amber-700">
                  Destaca este club primero en el listado y muestra su sello de patrocinador oficial.
                </span>
              </div>
              <input
                type="checkbox"
                {...register('esSponsor')}
                className="w-5 h-5 accent-amber-500 cursor-pointer shrink-0"
              />
            </label>
          )}

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

          {/* SECCIÓN OPCIONAL: UBICACIÓN Y REDES SOCIALES */}
          <div className="pt-4 mt-2 border-t border-gray-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-primary">Ubicación y Redes Sociales (Opcional)</h3>
              <p className="text-xs text-gray-500">
                Completá los enlaces que tenga el club para mostrarlos en su tarjeta y ficha pública.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">📍 Link de Google Maps</label>
              <input
                type="text"
                placeholder="Ej: https://maps.app.goo.gl/..."
                {...register('ubicacionMaps')}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">📸 Instagram</label>
                <input
                  type="text"
                  placeholder="Ej: @ilpadel o https://instagram.com/..."
                  {...register('instagram')}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">📘 Facebook</label>
                <input
                  type="text"
                  placeholder="Ej: https://facebook.com/..."
                  {...register('facebook')}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">✖️ X (Twitter)</label>
                <input
                  type="text"
                  placeholder="Ej: @ilpadel o https://x.com/..."
                  {...register('x')}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">🌐 Sitio Web / Reservas</label>
                <input
                  type="text"
                  placeholder="Ej: https://alquilatucancha.com/..."
                  {...register('sitioWeb')}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-lime-500 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Guardando...' : id ? 'Guardar Cambios' : 'Crear Club'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClubForm;