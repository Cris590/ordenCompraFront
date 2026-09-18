import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import { FiltroBusquedaPedidosEcommerce } from '../../../../interfaces/ecommerce.interface';
import { IoChevronDown } from 'react-icons/io5';

interface Props {
    filtros: FiltroBusquedaPedidosEcommerce;
    onChange: (filtros: FiltroBusquedaPedidosEcommerce) => void;
    mostrarEstadosFinales: boolean;
}

export const PedidosFiltros = ({
    filtros,
    onChange,
    mostrarEstadosFinales
}: Props) => {

    const [documento, setDocumento] = useState(filtros.documento || '');
    const [numeroPedido, setNumeroPedido] = useState(filtros.numeroPedido || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (documento !== filtros.documento) {
                onChange({
                    ...filtros,
                    documento: documento || undefined
                });
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [documento]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (numeroPedido !== filtros.numeroPedido) {
                onChange({
                    ...filtros,
                    numeroPedido: numeroPedido || undefined
                });
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [numeroPedido]);

    const handleChange = (
        campo: keyof FiltroBusquedaPedidosEcommerce,
        valor: any
    ) => {
        onChange({
            ...filtros,
            [campo]: valor
        });
    };

    const limpiarFiltros = () => {
        setDocumento('');
        setNumeroPedido('');

        onChange({
            estadoFinal: mostrarEstadosFinales
        });
    };

    return (
        <Accordion
            defaultExpanded
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px !important',
                mb: 2,
                marginRight:6,
                '&:before': {
                    display: 'none'
                }
            }}
        >
            <AccordionSummary
                expandIcon={<IoChevronDown />}
                sx={{
                    minHeight: 52,

                    '& .MuiAccordionSummary-content': {
                        margin: '12px 0'
                    }
                }}
            >
                <Typography fontWeight={600}>
                    Filtros de búsqueda
                </Typography>
            </AccordionSummary>

            <AccordionDetails>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

                    <TextField
                        label="Documento"
                        size="small"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                    />

                    <TextField
                        label="Número de pedido"
                        size="small"
                        value={numeroPedido}
                        onChange={(e) => setNumeroPedido(e.target.value)}
                    />

                    <TextField
                        label="Estado"
                        size="small"
                        select
                        value={filtros.codEstadoPedido || ''}
                        onChange={(e) =>
                            handleChange(
                                'codEstadoPedido',
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                    >
                        <MenuItem value="">
                            Todos
                        </MenuItem>

                        {/* Estados */}
                    </TextField>

                    <TextField
                        label="Fecha desde"
                        type="date"
                        size="small"
                        value={filtros.fechaDesde || ''}
                        onChange={(e) =>
                            handleChange(
                                'fechaDesde',
                                e.target.value
                            )
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />

                    <TextField
                        label="Fecha hasta"
                        type="date"
                        size="small"
                        value={filtros.fechaHasta || ''}
                        onChange={(e) =>
                            handleChange(
                                'fechaHasta',
                                e.target.value
                            )
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />

                    <div className="flex items-center">
                        <Button
                            variant="outlined"
                            onClick={limpiarFiltros}
                        >
                            Limpiar filtros
                        </Button>
                    </div>

                </div>
            </AccordionDetails>
        </Accordion>
    );
};