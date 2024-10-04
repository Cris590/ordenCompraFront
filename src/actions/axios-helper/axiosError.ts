
import axios from 'axios';
import { useUserStore } from '../../store/user/user';
import { useCartStore } from '../../store/cart/cart-store';


export const handleHttpError = async (error: unknown) => {
    const logOut = useUserStore.getState().logOut;
    const clearCart = useCartStore.getState().clearCart

    const context = process.env.REACT_APP_BASE_URL
    if (axios.isAxiosError(error)) {
      // Handle HTTP errors
      switch (error.response?.status) {
        case 401:
          console.log('Unauthorized access - 401');
          logOut()
          clearCart()
          // Perform specific action for 401 Unauthorized, e.g., redirect to login
          window.location.href = context + '/auth/login'; // Redirect to login page using window.location
          break;
  
      }
    } else {
      // Handle non-HTTP errors
      console.log('Error:', error);
    }
  };