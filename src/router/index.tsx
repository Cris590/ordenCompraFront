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
// import { GuiaUso } from '../pages/private/guia-uso/GuiaUso';
import { PoliticasPage } from '../pages/private/politicas-devolucion/PoliticasPage';
import { CatalogoPage } from '../pages/private/catalogo/CatalogoPage';
import { ProductoVisualizacionPage } from '../pages/private/producto_visualizacion/ProductoVisualizacionPage';
import { DepositosPage } from '../pages/private/depositos/DepositosPage';
import { ClientesPage } from '../pages/private/clientes/ClientesPage';
import { ProveedoresPage } from '../pages/private/proveedores/ProveedoresPage';
import { UsuariosDotacionPage } from '../pages/private/usuarios-bonos-dotacion/UsuariosDotacionPage';
import { ReporteDotacionBonosPage } from '../pages/private/reporte-bonos-dotacion/ReporteDotacionBonos';
import { ControlAccesosPage } from '../pages/private/control-accesos/ControlAccesosPage';
import { EcaterogiasPage } from '../pages/private/ecommerce/e-categorias/EcaterogiasPage';
import { EproductosPage } from '../pages/private/ecommerce/e-productos/EproductosPage';
import { EinventariosPage } from '../pages/private/ecommerce/e-inventarios/EinventariosPage';
import { EtallajePage } from '../pages/private/ecommerce/e-tallaje/EtallajePage';
import { VentaPOSPage } from '../pages/private/ventas-pos/VentaPOSPage';
import { AdminVentasPosPage } from '../pages/private/admin-ventas-pos/AdminVentasPosPage';
import { ClientesPosPage } from '../pages/private/clientes-pos/ClientesPosPage';
import { RetomarVentaPosPage } from '../pages/private/retomar-venta-pos/RetomarVentaPosPage';
import { InventarioPosPage } from '../pages/private/inventario-pos/InventarioPosPage';
import { BuscarProductosPosPage } from '../pages/private/buscar-producto-pos/BuscarProductosPosPage';
import { TrasladoProductoPosPage } from '../pages/private/traslado-producto-pos/TrasladoProductoPosPage';
import { EntradaSalidaInventarioPage } from '../pages/private/entrada-salida-inventario/EntradaSalidaInventarioPage';


const AppRouter: React.FC = () => {
  const basename = process.env.PUBLIC_URL || '';  
  return (
    <Router basename={basename}>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Private routes with layout */}
        <Route path="/" element={<PanelLayout />}>
          <Route path="/control_accesos" element={<RouteGuard element={<ControlAccesosPage/>} />} />
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

          {/* RUTAS COORDINADOR BONOS */}
          <Route path="/usuarios_bonos_dotacion" element={<RouteGuard element={<UsuariosDotacionPage />} />} />
          <Route path="/reporte_bonos_dotacion" element={<RouteGuard element={<ReporteDotacionBonosPage />} />} />


          {/* RUTAS FABRICA */}
          <Route path="/depositos" element={<RouteGuard element={<DepositosPage />} />} />
          <Route path="/clientes" element={<RouteGuard element={<ClientesPage />} />} />
          <Route path="/proveedores" element={<RouteGuard element={<ProveedoresPage />} />} />

          {/* RUTAS POST */}
          <Route path="/crear_venta" element={<RouteGuard element={<VentaPOSPage />} />} />
          <Route path="/admin_ventas" element={<RouteGuard element={<AdminVentasPosPage />} />} />
          <Route path="/clientes_pos" element={<RouteGuard element={<ClientesPosPage />} />} />
          <Route path="/retomar_ventas" element={<RouteGuard element={<RetomarVentaPosPage />} />} />
          <Route path="/inventario_pos" element={<RouteGuard element={<InventarioPosPage />} />} />
          <Route path="/buscar_producto_pos" element={<RouteGuard element={<BuscarProductosPosPage />} />} />
          <Route path="/traslado_producto_pos" element={<RouteGuard element={<TrasladoProductoPosPage />} />} />
          <Route path="/retomar_venta/:idVenta" element={<RouteGuard element={<VentaPOSPage />} />} />
          <Route path="/in_out_inventarios" element={<RouteGuard element={<EntradaSalidaInventarioPage />} />} />
          
          
          
          {/* RUTAS E-COMMERCE */}
          <Route path="/e-categorias" element={<RouteGuard element={<EcaterogiasPage />} />} />
          <Route path="/e-productos" element={<RouteGuard element={<EproductosPage />} />} />
          <Route path="/e-inventarios" element={<RouteGuard element={<EinventariosPage />} />} />
          
          <Route path="/e-tallajes" element={<RouteGuard element={<EtallajePage />} />} />



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
