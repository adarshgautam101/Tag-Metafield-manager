import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";



export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};



export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white text-black font-sans px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-14">

        {/* Header */}
        <header className="text-center space-y-5">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight uppercase">
            Tag Metafield Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A professional-grade tool to bulk manage tags and metafields across your Shopify store with safety and control.
          </p>
        </header>

        {/* Login */}
        {showForm && (
          <section className="flex justify-center">
            <Form
              method="post"
              action="/auth/login"
              className="w-full max-w-md space-y-4 border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                  Shop Domain
                </span>
                <input
                  type="text"
                  name="shop"
                  placeholder="my-store.myshopify.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold uppercase tracking-wide hover:bg-gray-900 transition"
              >
                Log in
              </button>
            </Form>
          </section>
        )}

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-10">
          <div className="p-6 border border-gray-200 rounded-xl hover:shadow-sm transition">
            <h3 className="text-lg font-bold mb-2">Bulk Tag Operations</h3>
            <p className="text-sm text-gray-600">
              Add or remove tags across thousands of products, customers, and orders using CSV-based processing.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl hover:shadow-sm transition">
            <h3 className="text-lg font-bold mb-2">Metafield Management</h3>
            <p className="text-sm text-gray-600">
              View, update, or clean up metafields in bulk with controlled execution and validation.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl hover:shadow-sm transition">
            <h3 className="text-lg font-bold mb-2">History & Undo Safety</h3>
            <p className="text-sm text-gray-600">
              Every operation is recorded. You can undo eligible actions within <strong>2 days</strong>. History is automatically cleared after this period.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
