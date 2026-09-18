import React from 'react';
import {
    Card,
    CardContent,
    Chip,
    Typography
} from '@mui/material';
import { IoCardOutline } from 'react-icons/io5';
import { currencyFormat } from '../../../../../utils/currencyFormat';
import { ITransaccionPedidoEcommerce } from '../../../../../interfaces/ecommerce.interface';

interface Props {
    transactions: ITransaccionPedidoEcommerce[];
}

export const GestionPedidoTransactions = ({
    transactions
}: Props) => {

    return (
        <Card elevation={0} className="border">

            <CardContent>

                <div className="flex items-center gap-2 mb-4">

                    <IoCardOutline size={20} />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Transacciones
                    </Typography>

                </div>

                {transactions.length === 0 ? (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No hay transacciones registradas.
                    </Typography>

                ) : (

                    <div className="space-y-3">

                        {transactions.map((transaction) => (

                            <div
                                key={transaction.id_transaccion}
                                className="border rounded-lg p-3"
                            >

                                <div className="flex justify-between items-center gap-3">

                                    <div>

                                        <Typography fontWeight={600}>
                                            {transaction.metodo_pago}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {transaction.id_transaccion}
                                        </Typography>

                                    </div>

                                    <Typography fontWeight={700}>
                                        {currencyFormat(transaction.monto)}
                                    </Typography>

                                </div>

                                <div className="mt-2">

                                    <Chip
                                        label={transaction.estado}
                                        size="small"
                                        variant="outlined"
                                    />

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </CardContent>

        </Card>
    );
};