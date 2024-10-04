import { useEffect, useState } from "react";
import { ProductGrid } from "../../../components/products/product-grid/ProductGrid";
import { ICategoriaUsuario, IProductoMostrar } from "../../../interfaces/orden_compra.interface";
import { useUserStore } from "../../../store/user/user";
import { obtenerProductosUsuario, validarOrdenUsuario } from "../../../actions/orden_compra/orden_compra";
import Swal from "sweetalert2";
import { useCartStore } from "../../../store/cart/cart-store";
import { ControlCategorias } from "../cart/ui/ControlCategorias";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import { useFilteredData } from "../../../hooks/useFilteredData";

export const OrdenesCompraPage = () => {

  const { codUsuario } = useParams();
  const [productos, setProductos] = useState<IProductoMostrar[]>([])
  const { setCategorias, setInfoUsuarioOrden } = useCartStore(state => state);
  const navigate = useNavigate()

  const session = useUserStore(state => state.user);
  const { search, setSearch, filteredData } = useFilteredData(productos);


  useEffect(() => {
    const usuarioId = codUsuario ? +codUsuario : session?.cod_usuario;
   
    if (usuarioId) {
      
      if (!codUsuario && session?.cod_perfil === 2) {
        navigate('/control-ordenes');
        return;
      }
      cargarProductosUSuario(usuarioId);
      validarOrden(usuarioId);
    }
  }, [session])

  const cargarProductosUSuario = async (codUsuario: number) => {
    try {

      let productosUsuario = await obtenerProductosUsuario(codUsuario)
      if (productosUsuario && productosUsuario.error === 0) {
        setProductos(productosUsuario.productos)
        setCategorias(productosUsuario.categorias)
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Error al consultar los productos para este usuario'
        })
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        text: 'Error al consultar los productos para este usuario'
      })
    }
  }

  const validarOrden = async (codUsuario: number) => {
    try {

      let ordenUsuario = await validarOrdenUsuario(codUsuario)
      if (ordenUsuario && ordenUsuario.error === 0) {
        if (ordenUsuario.existe === 1) {
          navigate('/resumen_orden/' + (codUsuario))
        }

        setInfoUsuarioOrden(ordenUsuario.usuario)
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Error al validar la orden de este usuario'
        })
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        text: 'Error al validar la orden de este usuario'
      })
    }
  }



  return (
    <>
      {
        (session?.cod_perfil == 2) &&
        <div className="w-100 mt-2 bg-orange-400 p-4">
          <p> Usted como coordinador gestionara la orden de ese usuario</p>
        </div>
      }

      <div className="grid grid-cols-[20%_1fr] h-screen">
        <div>
        <br />
        <TextField
                type="text"
                label="Buscar Producto"
                placeholder="Buscar..."
                className="border rounded p-2 my-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          <ControlCategorias />
        </div>
        <ProductGrid productos={filteredData} />
      </div>
    </>
  );
}