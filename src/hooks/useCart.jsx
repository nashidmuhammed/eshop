import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext(null)

export const CartContextProvider = (props) => {
    const [cartTotalQty, setCartTotalQty] = useState(0)
    const [cartTotalAmount, setCartTotalAmount] = useState(0)
    const [cartProducts, setCartProducts] = useState(null)

    console.log("cartTotalQty===>",cartTotalQty);
    console.log("cartTotalAmount===>",cartTotalAmount);

    useEffect(() => {
      const cartItems = localStorage.getItem('eShopCartItems')
      const cProducts = JSON.parse(cartItems)

      setCartProducts(cProducts)
    }, [])

    useEffect(() => {
      const getTotals = () => {
        if(cartProducts){
            const {total, qty} = cartProducts?.reduce((acc, item) => {
                const itemTotal = item.price * item.qty
    
                acc.total += itemTotal
                acc.qty += item.qty
    
                return acc
            }, {
                total: 0,
                qty: 0
            })
            setCartTotalQty(qty)
            setCartTotalAmount(total)
        }
      }
      getTotals()
    }, [cartProducts])
    
    

    const handleAddProductToCart = useCallback ((product) => {
        setCartProducts((prev) => {
            let updatedCart;

            if(prev){
                updatedCart = [...prev, product];
            }else{
                updatedCart = [product];
            }
            toast.success('Product added to cart')
            localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart))
            return updatedCart;
        })
    }, []);

    const handleRemoveProductfromCart = useCallback ((product) => {
        if(cartProducts){
            const filteredProducts = cartProducts.filter((item) => {
                return item.id !== product.id
            })

            setCartProducts(filteredProducts)
            toast.success("Product removed")
            localStorage.setItem("eShopCartItems", JSON.stringify(filteredProducts))
        }
        
    }, [cartProducts]);

    const handleCartQtyIncrease = useCallback((product) => {
        let updatedCart;
        if(product.qty === 99){
            return toast.error("Oops! Maximum reached")
        }
        if(cartProducts){
            updatedCart = [...cartProducts]

            const existingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if(existingIndex > -1){
                updatedCart[existingIndex].qty = ++updatedCart[existingIndex].qty
            }
            setCartProducts(updatedCart)
            localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart))
        }
      },[cartProducts])

    const handleCartQtyDecrease = useCallback((product) => {
        let updatedCart;
        if(product.qty <= 1){
            return handleRemoveProductfromCart(product);
        }
        if(cartProducts){
            updatedCart = [...cartProducts]

            const existingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if(existingIndex > -1){
                updatedCart[existingIndex].qty = --updatedCart[existingIndex].qty
            }
            setCartProducts(updatedCart)
            localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart))
        }
    },[cartProducts, handleRemoveProductfromCart])
    
    const handleClearCart = useCallback((product) => {
        setCartProducts(null)
        setCartTotalQty(0)
        localStorage.setItem('eShopCartItems', JSON.stringify(null))
      },[cartProducts])


    

    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductfromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
    }
    return (
        <CartContext.Provider value={value} {...props} />
    )
};

export const useCart = () => {
    const context = useContext(CartContext)

    if (context === null) {
        throw new Error("useCart must be used whithin a CartContextProvider")
    }

    return context
};