import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React from 'react'
import { IDepositoInfo } from '../../../../interfaces/deposito.interface'
import { currencyFormat } from '../../../../utils/currencyFormat'
interface Props {
  deposito: IDepositoInfo,
  handleVerInfoDeposito: (cod_deposito: number) => void
}

export const DepositoButton = ({
  deposito,
  handleVerInfoDeposito
}: Props) => {
  return (
    <div key={deposito.cod_deposito} className="shrink-0">
      <Card sx={{ maxWidth: 300 }} className='m-5'>

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {deposito.nombre}
          </Typography>
          <Typography variant="subtitle1" component="div">
           No. {deposito.no_cuenta}
          </Typography>
          <hr/>
          <Typography variant="h6" component="div">
            {currencyFormat(deposito.valor)}
          </Typography>

        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleVerInfoDeposito(deposito.cod_deposito)}>Ver movimientos</Button>
        </CardActions>
      </Card>
    </div>
  )
}
