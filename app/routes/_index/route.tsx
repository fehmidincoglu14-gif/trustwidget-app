import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

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
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#111827", color: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", background: "linear-gradient(90deg, #10B981, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>
          TrustWidget
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#D1D5DB", lineHeight: "1.75" }}>
          The Ultimate Social Proof & Conversion Optimization Suite for Shopify.
        </p>
      </div>

      <div style={{ background: "#1F2937", padding: "2.5rem", borderRadius: "1rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", width: "100%", maxWidth: "400px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem", textAlign: "center" }}>Store Login</h2>
        
        {showForm && (
          <Form method="post" action="/auth/login" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#9CA3AF" }}>Shopify Domain</span>
              <input 
                type="text" 
                name="shop" 
                placeholder="my-shop.myshopify.com"
                style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #374151", background: "#111827", color: "white", outline: "none", fontSize: "1rem" }}
              />
            </label>
            <button 
              type="submit"
              style={{ background: "linear-gradient(90deg, #10B981, #059669)", color: "white", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "600", border: "none", cursor: "pointer", marginTop: "0.5rem", transition: "opacity 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Log in to Dashboard
            </button>
          </Form>
        )}
      </div>
      
      <div style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", width: "100%", maxWidth: "900px" }}>
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#10B981", marginBottom: "0.5rem" }}>17+ Widgets</h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Everything you need from Sales Pops to Cookie Banners in one app.</p>
        </div>
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#3B82F6", marginBottom: "0.5rem" }}>Lightning Fast</h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Optimized code that won't slow down your storefront.</p>
        </div>
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#8B5CF6", marginBottom: "0.5rem" }}>Easy Setup</h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>No coding required. Install and activate in seconds.</p>
        </div>
      </div>
    </div>
  );
}
