import Image from 'next/image'
import { useMemo, useState } from 'react'

type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  symbol: string
  featured?: boolean
  sizes?: string[]
}

type CartItem = Product & {
  quantity: number
  selectedSize?: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'MHSSF Family T-Shirt',
    category: 'T-Shirts',
    price: 29.99,
    description: 'Classic MHSSF sports-family shirt.',
    symbol: '👕',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 2,
    name: 'MHSSF Premium Hoodie',
    category: 'Hoodies',
    price: 59.99,
    description: 'Warm premium hoodie with the MHSSF logo.',
    symbol: '🧥',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 3,
    name: 'MHSSF Sports Hat',
    category: 'Hats',
    price: 24.99,
    description: 'Adjustable sports hat for athletes and fans.',
    symbol: '🧢',
    featured: true,
  },
  {
    id: 4,
    name: 'MHSSF Water Bottle',
    category: 'Accessories',
    price: 19.99,
    description: 'Reusable bottle for practices, games, and workouts.',
    symbol: '💧',
  },
  {
    id: 5,
    name: 'MHSSF Stadium Banner',
    category: 'Banners',
    price: 39.99,
    description: 'Display the sports-family brand at games and events.',
    symbol: '🏳️',
  },
  {
    id: 6,
    name: 'MHSSF Athlete Backpack',
    category: 'Accessories',
    price: 49.99,
    description: 'Athletic backpack for equipment, school, and travel.',
    symbol: '🎒',
  },
  {
    id: 7,
    name: 'Texas Sports Family Shirt',
    category: 'State Gear',
    price: 34.99,
    description: 'Represent the Texas high-school sports family.',
    symbol: '⭐',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 8,
    name: 'Florida Sports Family Hoodie',
    category: 'State Gear',
    price: 64.99,
    description: 'Represent the Florida high-school sports family.',
    symbol: '🌴',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 9,
    name: 'MHSSF Recruiting Shirt',
    category: 'Recruiting',
    price: 32.99,
    description: 'Built for athletes pursuing their next opportunity.',
    symbol: '🏆',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
]

