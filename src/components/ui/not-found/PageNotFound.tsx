import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

export const PageNotFound = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-[800px] w-full justify-center items-center align-middle">

      <div className="text-center px-5 mx-5">
        <h2 className={ `antialiased text-9xl` }>404</h2>
        <p className="font-semibold text-xl">Whoops! Lo sentimos mucho.</p>
      </div>



      <div className="px-5 mx-5">
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/imgs/404.png`}
          alt="Starman"
          className="p-5 sm:p-0"
          width={ 550 }
          height={ 550 }
        />

      </div>


    </div>
  );
};