import Image from 'next/image'
import { useMemo, useState } from 'react'

type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  symbol: string
  image?: string
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
    price: 24.99,
    description: 'Classic MHSSF sports-family shirt.',
    symbol: '👕',
    image: '/products/mhssf-shirt-black.png',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 2,
    name: 'MHSSF Premium Hoodie',
    category: 'Hoodies',
    price: 49.99,
    description: 'Warm premium hoodie with the MHSSF logo.',
    symbol: '🧥',
    image: '/products/mhssf-hoodie-black.png',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 3,
    name: 'MHSSF Sports Hat',
    category: 'Hats',
    price: 39.99,
    description: 'Adjustable sports hat for athletes and fans.',
    image: "/products/mhssf-flatbill-hat.png",
    symbol: '🧢',
    featured: true,
  },
  {
    id: 4,
    name: 'MHSSF Water Bottle',
    category: 'Accessories',
    price: 19.99,
    description: 'Reusable bottle for practices, games, and workouts.',
    image: "/products/mhssf-water-bottle.png",
    symbol: '💧',
  },
  {
    id: 5,
    name: 'MHSSF Stadium Banner',
    category: 'Banners',
    price: 49.99,
    description: 'Display the sports-family brand at games and events.',
    image: "/products/mhssf-stadium-banner.png",
    symbol: '🏳️',
  },
  {
    id: 6,
    name: 'MHSSF Athlete Backpack',
    category: 'Accessories',
    price: 49.99,
    description: 'Athletic backpack for equipment, school, and travel.',
    image: "/products/mhssf-athlete-backpack.png",
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
  <main className="min-h-screen bg-[#f6f6f6] text-slate-950">
    {/* TOP ANNOUNCEMENT BAR */}
    <div className="bg-[#07162f] text-white">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-6 py-3 text-xs font-bold uppercase tracking-wide">
        <div className="flex flex-wrap items-center gap-6">
          <span>🚚 Free shipping on orders $75+</span>
          <span className="hidden text-white/40 md:inline">|</span>
          <span>🛡️ Official MHSSF merchandise</span>
          <span className="hidden text-white/40 md:inline">|</span>
          <span>🏈 Supporting high school athletes & families</span>
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <button type="button">Track Order</button>
          <button type="button">Help</button>
          <button type="button">My Account</button>
        </div>
      </div>
    </div>


    {/* HERO */}
    <section className="relative overflow-hidden bg-[#07162f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.35),transparent_35%)]" />

      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-6 py-14 lg:grid-cols-[1.25fr_1fr] lg:px-12">
        <div>
          <p className="text-4xl font-black italic uppercase tracking-tight md:text-5xl">
            Wear the family.
          </p>

          <h1 className="mt-2 text-4xl font-black italic uppercase leading-none text-red-600 md:text-6xl">
            Represent the movement.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            Shop official My High School Sports Family apparel, accessories,
            state collections, recruiting gear, and championship merchandise.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-lg bg-red-600 px-8 py-4 text-sm font-black uppercase text-white shadow-lg transition hover:bg-red-700"
            >
              Shop Collection
            </button>

            <button
              type="button"
              onClick={() => {
  document
    .getElementById('collections')
    ?.scrollIntoView({ behavior: 'smooth' })
}}
              className="rounded-lg border border-white px-8 py-4 text-sm font-black uppercase text-white transition hover:bg-white hover:text-[#07162f]"
            >
              View Collections
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl">✓</div>
            <h3 className="mt-4 text-sm font-black uppercase">
              Premium Quality
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Built for athletes and families
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl">🚚</div>
            <h3 className="mt-4 text-sm font-black uppercase">
              Fast Shipping
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Orders ship in 1–3 business days
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl">🔒</div>
            <h3 className="mt-4 text-sm font-black uppercase">
              Secure Checkout
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Safe and secure payments
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* SHOP BY COLLECTION */}
<section
  id="collections"
  className="border-b border-slate-200 bg-white px-6 py-10"
