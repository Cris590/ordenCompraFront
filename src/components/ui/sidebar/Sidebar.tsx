import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  IoCloseOutline,
  IoLogOutOutline,
  IoTicketOutline,
  IoBarcode,
  IoBagCheck,
  IoCreateSharp,
  IoBusinessSharp,
  IoLibraryOutline,
  IoBicycle,
  IoClipboard,
  IoCreate,
  IoBusinessOutline,
  IoBagCheckSharp,
} from "react-icons/io5";
import { IconType } from "react-icons";
import { useUIStore } from "../../../store/ui/ui-store";
import { useUserStore } from "../../../store/user/user";
import { useCartStore } from "../../../store/cart/cart-store";

const iconMapping: { [key: string]: IconType } = {
  categorias: IoBarcode,
  "ordenes-compra": IoTicketOutline,
  productos: IoBagCheck,
  tallajes: IoCreateSharp,
  entidades: IoBusinessSharp,
  reportes: IoLibraryOutline,
  "guia-uso": IoBicycle,
  "solicitud-dotacion": IoCreate,
  "control-ordenes": IoClipboard,
  "info-entidad": IoBusinessOutline,
  "politicas": IoBagCheckSharp,
};

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const logOut = useUserStore((state) => state.logOut);
  const session = useUserStore((state) => state.user);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();
  const sidebarArray = useUserStore((state) => state.sidebarMenu);

  const handleLogOut = () => {
    logOut();
    clearCart();
    navigate("/auth/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        className={clsx(
          "fixed left-0 top-0 h-screen bg-white shadow-2xl transform transition-all duration-300 group",
          isSideMenuOpen
            ? "w-[350px] z-20" 
            : "w-[45px] hover:w-[350px] hover:z-20 z-10"
        )}
      >

        {/* Menu Items */}
        {session &&
          sidebarArray.map((menuItem, key) => {
            const IconComponent = iconMapping[menuItem.route];
            if (menuItem.visible === 1) {
              if(menuItem.route === "guia-uso"){
                return (
                    <a 
                      href={session.cod_perfil === 2 ? "/files/guia_coordinador.pdf":"/files/guia_usuario.pdf" }  
                      className="flex items-start mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                      download
                    >
                       {/* Centramos los íconos en el espacio */}
                      <div className="flex justify-start ">
                        {IconComponent && <IconComponent size={25} />} 
                      </div>
                      <span
                        className={clsx(
                          "ml-3 text-l text-start whitespace-nowrap overflow-hidden opacity-0", 
                          "group-hover:opacity-100 group-hover:ml-5 transition-all duration-300", 
                          isSideMenuOpen && "opacity-100 ml-5" 
                        )}
                      >
                        {menuItem.label}
                      </span>
                    </a>
                )
              }else{              
                return (
                  <Link
                    key={key}
                    to={menuItem.route}
                    className="flex items-start mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                    onClick={() => closeMenu()}
                  >
                    {/* Centramos los íconos en el espacio */}
                    <div className="flex justify-start ">
                      {IconComponent && <IconComponent size={25} />} 
                    </div>
                    <span
                      className={clsx(
                        "ml-3 text-l text-start whitespace-nowrap overflow-hidden opacity-0", 
                        "group-hover:opacity-100 group-hover:ml-5 transition-all duration-300", 
                        isSideMenuOpen && "opacity-100 ml-5" 
                      )}
                    >
                      {menuItem.label}
                    </span>
                  </Link>
                );
              }

            }
          })}

        {/* Line Separator */}
        <div className="w-full h-px bg-gray-200 my-10" />

        <button
          className="flex w-full items-start mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          onClick={handleLogOut}
        >
          {/* Centramos el ícono de salida también */}
          <div className="flex justify-start">
            <IoLogOutOutline size={25} /> {/* Tamaño constante del ícono */}
          </div>
          <span
            className={clsx(
              "ml-3 text-xl whitespace-nowrap overflow-hidden opacity-0", // Oculto por defecto
              "group-hover:opacity-100 group-hover:ml-5 transition-all duration-300", // Visible al hacer hover
              isSideMenuOpen && "opacity-100 ml-5" // Siempre visible cuando el menú está abierto manualmente
            )}
          >
            Salir
          </span>
        </button>
      </nav>

      {/* Main content */}
      <div className={clsx("flex-1 transition-all duration-300", isSideMenuOpen ? "ml-[350px]" : "ml-[80px]")}>
        {/* Aquí va el contenido de tu aplicación */}
      </div>
    </div>
  );
};
