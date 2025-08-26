

import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { IInformacionBasicaEntidad } from '../../interfaces/entidad.interface';

interface State {
    entidad: IInformacionBasicaEntidad;
    setInfoEntidad: (entidad: IInformacionBasicaEntidad) => void;
    resetInfoEntidad: () => void
}

const entidadDefault: IInformacionBasicaEntidad = {
    nombre: '',
    activo: 0,
    nit: '',
    info_contrato: '',
    no_contrato: '',
    fecha_inicio: '',
    fecha_final: '',
    tipo_entrega_contrato: 0
}

export const useEntidadStore = create<State>()(
    persist(
        (set, get) => ({
            entidad: entidadDefault,
            setInfoEntidad: (entidad: IInformacionBasicaEntidad) => set({ entidad }),
            resetInfoEntidad: () => set({ entidad: entidadDefault })
        }),
        {
            name: "entidad",
        }
    ),
)