>
  <div className="mx-auto max-w-[1600px]">
    <h2 className="text-2xl font-black uppercase tracking-tight text-[#07162f]">
      Shop by Collection
    </h2>

    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {[
        {
          title: 'New Arrivals',
          subtitle: "See what's new",
          symbol: '👕',
        },
        {
          title: 'Best Sellers',
          subtitle: 'Top fan favorites',
          symbol: '🔥',
        },
        {
          title: 'Hats & Accessories',
          subtitle: 'Complete your look',
          symbol: '🧢',
        },
        {
          title: 'State Collections',
          subtitle: 'Represent your state',
          symbol: '🇺🇸',
        },
        {
          title: 'Recruiting Gear',
          subtitle: 'Built for the next level',
          symbol: '🏆',
        },
      ].map((collection) => (
        <button
          key={collection.title}
          type="button"
          className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-red-500 hover:shadow-lg"
        >
          <div className="text-5xl transition group-hover:scale-110">
            {collection.symbol}
          </div>

          <h3 className="mt-4 text-sm font-black uppercase text-[#07162f]">
            {collection.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {collection.subtitle}
          </p>
        </button>
      ))}
    </div>
  </div>
</section>

{/* PRODUCT SHOP */}
<section className="bg-[#f6f7f9] px-6 py-10">
  <div className="mx-auto max-w-[1600px]">
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* FILTER SIDEBAR */}
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black uppercase text-[#07162f]">
          Categories
        </h2>

        <div className="mt-5 space-y-2">
          {[
            'All Products',
            'T-Shirts',
            'Hoodies',
            'Hats',
            'Accessories',
            'Banners',
            'State Gear',
            'Recruiting',
          ].map((category) => (
            <button
              key={category}
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600"
            >
              <span>{category}</span>
              <span>›</span>
            </button>
          ))}
        </div>

        <div className="my-6 border-t border-slate-200" />

        <h3 className="font-black uppercase text-[#07162f]">
          Filter By
        </h3>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Price Range</span>
            <span>$100+</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="75"
            aria-label="Price range"
            className="mt-4 w-full accent-red-600"
          />
        </div>

        <div className="mt-7">
          <p className="text-sm font-black">Colors</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              'bg-blue-950',
              'bg-red-600',
              'bg-black',
              'bg-slate-400',
              'bg-white',
              'bg-orange-500',
            ].map((colorClass) => (
              <button
                key={colorClass}
                type="button"
                aria-label="Select product color"
                className={`h-7 w-7 rounded-full border border-slate-300 ${colorClass}`}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* PRODUCTS */}
      <div>
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center rounded-lg border border-slate-300 bg-white px-4">
            <span className="mr-3 text-xl">⌕</span>

            <input
              type="search"
              placeholder="Search products..."
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>

          <select
            aria-label="Sort products"
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold outline-none"
            defaultValue="featured"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="new">Newest</option>
          </select>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-8">
                {product.featured && (
                  <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase text-white">
                    Best Seller
                  </span>
                )}

                <button
                  type="button"
                  aria-label={`Favorite ${product.name}`}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow"
                >
                  ♡
                </button>

                <div className="relative h-48 w-48">
                  <Image
                    src={product.image || "/mhssf-store-logo.jpg"}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-wide text-red-600">
                  {product.category}
                </p>

                <h3 className="mt-2 text-lg font-black text-[#07162f]">
                  {product.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-amber-500">★★★★★</span>
                  <span className="text-xs text-slate-500">
                    ({product.id * 17 + 42})
                  </span>
                </div>

                <p className="mt-4 text-2xl font-black text-slate-950">
                  ${product.price.toFixed(2)}
                </p>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="relative z-20 mt-4 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                    <button
  key={size}
  type="button"
  onClick={(event) => {
    event.preventDefault()
    event.stopPropagation()

    setSelectedSizes((current) => ({
      ...current,
      [product.id]: size,
    }))
  }}
  className={`relative z-20 min-w-9 cursor-pointer rounded-md border px-3 py-2 text-sm font-semibold transition ${
    selectedSizes[product.id] === size
      ? 'border-black bg-black text-white'
      : 'border-gray-300 bg-white text-black hover:border-black'
  }`}
>
  {size}
</button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                onClick={() => addToCart(product)}
                  className="mt-5 w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-red-700"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

    {isCartOpen && (
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-black uppercase">
            Your Cart ({cartCount})
          </h2>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="text-3xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <p className="text-slate-500">Your cart is currently empty.</p>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedSize}`}
                  className="border-b pb-5"
                >
                  <p className="font-black">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    Size: {item.selectedSize}
                  </p>
                  <p className="mt-2 font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() =>
        changeQuantity(item.id, item.selectedSize, item.quantity - 1)
      }
      className="h-9 w-9 rounded-md border border-gray-300 font-bold"
    >
      −
    </button>

    <span className="min-w-6 text-center font-semibold">
      {item.quantity}
    </span>

    <button
      type="button"
      onClick={() =>
        changeQuantity(item.id, item.selectedSize, item.quantity + 1)
      }
      className="h-9 w-9 rounded-md border border-gray-300 font-bold"
    >
      +
    </button>
  </div>

  <button
    type="button"
    onClick={() => removeItem(item.id, item.selectedSize)}
    className="text-sm font-semibold text-red-600 hover:underline"
  >
    Remove
  </button>
</div>
                </div>
              ))} 
              <div className="mt-6 border-t border-gray-200 pt-5">
  <div className="mb-4 flex items-center justify-between text-lg font-bold">
    <span>Subtotal</span>
    <span>${subtotal.toFixed(2)}</span>
  </div>

  <p className="mb-4 text-sm text-gray-500">
    Shipping and taxes are calculated at checkout.
  </p>

  <button
    type="button"
    onClick={() => {
  localStorage.setItem('mhssf-cart', JSON.stringify(cart))
  window.location.href = '/checkout'
}}
    disabled={cart.length === 0}
    className="w-full rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
  >
    Proceed to Checkout
  </button>
</div>
            </div>
          )}
        </div>
      </aside>
    )}
  </main>
)
}   