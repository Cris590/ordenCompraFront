import clsx from 'clsx';
import { Size } from '../../../interfaces/cart.interface';


interface Props {
  selectedSize?: string;
  availableSizes: string[];  // ['SX', 'M', 'XL', 'XXL']
  onSizeChanged: ( size: string ) => void;
}



export const SizeSelector = ({ selectedSize, availableSizes,onSizeChanged  }: Props) => {

  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>

      <div className="flex flex-wrap">

        {
          availableSizes.map( size => (
            <button 
              key={ size }
              onClick={ () => onSizeChanged(size) }
              className={
                clsx(
                  "mx-2 hover:underline text-lg",
                  {
                    'underline': size === selectedSize
                  }
                )
              }
            >
              { size}
            </button>
          ))

        }


      </div>



    </div>
  )
}