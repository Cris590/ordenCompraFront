import { useEffect, useState } from 'react';

import { Swiper as SwiperObject } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';



import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Dialog, DialogContent } from '@mui/material';

interface Props {
  images: string[];
  title: string;
  className?: string;
}



export const ProductSlideshow = ({ images, title, className }: Props) => {

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();
  const [imagenesMostrar, setImagenesMostrar] = useState<string[]>([])
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');

  useEffect(() => {
    setImagenesMostrar(images)
  }, [images])


   
  const handleClickOpen = (image:string) => {
    setLink(image)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={className}>


      <Swiper
        style={{
          '--swiper-navigation-color': '#ddd',
          '--swiper-pagination-color': '#ffe',
        } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        // autoplay={{
        //   delay: 2500
        // }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >

        {
          imagenesMostrar.map(image => (
            <SwiperSlide key={image}>
                <LazyLoadImage
                  width={300}
                  height={300}
                  src={`${image}`}
                  alt={title}
                  className="rounded-lg object-fill cursor-pointer"
                  onClick={()=>handleClickOpen(image)}
              />
            </SwiperSlide>
          ))
        }
      </Swiper>


      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {
          imagenesMostrar.map(image => (
            <SwiperSlide key={image}>

              <LazyLoadImage
                width={150}
                height={150}
                src={`${image}`}
                alt={title}
                className="rounded-lg object-fill"
              />
            </SwiperSlide>

          ))
        }
      </Swiper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg" // Tamaño máximo del diálogo
        fullWidth
      >
        <DialogContent style={{ padding: 0 }}> {/* Para quitar el padding y mostrar la imagen sin bordes */}
          <img
            src={link}
            alt="VESTIDO PAÑO LANA"
            style={{ width: '100%', height: 'auto' }} // Imagen en tamaño completo
          />
        </DialogContent>
      </Dialog>

    </div>
  );
};