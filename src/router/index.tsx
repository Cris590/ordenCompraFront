import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PanelLayout } from '../components/layout/PanelLayout';
import { PageNotFound } from '../components/ui/not-found/PageNotFound';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminEntidad } from '../pages/private/admin-entidad/AdminEntidad';
import { CartPage } from '../pages/private/cart/CartPage';
import { CategoriasPage } from '../pages/private/categorias/CategoriasPage';
import EditarProducto from '../pages/private/editar-producto/EditarProducto';
import { EmptyPage } from '../pages/private/empty/EmptyPage';
import { EntidadesPage } from '../pages/private/entidades/EntidadesPage';
import { OrdenesCompraPage } from '../pages/private/ordenes-compra/OrdenesCompraPage';
import { ProductBySlugPage } from '../pages/private/producto/ProductBySlugPage';
import { ProductosPage } from '../pages/private/productos/ProductosPage';
import { TallajesPage } from '../pages/private/tallajes/TallajesPage';
import RouteGuard from './RouteGuard';
import { ResumenOrden } from '../pages/private/resumen-orden/ResumenOrden';
import { SolicitudesDotacion } from '../pages/private/solicitud-dotacion/SolicitudesDotacion';
import { InfoEntidadContrato } from '../pages/private/info-entidad/InfoEntidadContrato';
import { ControlOrdenes } from '../pages/private/control-ordenes/ControlOrdenes';
import { GuiaUso } from '../pages/private/guia-uso/GuiaUso';
import { PoliticasPage } from '../pages/private/politicas-devolucion/PoliticasPage';
import { CatalogoPage } from '../pages/private/catalogo/CatalogoPage';
import { ProductoVisualizacionPage } from '../pages/private/producto_visualizacion/ProductoVisualizacionPage';

const AppRouter: React.FC = () => {
  const basename = process.env.PUBLIC_URL || '';  
  return (
    <Router basename={basename}>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Private routes with layout */}
        <Route path="/" element={<PanelLayout />}>
          <Route path="/categorias" element={<RouteGuard element={<CategoriasPage />} />} />
          <Route path="/productos" element={<RouteGuard element={<ProductosPage />} />} />
          <Route path="/productos/editar-producto/:codProducto" element={<RouteGuard element={<EditarProducto />} />} />
          <Route path="/tallajes" element={<RouteGuard element={<TallajesPage />} />} />
          <Route path="/entidades" element={<RouteGuard element={<EntidadesPage />} />} />
          <Route path="/entidades/admin-entidad/:codEntidad" element={<RouteGuard element={<AdminEntidad />} />} />
          <Route path="/ordenes-compra/:codUsuario?" element={<RouteGuard element={<OrdenesCompraPage />} />} />
          <Route path="/empty" element={<RouteGuard element={<EmptyPage />} />} />
          <Route path="/cart" element={<RouteGuard element={<CartPage />} />} />
          <Route path="/producto/:codProducto" element={<RouteGuard element={<ProductBySlugPage />} />} />
          <Route path="/resumen_orden/:codUsuario" element={<RouteGuard element={<ResumenOrden />} />} />
          
          {/* <Route path="/guia-uso" element={<RouteGuard element={<GuiaUso />} />} /> */}

          <Route path="/solicitud-dotacion" element={<RouteGuard element={<SolicitudesDotacion />} />} />
          <Route path="/control-ordenes" element={<RouteGuard element={<ControlOrdenes />} />} />
          <Route path="/info-entidad" element={<RouteGuard element={<InfoEntidadContrato />} />} />
          <Route path="/politicas" element={<RouteGuard element={<PoliticasPage />} />} />

          <Route path="/catalogo" element={<RouteGuard element={<CatalogoPage />} />} />
          <Route path="/producto_visual/:codProducto" element={<RouteGuard element={<ProductoVisualizacionPage />} />} />

          <Route path="/404" element={<PageNotFound />} />
          <Route path="/*" element={<PageNotFound />} />
        </Route>

        {/* 404 Not Found route */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
