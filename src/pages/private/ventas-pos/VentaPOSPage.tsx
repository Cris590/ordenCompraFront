import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";
import { IoCartOutline } from "react-icons/io5";
import { Cliente, CrearVentaRequest, IVendedorCrmTienda, MedioPago, ProductoVenta } from "../../../interfaces/pos.interface";

import { ProductosSection } from "./components/productos/ProductosSection";
import LoadingSpinnerScreen from "../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import { VentaInfoSection } from "./components/venta/VentaInfoSection";
import { ResumenSection } from "./components/resumen/ResumenSection";
import { MediosPagoSection } from "./components/mediosPago/MediosPagoSection";
import { DescuentoSection } from "./components/descuento/DescuentoSection";
import { crearVentaPos, generarFacturaPdf, obtenerClientePorDocumento, obtenerInfoProductoVenta, obtenerVendedoresPorTiendaCrm } from "../../../actions/pos/pos";
import { useUserStore } from "../../../store/user/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const IVA = 0.19;

const emptyPayment = (): MedioPago => ({
  id_metodo_pago: Date.now() + Math.random(),
  nombre: '',
  valor: 0,
});

export const VentaPOSPage = () => {


  const navigate = useNavigate();
  // ============================================================
  // CLIENTE
  // ============================================================

  const [documento, setDocumento] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const documentoRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // VENDEDOR
  // ============================================================

  const [vendedores, setVendedores] = useState<IVendedorCrmTienda[]>([]);
  const [vendedor, setVendedor] = useState<IVendedorCrmTienda | null>(null);

  // ============================================================
  // PRODUCTOS
  // ============================================================

  const [codigo, setCodigo] = useState("");
  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [buscandoProducto, setBuscandoProducto] = useState(false);

  const scannerRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // DESCUENTO
  // ============================================================

  const [usarDescuento, setUsarDescuento] = useState(false);
  const [descuento, setDescuento] = useState(0);

  // ============================================================
  // MEDIOS DE PAGO
  // ============================================================

  const [mediosPago, setMediosPago] = useState<MedioPago[]>([
    emptyPayment(),
  ]);

  // ============================================================
  // LOADING
  // ============================================================

  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);

  // ============================================================
  // MENSAJES
  // ============================================================

  const [mensaje, setMensaje] = useState("");

  const [tipoMensaje, setTipoMensaje] = useState<
    "success" | "error" | "warning"
  >("success");

  // ============================================================
  // CALCULOS
  // ============================================================

  const subtotal = useMemo(
    () =>
      productos.reduce(
        (total, producto) =>
          total + producto.precio * producto.cantidad,
        0
      ),
    [productos]
  );

  const valorDescuento = usarDescuento ? Math.round(subtotal * (descuento / 100)) : 0;

  const total = Math.max(0, subtotal - valorDescuento);

  /**
   * Los precios de los productos ya incluyen IVA.
   * Por eso primero obtenemos el valor neto
   * y luego separamos el IVA del total.
   */
  const neto = Math.round(total / (1 + IVA));

  const impuesto = total - neto;

  const totalPagado = useMemo(
    () =>
      mediosPago.reduce(
        (total, medio) => total + Number(medio.valor || 0),
        0
      ),
    [mediosPago]
  );
  const restante = Math.max(0, total - totalPagado);
  const excedente = Math.max(0, totalPagado - total);

  // ============================================================
  // CARGAR VENDEDORES
  // ============================================================
  const session = useUserStore.getState().user;
  useEffect(() => {
    const cargarVendedores = async () => {
      setOpenLoadingSpinner(true);

      try {
        const resultado = await obtenerVendedoresPorTiendaCrm();

        setVendedores(resultado?.vendedores || []);

        if (session?.cod_usuario) {
          setVendedor(resultado?.vendedores.filter((vendedor) => vendedor.cod_usuario == session.cod_usuario)[0] || null);
        }
      } catch (error) {
        console.error("Error cargando vendedores:", error);

        mostrarMensaje(
          "No fue posible cargar los vendedores.",
          "error"
        );
      } finally {
        setOpenLoadingSpinner(false);
      }
    };

    cargarVendedores();
  }, []);

  // ============================================================
  // FOCUS INICIAL SCANNER
  // ============================================================

  useEffect(() => {
    // scannerRef.current?.focus();

    documentoRef.current?.focus();
  }, []);

  // ============================================================
  // MENSAJES
  // ============================================================

  const mostrarMensaje = (
    texto: string,
    tipo: "success" | "error" | "warning"
  ) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  // ============================================================
  // CLIENTE
  // ============================================================

  const handleBuscarCliente = async () => {
    const cedula = documento.trim();

    if (!cedula) {
      setCliente(null);
      return;
    }

    setOpenLoadingSpinner(true);

    try {
      const resultadoCliente = await obtenerClientePorDocumento(cedula);

      if (!resultadoCliente?.error && resultadoCliente!.cliente.length > 0) {
        setCliente(resultadoCliente!.cliente[0]);
        scannerRef.current?.focus();
        return;
      }

      setCliente(null);

      mostrarMensaje(
        "No se encontró un cliente con esa cédula.",
        "warning"
      );
    } catch (error) {
      console.error("Error buscando cliente:", error);

      setCliente(null);

      mostrarMensaje(
        "Ocurrió un error al consultar el cliente.",
        "error"
      );
    } finally {
      setOpenLoadingSpinner(false);
    }
  };

  const handleCrearCliente = () => {
    mostrarMensaje(
      "Aquí puedes abrir tu formulario de creación de cliente.",
      "success"
    );
  };

  // ============================================================
  // VENDEDOR
  // ============================================================

  const handleCambiarVendedor = (vendedorId: number) => {
    const vendedorSeleccionado =
      vendedores.find(
        (item) => item.id_usuario_crm === vendedorId
      ) ?? null;

    setVendedor(vendedorSeleccionado);
  };

  // ============================================================
  // PRODUCTOS
  // ============================================================

  const procesarCodigoEscaneado = async (valor: string) => {
    const codigoEscaneado = valor.replace(/\D/g, "");
    if (codigoEscaneado.length !== 14) {
      return;
    }

    setBuscandoProducto(true);

    try {
      const productoResponse = await obtenerInfoProductoVenta(codigoEscaneado);

      if (!productoResponse?.producto) {
        mostrarMensaje(
          `El código ${codigoEscaneado} no existe.`,
          "error"
        );

        setCodigo("");
        scannerRef.current?.focus();

        return;
      }

      setProductos((actuales) => {
        const existente = actuales.find((p) => p.id === productoResponse.producto.id);

        if (existente) {
          return actuales.map((p) =>
            p.id === productoResponse.producto.id
              ? {
                ...p,
                cantidad: p.cantidad + 1,
              }
              : p
          );
        }

        return [
          ...actuales,
          {
            ...productoResponse.producto,
            cantidad: 1,
          },
        ];
      });

      mostrarMensaje(
        `${productoResponse.producto.nombre} agregado a la venta.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Error buscando producto:",
        error
      );

      mostrarMensaje(
        "Ocurrió un error al consultar el producto.",
        "error"
      );
    } finally {
      setBuscandoProducto(false);

      setCodigo("");

      setTimeout(() => {
        scannerRef.current?.focus();
      }, 0);
    }
  };

  const handleCodigoProductoChange = async (valor: string) => {
    const codigoLimpio = valor.replace(/\D/g, "").slice(0, 14);
    setCodigo(codigoLimpio);
    if (codigoLimpio.length === 14) {
      await procesarCodigoEscaneado(codigoLimpio);
    }
  };

  const cambiarCantidad = (productoId: number, delta: number) => {
    setProductos((actuales) =>
      actuales.map((producto) => {
        if (producto.id !== productoId) {
          return producto;
        }

        const nuevaCantidad = producto.cantidad + delta;

        if (nuevaCantidad <= 0) {
          return null;
        }

        // if (nuevaCantidad >producto.stock) {
        //   mostrarMensaje(
        //     `Stock máximo disponible: ${producto.stock}.`,
        //     "warning"
        //   );

        //   return producto;
        // }

        return {
          ...producto,
          cantidad: nuevaCantidad,
        };
      })
        .filter(Boolean) as ProductoVenta[]
    );
  };

  const eliminarProducto = (productoId: number) => {
    setProductos((actuales) =>
      actuales.filter(
        (producto) =>
          producto.id !== productoId
      )
    );
  };

  // ============================================================
  // MEDIOS DE PAGO
  // ============================================================

  const agregarMedioPago = () => {
    setMediosPago((actuales) => [
      ...actuales,
      emptyPayment(),
    ]);
  };

  const eliminarMedioPago = (id: number) => {
    setMediosPago((actuales) =>
      actuales.length === 1
        ? actuales
        : actuales.filter(
          (medio) => medio.id_metodo_pago !== id
        )
    );
  };

  const actualizarMedioPago = (
    id: number,
    campo: "nombre" | "valor",
    valor: string | number
  ) => {
    setMediosPago((actuales) =>
      actuales.map((medio) =>
        medio.id_metodo_pago === id
          ? {
            ...medio,
            [campo]: valor,
          }
          : medio
      )
    );
  };

  // ============================================================
  // GUARDAR
  // ============================================================

  const guardar = async () => {
    if (!cliente) {
      mostrarMensaje(
        "Debes seleccionar un cliente.",
        "warning"
      );
      return;
    }

    if (productos.length === 0) {
      mostrarMensaje(
        "Debes agregar al menos un producto.",
        "warning"
      );
      return;
    }

    const costoTotal = productos.reduce(
      (total, producto) => total + producto.costo * producto.cantidad,
      0
    );

    const payload: CrearVentaRequest = {
      clienteId: cliente.id,

      vendedorId: vendedor?.id_usuario_crm || 0,

      productos: productos.map((producto) => ({
        id: producto.id,
        descripcion: producto.nombre,
        cantidad: producto.cantidad,
        stock: producto.stock - producto.cantidad,
        precio: producto.precio,
        total: producto.precio * producto.cantidad,
      })),

      descuento: usarDescuento ? descuento : 0,
      neto,
      impuesto,
      total,
      costos: costoTotal,

      pagos: mediosPago.map((medio) => ({
        metodo_pago: medio.nombre,
        valor: Number(medio.valor || 0),
      })),

      deuda: restante,
    };
    setOpenLoadingSpinner(true);

    try {
      const response = await crearVentaPos(payload);

      setOpenLoadingSpinner(false);

      if (response?.error === 0) {
        generarFacturaPdf(response.ventaId)
        await Swal.fire(
          response.msg
        );

        navigate("/admin_ventas");
      } else {
        await Swal.fire(response!.msg);
      }

    } catch (error) {
      setOpenLoadingSpinner(false);

      await Swal.fire({
        icon: "error",
        text: "Error al guardar la venta, contacte al administrador.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <LoadingSpinnerScreen open={openLoadingSpinner} />

      <Box className="min-h-screen bg-slate-100 p-4 md:p-6">
        <div className="mx-auto max-w-[1600px]">

          {/* HEADER */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <Typography
                variant="h5"
                fontWeight={700}
              >
                Nueva venta
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                POS · Registro de venta
              </Typography>
            </div>

            <IoCartOutline size={38} />
          </div>

          <VentaInfoSection
            documentoRef={documentoRef}
            documento={documento}
            cliente={cliente}
            vendedores={vendedores}
            vendedor={vendedor}
            onDocumentoChange={setDocumento}
            onDocumentoBlur={handleBuscarCliente}
            onCrearCliente={handleCrearCliente}
            onVendedorChange={handleCambiarVendedor}
          />

          {/* CONTENIDO PRINCIPAL */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">

            {/* ================================================= */}
            {/* IZQUIERDA - PRODUCTOS */}
            {/* ================================================= */}

            <Card>
              <CardContent>
                <ProductosSection
                  codigo={codigo}
                  productos={productos}
                  buscandoProducto={buscandoProducto}
                  scannerRef={scannerRef}
                  onCodigoChange={handleCodigoProductoChange}
                  onCambiarCantidad={cambiarCantidad}
                  onEliminarProducto={eliminarProducto}
                  formatMoney={formatMoney}
                />

                <Divider className="my-5" />

                {/* DESCUENTO */}
                <DescuentoSection
                  usarDescuento={usarDescuento}
                  descuento={descuento}
                  onUsarDescuentoChange={setUsarDescuento}
                  onDescuentoChange={setDescuento}
                />
              </CardContent>
            </Card>

            {/* ================================================= */}
            {/* DERECHA */}
            {/* ================================================= */}

            <div className="space-y-4">

              {/* RESUMEN */}
              <ResumenSection
                subtotal={subtotal}
                valorDescuento={valorDescuento}
                total={total}
                neto={neto}
                impuesto={impuesto}
                formatMoney={formatMoney}
              />

              {/* MEDIOS DE PAGO */}
              <MediosPagoSection
                mediosPago={mediosPago}
                totalPagado={totalPagado}
                restante={restante}
                excedente={excedente}
                onAgregarMedioPago={agregarMedioPago}
                onEliminarMedioPago={eliminarMedioPago}
                onActualizarMedioPago={actualizarMedioPago}
                onGuardar={guardar}
                formatMoney={formatMoney}
                productosLength={productos.length}
              />


            </div>
          </div>
        </div>

        {/* MENSAJES */}
        <Snackbar
          open={Boolean(mensaje)}
          autoHideDuration={5000}
          onClose={() => setMensaje("")}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            severity={tipoMensaje}
            variant="filled"
            onClose={() => setMensaje("")}
          >
            {mensaje}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};