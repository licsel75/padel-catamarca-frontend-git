import { Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Torneos from './pages/Torneos';
// import Login from './pages/Login'; // Este lo creamos en el próximo paso

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="torneos" element={<Torneos />} />
        {/* Ruta 404 */}
        <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 - Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}
export default App;