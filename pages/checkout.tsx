import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  selectedSize?: string
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('mhssf-cart')

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        setCart([])
      }
    }
  }, [])

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cart]
  )

  const shipping = subtotal >= 75 ? 0 : 7.99
  const total = subtotal + shipping

  function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    localStorage.removeItem('mhssf-cart')
    setCart([])
    setOrderPlaced(true)
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">✅</div>

          <h1 className="mt-5 text-3xl font-black">
            Order received
          </h1>

          <p className="mt-3 text-slate-600">
            Thank you for supporting My High School Sports Family.
          </p>

          <Link
            href="/store"
            className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-bold text-white"
          >
            Return to Store
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">
              MHSSF Official Store
            </p>

            <h1 className="text-4xl font-black">
              Secure Checkout
            </h1>
          </div>

          <Link
            href="/store"
            className="font-semibold text-slate-600 hover:text-black"
          >
            ← Return to Store
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <form
            onSubmit={placeOrder}
            className="rounded-2xl bg-white p-7 shadow-sm"
          >
            <h2 className="text-2xl font-black">
              Contact Information
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                required
                type="text"
                placeholder="First name"
                className="rounded-lg border border-slate-300 px-4 py-3"
              />

              <input
                required
                type="text"
                placeholder="Last name"
                className="rounded-lg border border-slate-300 px-4 py-3"
              />

              <input
                required
                type="email"
                placeholder="Email address"
                className="rounded-lg border border-slate-300 px-4 py-3 sm:col-span-2"
              />
            </div>

            <h2 className="mt-8 text-2xl font-black">
              Shipping Address
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                required
                type="text"
                placeholder="Street address"
                className="rounded-lg border border-slate-300 px-4 py-3 sm:col-span-2"
              />

              <input
                required
                type="text"
                placeholder="City"
                className="rounded-lg border border-slate-300 px-4 py-3"
              />

              <input
                required
                type="text"
                placeholder="State"
                className="rounded-lg border border-slate-300 px-4 py-3"
              />

              <input
                required
                type="text"
                placeholder="ZIP code"
                className="rounded-lg border border-slate-300 px-4 py-3"
              />

              <input
                required
                type="tel"
                placeholder="Phone number"
                className="rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

            <h2 className="mt-8 text-2xl font-black">
              Payment
            </h2>

            <div className="mt-5 grid gap-4">
              <input
                required
                type="text"
                placeholder="Name on card"
                className="rounded-lg border border-slate-300 px-4 py-3"
              />

              <input
                required
                type="text"
                placeholder="Card number"
                className="rounded-lg border border-slate-300 px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="MM/YY"
                  className="rounded-lg border border-slate-300 px-4 py-3"
                />

                <input
                  required
                  type="text"
                  placeholder="CVC"
                  className="rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className="mt-8 w-full rounded-lg bg-red-600 px-6 py-4 text-lg font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Place Order — ${total.toFixed(2)}
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              This is currently a test checkout. Real card processing will be connected later.
            </p>
          </form>

          <aside className="h-fit rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">
              {cart.length === 0 ? (
                <p className="text-slate-500">
                  Your cart is empty.
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="border-b border-slate-200 pb-5"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-bold">{item.name}</p>

                        {item.selectedSize && (
                          <p className="text-sm text-slate-500">
                            Size: {item.selectedSize}
                          </p>
                        )}

                        <p className="text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-black">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}