import React, { SyntheticEvent, useEffect, useState } from 'react'
import { BreadCrumbsEntidad } from './components/BreadCrumbsEntidad';
import { Box, Card, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { InformacionBasicaEntidad } from './components/informacion-entidad/InformacionBasicaEntidad';
import { UsuariosEntidad } from './components/usuarios-entidad/UsuariosEntidad';
import { FormCordinadorEntidad } from './components/coordinador-entidad/FormCordinadorEntidad';
import { CargosEntidad } from './components/cargos-entidad/CargosEntidad';
import { obtenerInfoBasicaEntidad } from '../../../actions/entidad/entidad';
import { useEntidadStore } from '../../../store/entidad/entidad';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { CargosEntidadBonos } from './components/cargos-entidad-bonos/CargosEntidadBonos';
import { ControlProductosEntidad } from './components/control-productos/ControlProductosEntidad';
import { CreacionTemplateBono } from './components/edicion-bonos/CreacionTemplateBono';

export const AdminEntidad = () => {
  const { codEntidad } = useParams<{ codEntidad: string }>();

  const [value, setValue] = useState("1");
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)

  const infoEntidad = useEntidadStore((state) => state.entidad)
  const setinfoEntidad = useEntidadStore((state) => state.setInfoEntidad)

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {


    if (codEntidad && +codEntidad !== 0) {
      obtenerInfoEntidad(codEntidad)
    }
  }, [])

  const obtenerInfoEntidad = async (codEntidad: string) => {
    setOpenLoadingSpinner(true)
    let response = await obtenerInfoBasicaEntidad(codEntidad)
    if (response?.error === 0) {
      setinfoEntidad(response.entidad);
    }
    setOpenLoadingSpinner(false)
  }

  const tabsEntidad = () => {


    if (codEntidad && +codEntidad !== 0) {

      if (infoEntidad?.tipo_entrega_contrato === 1) {
        return [
          <Tab key="2" label="Cargos usuario" value="2" disabled={!codEntidad || +codEntidad === 0} />,
          <Tab key="3" label="Usuarios" value="3" disabled={!codEntidad || +codEntidad === 0} />,
          <Tab key="4" label="Coordinador" value="4" disabled={!codEntidad || +codEntidad === 0} />,
        ]
      }else if(infoEntidad?.tipo_entrega_contrato === 2){
        return [
          <Tab key="5" label="Cargos usuario bonos" value="5" disabled={!codEntidad || +codEntidad === 0} />,
          <Tab key="6" label="Control de productos" value="6" disabled={!codEntidad || +codEntidad === 0} />,
          <Tab key="3" label="Usuarios" value="3" disabled={!codEntidad || +codEntidad === 0} />,
          <Tab key="7" label="Creación bonos" value="7" disabled={!codEntidad || +codEntidad === 0} />
          
        ]
      }
    } else {
      return null
    }


  }
  return (
    <div className='mx-6 ps-2'>
      <br></br>
      <BreadCrumbsEntidad />

      <Card className='my-6' sx={{ minWidth: 480 }}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Información básica" value="1" />
                {tabsEntidad()}
              </TabList>
            </Box>


            <TabPanel value="1">
              <InformacionBasicaEntidad codEntidad={codEntidad} />
            </TabPanel>

            <TabPanel value="2">
              {(codEntidad && +codEntidad !== 0) && (
                <CargosEntidad codEntidad={+codEntidad} />
              )}
            </TabPanel>


            <TabPanel value="3">
              {(codEntidad && +codEntidad !== 0) && (
                <UsuariosEntidad codEntidad={codEntidad} />
              )}
            </TabPanel>
            <TabPanel value="4">
              {(codEntidad && +codEntidad !== 0) && (
                <FormCordinadorEntidad codEntidad={+codEntidad} />
              )}

            </TabPanel>

             <TabPanel value="5">
              {(codEntidad && +codEntidad !== 0) && (
                <CargosEntidadBonos codEntidad={+codEntidad} />
              )}
            </TabPanel>

            <TabPanel value="6">
              {(codEntidad && +codEntidad !== 0) && (
                <ControlProductosEntidad codEntidad={+codEntidad} />
              )}
            </TabPanel>

            <TabPanel value="7">
              {(codEntidad && +codEntidad !== 0) && (
                <CreacionTemplateBono codEntidad={+codEntidad} />
              )}
            </TabPanel>

            
          </TabContext>
        </Box>
      </Card>
      <LoadingSpinnerScreen open={openLoadingSpinner} />
    </div>
  );
}
