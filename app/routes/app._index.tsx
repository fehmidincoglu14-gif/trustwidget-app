import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Box,
  InlineStack,
  Badge,
  Grid,
  TextField,
  Icon,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const totalViews = await db.abTestEvent.count({ where: { shop, eventType: "view" } });
  const totalClicks = await db.abTestEvent.count({ where: { shop, eventType: "click" } });
  const totalReviews = await db.review.count({ where: { shop } });
  
  return json({ totalViews, totalClicks, totalReviews, shop });
};

const ALL_CATEGORIES = [
  {
    title: "BOOST CUSTOMER TRUST",
    widgets: [
      { id: "instagram-feed", name: "Shoppable Instagram Feed", popular: false, implemented: false },
      { id: "trust-badges", name: "Trust Badges & Payment Icons", popular: true, implemented: true },
      { id: "payment-logos", name: "Payment Logos", popular: false, implemented: false },
      { id: "sales-pop", name: "Recent Sales Notifications", popular: false, implemented: true },
      { id: "product-reviews", name: "Product Reviews", popular: true, implemented: true },
    ],
  },
  {
    title: "POST-PURCHASE & BUNDLES",
    widgets: [
      { id: "upsell-builder", name: "Upsell Builder", popular: true, implemented: false },
      { id: "volume-discounts", name: "Volume Discounts", popular: false, implemented: true },
      { id: "spend-goal", name: "Spend Goal", popular: false, implemented: false },
      { id: "gift-reward", name: "Gift Rewards", popular: false, implemented: false },
      { id: "related-upsell", name: "Related Products Upsell", popular: false, implemented: false },
      { id: "post-purchase-upsell", name: "Post-Purchase One-Click", popular: false, implemented: false },
      { id: "cart-drawer", name: "Cart Drawer", popular: false, implemented: false },
      { id: "product-addon", name: "Product Add-ons", popular: false, implemented: false },
      { id: "product-bundles", name: "Product Bundles", popular: false, implemented: true },
      { id: "bogo", name: "BOGO (Buy X Get Y)", popular: false, implemented: false },
    ],
  },
  {
    title: "INCREASE SALES & CONVERSIONS",
    widgets: [
      { id: "size-chart", name: "Size Chart", popular: false, implemented: false },
      { id: "inactive-tab", name: "Inactive Tab Message", popular: false, implemented: true },
      { id: "favicon-cart", name: "Favicon Cart Count", popular: false, implemented: false },
      { id: "countdown-timer", name: "Countdown Timer", popular: false, implemented: true },
      { id: "animated-atc", name: "Animated Add to Cart", popular: false, implemented: true },
      { id: "related-products", name: "Related Products", popular: false, implemented: true },
      { id: "wishlist", name: "Wishlist", popular: false, implemented: false },
      { id: "shipping-info", name: "Shipping Info", popular: false, implemented: false },
      { id: "recently-viewed", name: "Recently Viewed", popular: false, implemented: false },
      { id: "stock-scarcity", name: "Stock Scarcity", popular: false, implemented: true },
      { id: "back-in-stock", name: "Back in Stock", popular: false, implemented: false },
      { id: "product-labels", name: "Product Labels", popular: false, implemented: false },
      { id: "sticky-atc", name: "Sticky Add to Cart", popular: true, implemented: true },
    ],
  },
  {
    title: "IMPROVE USER EXPERIENCE",
    widgets: [
      { id: "instant-search", name: "Instant Search", popular: false, implemented: false },
      { id: "live-chat", name: "Live Chat Channels", popular: false, implemented: false },
      { id: "live-visitor", name: "Live Visitor Counter", popular: true, implemented: true },
      { id: "hide-dynamic-checkout", name: "Hide Dynamic Checkout", popular: false, implemented: false },
      { id: "currency-converter", name: "Currency Converter", popular: false, implemented: true },
      { id: "quick-links", name: "Quick Links", popular: false, implemented: false },
      { id: "auto-external-links", name: "Auto External Links", popular: false, implemented: false },
      { id: "product-tabs", name: "Product Description Tabs", popular: false, implemented: false },
      { id: "scroll-to-top", name: "Scroll to Top", popular: false, implemented: true },
      { id: "visitor-replays", name: "Visitor Replays", popular: true, implemented: false },
    ],
  },
  {
    title: "MARKETING & LEADS",
    widgets: [
      { id: "popups", name: "Popups", popular: false, implemented: false },
      { id: "announcement-bar", name: "Announcement Bar", popular: false, implemented: true },
      { id: "email-marketing", name: "Email Marketing", popular: false, implemented: false },
      { id: "facebook-pixel", name: "Facebook Pixels", popular: false, implemented: false },
      { id: "push-marketing", name: "Push Notifications", popular: false, implemented: false },
      { id: "seo-alt-tags", name: "SEO ALT Tags", popular: false, implemented: false },
      { id: "cart-notification", name: "Cart Notification", popular: false, implemented: false },
      { id: "social-buttons", name: "Social Media Buttons", popular: false, implemented: false },
      { id: "spin-wheel", name: "Wheel of Fortune", popular: false, implemented: true },
    ],
  },
  {
    title: "STORE PROTECTION",
    widgets: [
      { id: "cookie-banner", name: "Cookie Banner", popular: false, implemented: true },
      { id: "bestseller-protection", name: "Bestseller Protection", popular: false, implemented: false },
      { id: "content-protection", name: "Content Protection", popular: false, implemented: false },
      { id: "terms-checkbox", name: "Agree to Terms Checkbox", popular: false, implemented: false },
    ],
  }
];

