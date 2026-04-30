const apiUrl = process.env.REACT_APP_API_URL;

export const actionsSettings  = {
    backendRoutes:{
        obtenerCategorias:`${apiUrl}/categoria/obtener-todas`,
        obtenerCategoriasActivas:`${apiUrl}/categoria/obtener-activas`,
        obtenerCategoriaDetalle:`${apiUrl}/categoria/detalle-categoria`,
        crearCategoria:`${apiUrl}/categoria/crear-categoria`,
        actualizarCategoria:`${apiUrl}/categoria/editar-categoria`,
        productosPorCategoria:`${apiUrl}/categoria/productos-categoria`,

        

        obtenerProductos:`${apiUrl}/producto/obtener`,
        obtenerProductoDetalle:`${apiUrl}/producto/detalle`,
        obtenerInfoBasicaProducto:`${apiUrl}/producto/info_basica`,
        crearProducto:`${apiUrl}/producto/crear_producto`,
        editarProducto:`${apiUrl}/producto/editar_producto`,

        obtenerColoresProducto:`${apiUrl}/producto/obtener_colores_producto`,
        crearColorProducto:`${apiUrl}/producto/crear_color_producto`,
        editarColorProducto:`${apiUrl}/producto/editar_color_producto`,
        borrarColorProducto:`${apiUrl}/producto/borrar_color_producto`,
        obtenerTallasProducto:`${apiUrl}/producto/obtener_tallas`,
        

        obtenerImagenesColores:`${apiUrl}/producto/obtener_imagenes_colores`,
        subirImagen:`${apiUrl}/producto/cargar_imagen_producto`,
        borrarImagen:`${apiUrl}/producto/borrar_imagen_producto`,

        obtenerTallajes:`${apiUrl}/tallaje/obtener`,
        crearTallaje:`${apiUrl}/tallaje/crear-tallaje`,
        editarTallaje:`${apiUrl}/tallaje/editar-tallaje`,
        obtenerTallajeActivos:`${apiUrl}/tallaje/obtener-activas`,

        obtenerEntidades:`${apiUrl}/entidad/obtener`,
        crearEntidad:`${apiUrl}/entidad/crear`,
        obtenerInfoBasicaEntidad:`${apiUrl}/entidad/info_basica`,
        editarEntidad:`${apiUrl}/entidad/editar_entidad`,
        editarCargoEntidadProducto:`${apiUrl}/entidad/editar_cargo_bono`,
        cargarUsuariosEntidad:`${apiUrl}/entidad/cargar_usuarios`,
        obtenerUsuariosEntidad:`${apiUrl}/entidad/usuarios`,
        crearUsuarioEntidad:`${apiUrl}/entidad/crear_usuario_entidad`,
        actualizarUsuarioEntidad:`${apiUrl}/entidad/editar_usuario_entidad`,
        obtenerUsuarioCoordinador:`${apiUrl}/entidad/usuario_coordinador`,
        cargosEntidad:`${apiUrl}/entidad/cargos`,
        detalleCargoEntidad :`${apiUrl}/entidad/detalle_cargo`,
        detalleCargoBonoProducto :`${apiUrl}/entidad/detalle_cargo_bono_producto`,
        infoContrato :`${apiUrl}/entidad/info_contrato`,
        crearCargo:`${apiUrl}/entidad/crear_cargo`,
        editarCargo:`${apiUrl}/entidad/editar_cargo`,
        resumentProductosEntidad:`${apiUrl}/entidad/resumen_productos`,
        crearCargaBonoProducto:`${apiUrl}/entidad/crear_cargo_bono_producto`,

        consultarBonosFiltro:`${apiUrl}/entidad_bono/consultar_bonos`,
        consultarBonoProducto:`${apiUrl}/entidad_bono/consultar_bono_usuario`,
        redimirBonoEntrega:`${apiUrl}/entidad_bono/redimir_bono_entrega`,
       
        
        reporteBonosEntregados:`${apiUrl}/orden_compra/reporte_bonos_entregados`,
        validarOrdenUsuario:`${apiUrl}/orden_compra/validar_orden`,
        productosUsuario:`${apiUrl}/orden_compra/productos`,
        obtenerProductoDetalleCarro:`${apiUrl}/orden_compra/producto_detalle`,
        crearOrden:`${apiUrl}/orden_compra/crear`,
        obtenerUsuariosCoordinador:`${apiUrl}/orden_compra/usuarios_coordinador_entidad`,
        actualizarOrden:`${apiUrl}/orden_compra/actualizar`,

        obtenerSolicitudesPendientes:`${apiUrl}/solicitud_dotacion/ordenes_pendientes`,

        reporteGeneralEntidad:`${apiUrl}/reporte/reporte_general_entidad`,
        reporteComparativo:`${apiUrl}/reporte/reporte_comparativo`,
        bonosEntidad:`${apiUrl}/reporte/bonos_usuario`,

        usuariosAplicacion:`${apiUrl}/control_accesos/usuarios`,
        editarUsuarioAplicacion:`${apiUrl}/control_accesos/actualizar_usuario`,
        

        login:`${apiUrl}/users/authentication`,
    }
}