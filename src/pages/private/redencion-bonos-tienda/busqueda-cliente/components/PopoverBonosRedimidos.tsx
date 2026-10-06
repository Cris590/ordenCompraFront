import {
    Button,
    Divider,
    Popover,
    Typography
} from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { IBonoEntregado } from '../../../../../interfaces/entidad_bonos.interface';
import { currencyFormat } from '../../../../../utils/currencyFormat';
import { formatDate } from '../../../../../utils/formatDate';

interface Props {
    bonosEntregados: IBonoEntregado[];
    redimido: boolean;
}

export const PopoverBonosRedimidos = ({bonosEntregados,redimido }: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const bonosAgrupados = Object.values(
        bonosEntregados.reduce((acc, bono) => {
            if (!acc[bono.codigo]) {
                acc[bono.codigo] = [];
            }

            acc[bono.codigo].push(bono);

            return acc;
        }, {} as Record<string, IBonoEntregado[]>)
    );

    return (
        <>
           <Button
                size="small"
                variant="outlined"
                color={redimido ? 'success' : 'primary'}
                onClick={handleClick}
                sx={{
                    minWidth: 'auto',
                    padding: '2px 8px',
                    fontSize: '12px',
                    lineHeight: 1.4,
                    textTransform: 'none',
                }}
            >
                {redimido ? 'Bonos redimidos' : 'Pendiente por redimir'}
            </Button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            >
                <div className="p-4 w-[500px] max-w-[90vw] max-h-[550px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <Typography variant="h6" fontWeight={600}>
                                Bonos
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {bonosAgrupados.length}{' '}
                                {bonosAgrupados.length === 1 ? 'bono' : 'bonos'}
                            </Typography>
                        </div>
                    </div>

                    <Divider className="mb-3" />

                    <div className="flex flex-col gap-3">
                        {bonosAgrupados.map((bono) => (
                            <div
                                key={bono[0].codigo}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                {/* CÓDIGO DEL BONO */}
                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                                    <span className="text-xs text-gray-500">
                                        Código del bono
                                    </span>

                                    <div className="font-semibold text-gray-800">
                                        {bono[0].codigo}
                                    </div>
                                </div>

                                {/* CADA PARTE DEL BONO */}
                                <div className="p-3 flex flex-col gap-3">
                                    {bono.map((parte) => (
                                        <div
                                            key={parte.cod_cargo_bonos_producto}
                                            className={`rounded-lg p-3 border ${parte.redimido
                                                    ? 'border-green-200 bg-green-50'
                                                    : 'border-yellow-200 bg-yellow-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    <span className="font-semibold text-gray-800">
                                                        {parte.producto_cargo}
                                                    </span>

                                                    <span className="text-sm text-gray-600 block">
                                                        {currencyFormat(parte.valor)}
                                                    </span>
                                                </div>

                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        parte.redimido
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {parte.redimido
                                                        ? 'Redimido'
                                                        : 'Pendiente por redimir'}
                                                </span>
                                            </div>

                                            {parte.redimido ? (
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-500 block">
                                                            Fecha
                                                        </span>

                                                        <span className="text-gray-800">
                                                            {formatDate(
                                                                parte.fecha_redimido
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <span className="text-gray-500 block">
                                                            Tienda
                                                        </span>

                                                        <span className="text-gray-800">
                                                            {parte.tienda}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <span className="text-gray-500 block">
                                                            Vendedor
                                                        </span>

                                                        <span className="text-gray-800">
                                                            {parte.nombre_vendedor}
                                                        </span>

                                                        <span className="text-xs text-gray-500 block">
                                                            {parte.cedula_vendedor}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <span className="text-gray-500 block">
                                                            Comentario
                                                        </span>

                                                        <span className="text-gray-800">
                                                            {parte.comentario_cierre}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-yellow-700">
                                                    Este bono aún no ha sido redimido.
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Popover>
        </>
    );
};