import { useState, useEffect } from 'react';
import { useGet } from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedOption, setSelectedOption] = useState('projects');
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const projectsUrl = 'https://oryonlabsdb-production.up.railway.app/api/admin/projects/full';
  const clientsUrl = 'https://oryonlabsdb-production.up.railway.app/api/clients';

  // SI NO ESTA AUTENTICADO REDIRIGIR A LOGIN
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Obtener proyectos completos
  const { data: rawProjects = [], loading: projectsLoading, error: projectsError } = useGet(projectsUrl, token);

  // Obtener clientes
  const { data: rawClients = [], loading: clientsLoading, error: clientsError } = useGet(clientsUrl, token);

  useEffect(() => {
    if (Array.isArray(rawProjects)) {
      setProjects(rawProjects);
    }
  }, [rawProjects]);

  useEffect(() => {
    if (Array.isArray(rawClients)) {
      setClients(rawClients);
    }
  }, [rawClients]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      activo: 'bg-green-100 text-green-700',
      pendiente: 'bg-yellow-100 text-yellow-700',
      completado: 'bg-blue-100 text-blue-700',
      cancelado: 'bg-red-100 text-red-700',
    };
    return statusStyles[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona proyectos y clientes de Oryon Labs</p>
        </div>

        {/* Tab Menu */}
        <div className="flex gap-2 mb-8">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedOption === 'projects'
                ? 'bg-cyan text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setSelectedOption('projects')}
          >
            Proyectos ({projects.length})
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedOption === 'clients'
                ? 'bg-cyan text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setSelectedOption('clients')}
          >
            Clientes ({clients.length})
          </button>
        </div>

        {/* Projects View */}
        {selectedOption === 'projects' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {projectsLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-cyan border-t-transparent rounded-full" />
              </div>
            )}

            {projectsError && (
              <div className="p-6 text-red-600">
                Error al cargar proyectos: {projectsError.message}
              </div>
            )}

            {!projectsLoading && !projectsError && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Proyecto</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Cliente</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Categoría</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          No hay proyectos registrados.
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-navy">{project.name}</div>
                            {project.description && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {project.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {project.client?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center bg-cyan-pale text-cyan-dark text-xs font-medium px-2.5 py-1 rounded-full">
                              {project.category?.replace(/_/g, ' ') || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadge(project.status)}`}>
                              {project.status || 'Pendiente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            {project.created_at
                              ? new Date(project.created_at).toLocaleDateString('es-ES')
                              : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Clients View */}
        {selectedOption === 'clients' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {clientsLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-cyan border-t-transparent rounded-full" />
              </div>
            )}

            {clientsError && (
              <div className="p-6 text-red-600">
                Error al cargar clientes: {clientsError.message}
              </div>
            )}

            {!clientsLoading && !clientsError && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Teléfono</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Empresa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          No hay clientes registrados.
                        </td>
                      </tr>
                    ) : (
                      clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-cyan/10 rounded-full flex items-center justify-center">
                                <span className="text-cyan font-medium text-sm">
                                  {client.name?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div className="font-medium text-navy">{client.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {client.email}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {client.phone}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {client.company || 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