const categories = [
  'All Products',
  'T-Shirts',
  'Hoodies',
  'Hats',
  'Accessories',
  'Banners',
  'State Gear',
  'Recruiting',
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [searchText, setSearchText] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({})

  const filteredProducts = useMemo(() => {
    const search = searchText.trim().toLowerCase()

    return products.filter((product) => {
      const categoryMatches =
        selectedCategory === 'All Products' ||
        product.category === selectedCategory

      const searchMatches =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)

      return categoryMatches && searchMatches
    })
  }, [searchText, selectedCategory])

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  function addToCart(product: Product) {
    const selectedSize = product.sizes
      ? selectedSizes[product.id] || product.sizes[0]
      : undefined

    setCart((currentCart) => {
      const matchingItem = currentCart.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize
      )

      if (matchingItem) {
        return currentCart.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
          selectedSize,
        },
      ]
    })

    setIsCartOpen(true)
  }

  function changeQuantity(
    productId: number,
    selectedSize: string | undefined,
    amount: number
  ) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId &&
          item.selectedSize === selectedSize
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + amount),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeItem(
    productId: number,
    selectedSize: string | undefined
  ) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === selectedSize
          )
      )
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-red-950 text-white dark:border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-widest">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              MHSSF Merchandise
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Wear the family.
              <span className="block text-blue-300">
                Represent the movement.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Shop official My High School Sports Family apparel,
              accessories, state collections, recruiting gear, and
              championship merchandise.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('products')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="rounded-xl bg-orange-600 px-6 py-3 font-bold transition hover:bg-orange-500"
              >
                Shop merchandise
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-bold transition hover:bg-white/20"
              >
                View cart ({cartCount})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="flex min-h-44 flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur"
              >
                <div className="text-5xl">{product.symbol}</div>
                <div className="mt-4 font-black">{product.name}</div>
                <div className="mt-2 text-sm text-slate-300">
                  {formatMoney(product.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="products"
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Official MHSSF Gear
            </div>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Shop the collection
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white dark:bg-white dark:text-slate-950"
          >
            Shopping cart · {cartCount}
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_300px]">
          <label>
            <span className="mb-2 block text-sm font-bold">
              Search products
            </span>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search shirts, hoodies, hats, state gear..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-orange-500 dark:border-white/15 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold">
              Product category
            </span>
            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-orange-500 dark:border-white/15 dark:bg-slate-900 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-red-950">
                <div className="text-8xl">{product.symbol}</div>

                {product.featured && (
                  <span className="absolute left-4 top-4 rounded-lg bg-orange-600 px-3 py-1 text-xs font-black uppercase text-white">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="text-sm font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                  {product.category}
                </div>

                <h3 className="mt-2 text-xl font-black">
                  {product.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {product.description}
                </p>

                <div className="mt-5 text-2xl font-black">
                  {formatMoney(product.price)}
                </div>

                {product.sizes && (
                  <label className="mt-5 block">
                    <span className="mb-2 block text-sm font-bold">
                      Select size
                    </span>

                    <select
                      value={
                        selectedSizes[product.id] || product.sizes[0]
                      }
                      onChange={(event) =>
                        setSelectedSizes((current) => ({
                          ...current,
                          [product.id]: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 dark:border-white/15 dark:bg-slate-950 dark:text-white"
                    >
                      {product.sizes.map((size) => (
                        <option key={size}>{size}</option>
                      ))}
                    </select>
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-5 w-full rounded-xl bg-orange-600 px-5 py-3 font-bold text-white transition hover:bg-orange-500"
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5">
            <h3 className="text-2xl font-black">
              No products were found
            </h3>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Try another search or product category.
            </p>
          </div>
        )}
      </section>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <button
            type="button"
            aria-label="Close shopping cart"
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 cursor-default"
          />

          <aside className="relative h-full w-full max-w-lg overflow-y-auto bg-white p-6 text-slate-950 shadow-2xl dark:bg-slate-950 dark:text-white">
            <div className="flex items-center justify-between gap-5">
              <div>
                <div className="text-sm font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                  MHSSF Store
                </div>

                <h2 className="mt-1 text-3xl font-black">
                  Shopping cart
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 font-bold dark:border-white/15"
              >
                Close
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="mt-12 rounded-3xl border border-slate-200 p-8 text-center dark:border-white/10">
                <div className="text-5xl">🛒</div>

                <h3 className="mt-5 text-2xl font-black">
                  Your cart is empty
                </h3>

                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Add official MHSSF gear to begin your order.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 space-y-4">
                  {cart.map((item) => (
                    <article
                      key={`${item.id}-${item.selectedSize || 'standard'}`}
                      className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-4xl dark:bg-white/10">
                          {item.symbol}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-black">{item.name}</h3>

                          {item.selectedSize && (
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Size: {item.selectedSize}
                            </p>
                          )}

                          <div className="mt-2 font-bold">
                            {formatMoney(item.price)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                item.selectedSize,
                                -1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 font-black dark:border-white/15"
                          >
                            −
                          </button>

                          <span className="min-w-6 text-center font-black">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                item.selectedSize,
                                1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 font-black dark:border-white/15"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id, item.selectedSize)
                          }
                          className="text-sm font-bold text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6 dark:border-white/10">
                  <div className="flex items-center justify-between text-lg">
                    <span>Subtotal</span>
                    <span className="text-2xl font-black">
                      {formatMoney(subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Shipping and taxes will be calculated during checkout.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      window.alert(
                        'Secure checkout will be connected after we choose Stripe, Shopify, or another payment provider.'
                      )
                    }
                    className="mt-6 w-full rounded-xl bg-orange-600 px-6 py-4 font-black text-white hover:bg-orange-500"
                  >
                    Continue to checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}