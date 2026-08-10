import React, { useState } from 'react'
import { IoCloseCircleOutline, IoPencil } from 'react-icons/io5';
import { IconButton } from '@mui/material';
import { IColorProductoCrm } from '../../../../../../interfaces/ecommerce.interface';
import { ColorCircle } from '../../../../../../components/product/color-circle/ColorCircle';

interface Props {
    selected:boolean,
    colorUnitario: IColorProductoCrm,
    seleccionarColor: (color: IColorProductoCrm) => void,
    editarColor: (color: IColorProductoCrm) => void,
    borrarColor: (color: IColorProductoCrm) => void,
}


export const ColorAccionCircleCrm = ({selected,editarColor,borrarColor, seleccionarColor, colorUnitario }: Props) => {

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);


    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className='mx-4'
        >
            {isHovered && (
                <>
                    <IconButton
                        onClick={()=>borrarColor(colorUnitario)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '-15px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            padding: '0',
                            zIndex: '1000'
                        }}
                    >
                        <IoCloseCircleOutline />
                    </IconButton>

                    <IconButton
                        onClick={()=>editarColor(colorUnitario)}
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '-15px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            padding: '0',
                        }}
                    >
                        <IoPencil />
                    </IconButton>
                </>
            )}
            <button className={`mx-3 p-2 rounded border border-dotted hover:bg-gray-150  ${selected && 'bg-blue-200'}`} 
            onClick={() => seleccionarColor(colorUnitario)}>
                <ColorCircle color={colorUnitario.color} size="3" />
                <p>{colorUnitario.codigo_color} - {colorUnitario.nombre_color}</p>
            </button>
        </div>
    )
}
