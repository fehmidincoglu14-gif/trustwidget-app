import { Box, Card, Text } from "@shopify/polaris";

export function WidgetPreview({ widgetId, metaName }: { widgetId: string, metaName: string }) {
  const renderPreview = () => {
    switch (widgetId) {
      case "product-reviews":
        return (
          <div style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <div style={{ color: "#FFC107", fontSize: "24px" }}>★★★★★</div>
              <strong style={{ fontSize: "20px" }}>4.9</strong>
              <span style={{ color: "#666", fontSize: "12px" }}>(124 reviews)</span>
            </div>
            <div style={{ fontSize: "14px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
              <strong>Sarah J.</strong> - "Absolutely amazing! The quality is outstanding."
            </div>
          </div>
        );
      case "volume-discounts":
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            {[1, 2, 3].map((qty) => (
              <div key={qty} style={{ padding: "15px", border: "2px solid " + (qty === 2 ? "#000" : "#ddd"), borderRadius: "8px", background: "#fff", textAlign: "center", width: "100px" }}>
                <strong>Buy {qty}</strong>
                <div style={{ color: "#E32C2B", fontWeight: "bold", marginTop: "5px" }}>Save {qty * 10}%</div>
              </div>
            ))}
          </div>
        );
      case "countdown-timer":
        return (
          <div style={{ background: "#000", color: "#fff", padding: "15px 30px", borderRadius: "8px", textAlign: "center", display: "flex", gap: "15px", alignItems: "center" }}>
            <strong style={{ fontSize: "16px" }}>Sale ends in:</strong>
            <div style={{ display: "flex", gap: "10px", fontSize: "20px", fontWeight: "bold", fontFamily: "monospace" }}>
              <span>02<span style={{ fontSize: "12px", opacity: 0.7, display: "block" }}>HRS</span></span>:
              <span>45<span style={{ fontSize: "12px", opacity: 0.7, display: "block" }}>MIN</span></span>:
              <span>12<span style={{ fontSize: "12px", opacity: 0.7, display: "block" }}>SEC</span></span>
            </div>
          </div>
        );
      case "stock-scarcity":
        return (
          <div style={{ background: "#FFEBEB", color: "#D8000C", padding: "12px 20px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600" }}>
            <span style={{ fontSize: "20px" }}>🔥</span>
            Hurry! Only 3 left in stock.
          </div>
        );
      case "announcement-bar":
        return (
          <div style={{ width: "100%", background: "#000", color: "#fff", textAlign: "center", padding: "10px", fontWeight: "bold" }}>
            FREE SHIPPING ON ALL ORDERS OVER $50!
          </div>
        );
      case "currency-converter":
        return (
          <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: "6px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>🇺🇸 USD</span>
            <span style={{ fontSize: "10px" }}>▼</span>
          </div>
        );
      case "product-bundles":
        return (
          <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", width: "350px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <strong>Frequently Bought Together</strong>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "60px", height: "60px", background: "#f0f0f0", borderRadius: "4px" }}></div>
              <span style={{ fontSize: "20px", color: "#888" }}>+</span>
              <div style={{ width: "60px", height: "60px", background: "#f0f0f0", borderRadius: "4px" }}></div>
              <div style={{ flex: 1, textAlign: "right", fontWeight: "bold" }}>$129.98</div>
            </div>
            <button style={{ background: "#000", color: "#fff", border: "none", padding: "10px", borderRadius: "4px", fontWeight: "bold" }}>Add Both to Cart</button>
          </div>
        );
      case "cookie-banner":
        return (
          <div style={{ width: "80%", background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <div>
              <strong>We value your privacy</strong>
              <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#666" }}>We use cookies to enhance your browsing experience.</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ padding: "8px 15px", border: "1px solid #000", background: "transparent", borderRadius: "4px" }}>Decline</button>
              <button style={{ padding: "8px 15px", background: "#000", color: "#fff", border: "none", borderRadius: "4px" }}>Accept All</button>
            </div>
          </div>
        );
      case "scroll-to-top":
        return (
          <div style={{ width: "50px", height: "50px", background: "#000", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            ↑
          </div>
        );
      case "inactive-tab":
        return (
          <div style={{ background: "#f0f0f0", padding: "10px", borderRadius: "8px 8px 0 0", borderBottom: "1px solid #ccc", width: "300px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "#fff", padding: "5px 15px", borderRadius: "20px" }}>
              <span>👋</span>
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>Come back soon! - Store</span>
            </div>
          </div>
        );
      case "related-products":
        return (
          <div style={{ width: "100%", display: "flex", gap: "15px", justifyContent: "center" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: "120px", display: "flex", flexDirection: "column", gap: "8px", background: "#fff", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ width: "100%", height: "100px", background: "#f5f5f5", borderRadius: "4px" }}></div>
                <div style={{ fontSize: "12px", fontWeight: "bold" }}>Product {i}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>$29.99</div>
              </div>
            ))}
          </div>
        );
      case "sales-pop":
        return (
          <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", padding: "15px", display: "flex", gap: "15px", width: "320px", alignItems: "center" }}>
            <div style={{ width: "50px", height: "50px", background: "#eee", borderRadius: "4px" }}></div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>Someone in New York</div>
              <div style={{ fontSize: "12px", color: "#666" }}>purchased a Premium T-Shirt</div>
              <div style={{ fontSize: "10px", color: "#999", marginTop: "5px" }}>2 minutes ago</div>
            </div>
          </div>
        );
      case "live-visitor":
        return (
          <div style={{ background: "#000", color: "#fff", padding: "10px 20px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
            <div style={{ width: "10px", height: "10px", background: "#4caf50", borderRadius: "50%", boxShadow: "0 0 5px #4caf50" }}></div>
            24 people are viewing this right now
          </div>
        );
      case "trust-badges":
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", background: "#fff", padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
            <strong style={{ fontSize: "12px", color: "#666" }}>GUARANTEED SAFE CHECKOUT</strong>
            <div style={{ display: "flex", gap: "10px" }}>
              {["Visa", "Mastercard", "PayPal", "Amex"].map(b => (
                <div key={b} style={{ padding: "5px 10px", border: "1px solid #eee", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>{b}</div>
              ))}
            </div>
          </div>
        );
      case "spin-wheel":
        return (
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", display: "flex", gap: "20px", alignItems: "center", width: "400px" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "conic-gradient(#ff5722 0 25%, #4caf50 25% 50%, #2196f3 50% 75%, #ffeb3b 75% 100%)", border: "4px solid #333", position: "relative" }}>
              <div style={{ position: "absolute", top: "-10px", left: "45px", width: "10px", height: "20px", background: "#333", clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}></div>
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: "18px" }}>Spin to Win!</strong>
              <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 10px 0" }}>Enter your email for a chance to win up to 50% off.</p>
              <button style={{ width: "100%", padding: "10px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold" }}>Try my luck</button>
            </div>
          </div>
        );
      case "sticky-atc":
        return (
          <div style={{ width: "90%", background: "#fff", padding: "10px 20px", borderRadius: "8px", boxShadow: "0 5px 20px rgba(0,0,0,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ width: "40px", height: "40px", background: "#eee", borderRadius: "4px" }}></div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>Premium Wireless Headphones</div>
                <div style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "14px" }}>$199.99</div>
              </div>
            </div>
            <button style={{ background: "#000", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "4px", fontWeight: "bold" }}>Add to Cart</button>
          </div>
        );
      case "animated-atc":
        return (
          <button style={{ background: "#000", color: "#fff", border: "none", padding: "15px 40px", borderRadius: "4px", fontSize: "16px", fontWeight: "bold", boxShadow: "0 0 15px rgba(0,0,0,0.3)", transform: "scale(1.05)" }}>
            Add to Cart
          </button>
        );
      default:
        return (
           <Text as="h1" variant="headingXl" tone="subdued">{metaName}</Text>
        );
    }
  };

  return (
    <div style={{
      width: '100%', 
      height: '240px', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: '1px solid #ebebeb',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <img 
        src={`/previews/${widgetId}.jpg`} 
        alt={`Preview for ${metaName}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div style={{ zIndex: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        {renderPreview()}
      </div>
    </div>
  );
}
