import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Alert, Box, Card, CardContent, Divider, Snackbar, Typography } from '@mui/material';
import { IoCartOutline } from 'react-icons/io5';
import { BreadCrumbsBuscarCliente } from './components/breadcrumbs/BreadCrumbsBuscarCliente';
import { BonoRedencionSection } from './components/info-redencion-bono/BonoRedencionSection';
import { ProductosSection } from './components/productos/ProductosSection';
import { MedioPago, ProductoVenta } from '../../../../interfaces/pos.interface';
import { obtenerInfoProductoVenta, obtenerMediosPago } from '../../../../actions/pos/pos';
import { DescuentoSection } from './components/descuento/DescuentoSection';
import { ResumenSection } from './components/resumen/ResumenSection';
import { MediosPagoSection } from './components/mediosPago/MediosPagoSection';
import { IBonoDisponible } from '../../../../interfaces/entidad_bonos.interface';
import { obtenerBonosUsuarioRedencion, redimirBonosTienda } from '../../../../actions/entidad_bono/entidad_bono';
import Swal from 'sweetalert2';


const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

  const emptyPayment = (): MedioPago => ({
    id_metodo_pago:0,
    nombre:'',
    codigo:0,
    valor:0,
    necesita_codigo:''
  });



export const RedencionBonosTiendaPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const IVA = 0.19;
  const { codUsuarios } = location.state || {};

  // ============================================================
  // LOADING
  // ============================================================

  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);


  // ============================================================
  // INFORMACION REDENCION ENTIDAD
  // ============================================================
  const [documentoCliente, setDocumentoCliente] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [noContrato, setNoContrato] = useState("");
  const [entidad, setEntidad] = useState("");

  const [bonosUsuario, setBonosUsuario] = useState<IBonoDisponible[]>([]);

  // ============================================================
  // PRODUCTOS
  // ============================================================

  const [codigo, setCodigo] = useState("");
  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [buscandoProducto, setBuscandoProducto] = useState(false);

  const scannerRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // MENSAJES
  // ============================================================

  const [mensaje, setMensaje] = useState("");

  const [tipoMensaje, setTipoMensaje] = useState<
    "success" | "error" | "warning"
  >("success");

  // ============================================================
  // DESCUENTO
  // ============================================================

  const [usarDescuento, setUsarDescuento] = useState(false);
  const [descuento, setDescuento] = useState(0);

  // ============================================================
  // MEDIOS DE PAGO
  // ============================================================

  const [mediosPago, setMediosPago] = useState<MedioPago[]>([
    emptyPayment()
  ]);
  const [mediosPagoDisponibles, setMediosPagoDisponibles] = useState<MedioPago[]>([]);

  const [bonosSeleccionados, setBonosSeleccionados] = useState<IBonoDisponible[]>([]);

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

  const totalBonos = bonosSeleccionados.reduce(
    (total, bono) => total + Number(bono.valor || 0),
    0
  );

  const totalPagado = useMemo(
    () =>
      mediosPago.reduce(
        (total, medio) => total + Number(medio.valor || 0),
        0
      ) + totalBonos,
    [mediosPago, totalBonos]
  );
  const restante = Math.max(0, total - totalPagado);
  const excedente = Math.max(0, totalPagado - total);



  useEffect(() => {
    if (!codUsuarios) {
      navigate('/buscar_cliente_redencion', { replace: true });
    }
    console.log('codUSuarios ', codUsuarios)
    const codUsuariosRedencion = codUsuarios.split(',').map(Number);
    obtenerInformacionRedencion(codUsuariosRedencion)
    cargarMediosPago()
  }, [codUsuarios, navigate]);

  if (!codUsuarios) {
    return null;
  }


  const obtenerInformacionRedencion = async (codUsuarios: number[]) => {


    setOpenLoadingSpinner(true);

    try {
      const redencionInfo = await obtenerBonosUsuarioRedencion(codUsuarios);

      if (redencionInfo?.bonos.length == 0) {
        navigate('/buscar_cliente_redencion', { replace: true });
      }

      setBonosUsuario(redencionInfo?.bonos || [])
      setDocumentoCliente(redencionInfo?.infoCliente.documento || '')
      setNombreCliente(redencionInfo?.infoCliente.nombre || '')
      setNoContrato(redencionInfo?.infoCliente.no_contrato || '')
      setEntidad(redencionInfo?.infoCliente.entidad || '')


    } catch (error) {
      console.error(
        "Error buscando producto:",
        error
      );

      mostrarMensaje(
        "Ocurrió un error al obtener la info.",
        "error"
      );
      navigate('/buscar_cliente_redencion', { replace: true });
    } finally {
      setOpenLoadingSpinner(false);
    }
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
  // MEDIOS DE PAGO
  // ============================================================


  

  const cargarMediosPago = async () => {
          try {
              const response = await obtenerMediosPago();
              setMediosPagoDisponibles(response?.metodosPago || []);
          } catch (error) {
              console.error(
                  "Error cargando medios de pago:",
                  error
              );
          }
      };

  const agregarMedioPago = () => {
    const existeNuevoMedioPago = mediosPago.some((medio)=>medio.id_metodo_pago === 0)
    if(existeNuevoMedioPago) return

    setMediosPago((actuales) => [
      ...actuales,
      emptyPayment(),
    ]);

  };

  const eliminarMedioPago = (id: number) => {
    if(id === 0) return
    
    const nuevosMetodoPago = mediosPago.filter((medio) => medio.id_metodo_pago !== id)
    if(restante > 0){
      nuevosMetodoPago.push(emptyPayment())
    }
    setMediosPago(nuevosMetodoPago)
  };

  const actualizarMedioPago = (
    id: number,
    campo:
      | "id_metodo_pago"
      | "nombre"
      | "valor"
      | "codigo"
      | "codigo_transaccion"
      | "necesita_codigo",
    valor: string | number
  ) => {

    if(campo === 'id_metodo_pago'){
      const existeMedioPago = mediosPago.some((medio)=>medio.id_metodo_pago === valor)
      
      if(!existeMedioPago){
        const nuevoMetodoPagoSeleccionado = mediosPagoDisponibles.filter((medio)=>medio.id_metodo_pago===valor)
                                            .map((medio)=>({
                                               ...medio, 
                                               valor:0}))[0]
        setMediosPago((actuales)=>{

          return [
            ...actuales.filter((medio)=>medio.id_metodo_pago !== 0),
            nuevoMetodoPagoSeleccionado
          ]
        })
      }
    }else{
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
    }
  };

  const actualizarBonosSeleccionados = (bonos: IBonoDisponible[]) => {
    setBonosSeleccionados(bonos);
    if(bonosSeleccionados.length == 0){
      setMediosPago([emptyPayment()])
    }
  };

  const guardar = async () => {
    const codUsuariosRedencion = codUsuarios.split(',').map(Number);
    const payload = {
      bonos: bonosSeleccionados,
      cod_usuarios: codUsuariosRedencion,
      metodos_pago: mediosPago,
      productos: productos,
      subtotal,
      total,
      impuesto,
      total_pagado: totalPagado,
      cambio: excedente,
      descuento
    }

    console.log('Vamos a guardar ', payload)

    

    setOpenLoadingSpinner(true);
    
        try {
          let response = await redimirBonosTienda(payload);
    
    
          if (response?.error === 0) {
            await Swal.fire(response.msg);
            navigate('/buscar_cliente_redencion', { replace: true });
      
          } else {
            setOpenLoadingSpinner(false);
            await Swal.fire(response!.msg);
          }
    
        } catch (error) {
          setOpenLoadingSpinner(false);
    
          await Swal.fire({
            icon: "error",
            text: "Error al hacer la redención del bono, contacte al administrador.",
            confirmButtonText: "Aceptar",
          });
        }
  }

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
                Redencion de bonos
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

          <BreadCrumbsBuscarCliente />

          <BonoRedencionSection
            documento={documentoCliente}
            nombre_cliente={nombreCliente}
            no_contrato={noContrato}
            entidad={entidad}

          />

          {/* CONTENIDO PRINCIPAL */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_500px]">

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
                bonos={bonosUsuario}
                bonosSeleccionados={bonosSeleccionados}
                onActualizarBonos={actualizarBonosSeleccionados}

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

                mediosPagoDisponibles={mediosPagoDisponibles}
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