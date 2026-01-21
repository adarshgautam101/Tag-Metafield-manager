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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-black selection:text-white">
      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-4">
            Shopify Certified Partner
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight uppercase leading-none">
            Tag Field <span className="text-gray-400">Manager</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The high-performance engine for bulk managing tags and metafields across your entire catalog.
          </p>
        </div>

        {/* Login Form Card */}
        {showForm && (
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 mb-20">
            <Form className="space-y-5" method="post" action="/auth/login">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Shop Domain
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-black transition-all outline-none placeholder:text-slate-300 font-medium"
                    type="text"
                    name="shop"
                    placeholder="my-store.myshopify.com"
                    required
                  />
                </div>
              </div>
              <button
                className="w-full py-4 bg-black text-white font-black rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all uppercase tracking-widest shadow-lg shadow-black/10"
                type="submit"
              >
                Get Started
              </button>
            </Form>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-slate-200 pt-16">
          <div className="group">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
              <span className="font-bold">01</span>
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight mb-2">Bulk Tagging</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Deploy tags across thousands of entities instantly via smart-mapping CSVs.
            </p>
          </div>

          <div className="group">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
              <span className="font-bold">02</span>
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight mb-2">Metafield Control</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Deep-clean unused fields and batch-update values with granular precision.
            </p>
          </div>

          <div className="group">
            <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center mb-4">
              <span className="font-bold">03</span>
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight mb-2 italic">Safety Net</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Every change is logged in your **History**. Revert any bulk operation with a single click for up to **48 hours**.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

