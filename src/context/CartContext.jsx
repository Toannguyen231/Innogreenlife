import { createContext, useReducer, useEffect } from 'react'

export const CartContext = createContext()

const initialState = {
  items: [],
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id)
      let updatedItems = [...state.items]

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        }
      } else {
        updatedItems.push({ ...action.payload })
      }
      return { ...state, items: updatedItems }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      }
    }
    case 'CLEAR_CART': {
      return initialState
    }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    // Load from localStorage if present
    const localData = localStorage.getItem('mangorush_cart')
    return localData ? JSON.parse(localData) : initialState
  })

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('mangorush_cart', JSON.stringify(state))
  }, [state])

  const addToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}
