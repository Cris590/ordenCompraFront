import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props {
  quantity: number;

  onQuantityChanged: ( value: number ) => void; 
  disabled?:boolean
}



export const QuantitySelector = ( { quantity, onQuantityChanged, disabled = false }: Props ) => {


  const onValueChanged = ( value: number ) => {
    
    if ( quantity + value < 1 ) return;

    onQuantityChanged( quantity + value );
  };


  return (
    <>
    <div className="flex">
      <button onClick={ () => onValueChanged( -1 ) }>
        <IoRemoveCircleOutline size={ 30 } />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">
        { quantity }
      </span>

      <button onClick={ () => onValueChanged( +1 ) } disabled = {disabled}>
        <IoAddCircleOutline size={ 30 } />
      </button>

    </div>
    {disabled && 
      <p className='text-red-700'>Número máximo de productos alcanzado</p>
    }
    </>
  );
};