export default function Index() {
  const { totalViews, totalClicks, totalReviews, shop } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  const filteredCategories = ALL_CATEGORIES.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget => 
      widget.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.widgets.length > 0);

  return (
    <Page fullWidth>
      <TitleBar title="TrustWidget: Super-App Dashboard" />
      <BlockStack gap="600">
        
        {/* Header Section with Logo */}
        <Box paddingBlockEnd="400">
          <InlineStack align="center" blockAlign="center" gap="400">
            <img 
              src="/logo.jpg" 
              alt="TrustWidget Logo" 
              style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover" }} 
            />
            <BlockStack gap="100">
              <Text as="h1" variant="heading3xl" fontWeight="bold">TrustWidget</Text>
              <Text as="p" variant="bodyLg" tone="subdued">
                Power up your e-commerce with one of the most powerful apps. 40+ Widgets in one place.
              </Text>
            </BlockStack>
          </InlineStack>
        </Box>

        {/* Global Analytics */}
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 4, md: 4, lg: 4, xl: 4}}>
            <Card>
              <BlockStack gap="200" align="center">
                <Text as="p" variant="bodyMd" tone="subdued">Total Views</Text>
                <Text as="p" variant="heading3xl">{totalViews}</Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 4, md: 4, lg: 4, xl: 4}}>
            <Card>
              <BlockStack gap="200" align="center">
                <Text as="p" variant="bodyMd" tone="subdued">Total Clicks & Engagements</Text>
                <Text as="p" variant="heading3xl" tone="success">{totalClicks}</Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 4, md: 4, lg: 4, xl: 4}}>
            <Card>
              <BlockStack gap="200" align="center">
                <Text as="p" variant="bodyMd" tone="subdued">Reviews Collected</Text>
                <Text as="p" variant="heading3xl" tone="magic">{totalReviews}</Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>

        {/* Super App Store UI */}
        <Card padding="500">
          <BlockStack gap="500">
            {/* Search Bar */}
            <TextField
              label="Search all apps"
              labelHidden
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search all apps..."
              prefix={<Icon source={SearchIcon} />}
              autoComplete="off"
              clearButton
              onClearButtonClick={() => setSearchQuery("")}
            />

            {/* Categorized Grid */}
            <Box paddingBlockStart="400">
              {filteredCategories.length === 0 ? (
                <Box padding="800">
                  <BlockStack align="center" inlineAlign="center">
                    <Text as="p" tone="subdued">No results found.</Text>
                  </BlockStack>
                </Box>
              ) : (
                <Grid>
                  {filteredCategories.map((category) => (
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 4, lg: 4, xl: 4}} key={category.title}>
                      <BlockStack gap="300">
                        <Text as="h3" variant="headingSm" tone="subdued" fontWeight="bold">
                          {category.title}
                        </Text>
                        <BlockStack gap="200">
                          {category.widgets.map((widget) => (
                            <Box 
                              key={widget.id}
                              padding="200"
                              borderRadius="200"
                              background="bg-surface-secondary"
                              onClick={() => widget.implemented ? navigate(`/app/widgets/${widget.id}`) : null}
                              style={{ 
                                cursor: widget.implemented ? "pointer" : "default", 
                                transition: "background 0.2s",
                                opacity: widget.implemented ? 1 : 0.6
                              }}
                            >
                              <InlineStack align="space-between" blockAlign="center">
                                <InlineStack gap="200" blockAlign="center">
                                  <Box 
                                    style={{ 
                                      width: "8px", 
                                      height: "8px", 
                                      borderRadius: "50%", 
                                      backgroundColor: widget.implemented ? "var(--p-color-border-interactive-hover)" : "var(--p-color-border-subdued)" 
                                    }} 
                                  />
                                  <Text as="span" variant="bodyMd">{widget.name}</Text>
                                </InlineStack>
                                <InlineStack gap="200">
                                  {!widget.implemented && (
                                    <Badge tone="attention">Coming Soon</Badge>
                                  )}
                                  {widget.popular && (
                                    <Badge tone="info">Popular</Badge>
                                  )}
                                </InlineStack>
                              </InlineStack>
                            </Box>
                          ))}
                        </BlockStack>
                        <Box paddingBlockEnd="400" />
                      </BlockStack>
                    </Grid.Cell>
                  ))}
                </Grid>
              )}
            </Box>
          </BlockStack>
        </Card>

      </BlockStack>
    </Page>
  );
}
