

import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { ISidebar, IUser } from '../../interfaces/user.interfaces';

interface State {
    user: IUser | null;
    token:string;
    loginUser: (user: IUser) => void;
    setToken:(token:string) => void;
    logOut:() => void;
    sidebarMenu: ISidebar[];
    fullFillMenu: (menu: ISidebar[]) => void;
}

export const useUserStore = create<State>()(
    persist(
        (set, get) => ({
            user: null,
            token:'',
            sidebarMenu: [],
            loginUser: (logedUser: IUser) => set({ user: logedUser }),
            setToken:(token:string) => set({ token }),
            logOut:() => set({ user:null , token:'', sidebarMenu:[]}),
            fullFillMenu: (menu: ISidebar[]) => set({ sidebarMenu: menu }),
        }),
        {
            name: "user",
        }
    ),
    

)