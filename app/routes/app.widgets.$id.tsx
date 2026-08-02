import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation, useActionData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Badge,
  Banner,
  Box,
  TextField,
  Divider,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { syncWidgetConfigToMetafield } from "../utils/metafields.server";
import { useState, useCallback, useEffect } from "react";
import { WidgetPreview } from "../components/WidgetPreview";

// Mapping widget IDs to their display names and descriptions
const WIDGET_META: Record<string, { name: string; description: string }> = {
  "instagram-feed": { name: "Alışveriş Yapılabilir Instagram Akışı", description: "Instagram gönderilerinizi mağazanızda gösterin ve doğrudan satış yapın." },
  "trust-badges": { name: "Güven Mühürleri ve Rozetleri", description: "Müşterilerinize güven vermek için ödeme logoları ve güvenlik mühürleri ekleyin." },
  "payment-logos": { name: "Ödeme Logoları", description: "Kabul ettiğiniz ödeme yöntemlerini ürün sayfalarında gösterin." },
  "sales-pop": { name: "Son Satış Bildirimleri", description: "Gerçek zamanlı satın alma bildirimleriyle sosyal kanıt oluşturun." },
  "live-visitor": { name: "Canlı Ziyaretçi Sayacı", description: "Mağazanızı şu an inceleyen ziyaretçi sayısını göstererek aciliyet hissi yaratın." },
  "product-reviews": { name: "Ürün İncelemeleri", description: "Müşteri yorumlarını toplayın ve dönüşümleri artırmak için sergileyin." },
  "upsell-builder": { name: "Ek Satış Oluşturucu", description: "Müşterilere tamamlayıcı ürünler sunarak sepet tutarını artırın." },
  "volume-discounts": { name: "Hacim İndirimleri", description: "Çoklu alımlarda indirim uygulayarak toplu satışı teşvik edin." },
  "spend-goal": { name: "Harcama Hedefi", description: "Müşterileri belirli bir sepet tutarına ulaşmaya teşvik edin (örn: Ücretsiz Kargo)." },
  "gift-reward": { name: "Hediye", description: "Belirli bir tutarın üzerindeki alışverişlere otomatik hediye ekleyin." },
  "related-upsell": { name: "İlgili Ürünler Ek Satış", description: "Ürün sayfasında ilgili ürünleri gösterin." },
  "post-purchase-upsell": { name: "Satın Alma Sonrası", description: "Ödeme yapıldıktan hemen sonra tek tıkla ek teklifler sunun." },
  "cart-drawer": { name: "Sepet Çekmecesi", description: "Sepeti sayfadan ayrılmadan, şık bir çekmece içinde gösterin." },
  "product-addon": { name: "Ürün Eklentisi", description: "Ürünlere hediye paketi veya garanti gibi ek seçenekler sunun." },
  "product-bundles": { name: "Ürün Paketleri", description: "Sık birlikte alınan ürünleri paket halinde satarak AOV artırın." },
  "bogo": { name: "X al Y al", description: "Bir ürün alana diğerini indirimli veya bedava sunun." },
  "size-chart": { name: "Beden Tablosu", description: "Giyim ürünleri için detaylı beden tabloları oluşturun." },
  "inactive-tab": { name: "Etkin Olmayan Sekme", description: "Kullanıcı başka sekmeye geçtiğinde dikkat çekici bir mesaj gösterin." },
  "favicon-cart": { name: "Favicon Sepeti Sayısı", description: "Tarayıcı sekmesinde sepetteki ürün sayısını gösterin." },
  "countdown-timer": { name: "Geri Sayım Saati", description: "Sınırlı süreli teklifler için aciliyet hissi yaratan sayaçlar ekleyin." },
  "animated-atc": { name: "Hareketli Sepete Ekle", description: "Sepete Ekle butonuna dikkat çekici animasyonlar ekleyin." },
  "related-products": { name: "İlgili Ürünler", description: "Müşterilerin ilgisini çekebilecek alternatif ürünler sunun." },
  "wishlist": { name: "İstek Listesi", description: "Müşterilerin favori ürünlerini kaydetmesini sağlayın." },
  "shipping-info": { name: "Nakliye Bilgisi", description: "Ürün sayfalarında tahmini teslimat sürelerini gösterin." },
  "recently-viewed": { name: "Son Görüntülenen", description: "Müşterinin daha önce incelediği ürünleri hatırlatın." },
  "stock-scarcity": { name: "Stok Kıtlığı", description: "Azalan stokları göstererek FOMO (Kaçırma Korkusu) yaratın." },
  "back-in-stock": { name: "Tekrar Stokta", description: "Tükenen ürünler için stok bildirim aboneliği oluşturun." },
  "product-labels": { name: "Ürün Etiketleri", description: "Ürün görselleri üzerine 'Yeni', 'İndirim' gibi etiketler ekleyin." },
  "sticky-atc": { name: "Yapışkan Sepete Ekle", description: "Kullanıcı sayfayı kaydırırken Sepete Ekle butonunu sabit tutun." },
  "instant-search": { name: "Anında Arama", description: "Hızlı ve akıllı canlı arama sonuçları gösterin." },
  "live-chat": { name: "Canlı Sohbet Kanalları", description: "WhatsApp, Messenger gibi kanallardan destek sunun." },
  "hide-dynamic-checkout": { name: "Dinamik Ödemeyi Gizle", description: "Dinamik ödeme butonlarını gizleyerek kullanıcıları sepetinize yönlendirin." },
  "currency-converter": { name: "Döviz Çevirici", description: "Fiyatları ziyaretçinin yerel para biriminde gösterin." },
  "quick-links": { name: "Hızlı Erişim", description: "Sık kullanılan sayfalara kolay erişim menüsü ekleyin." },
  "auto-external-links": { name: "Otomatik Dış Bağlantı", description: "Dış bağlantıların otomatik olarak yeni sekmede açılmasını sağlayın." },
  "product-tabs": { name: "Ürün Açıklaması Sekmeleri", description: "Uzun ürün açıklamalarını düzenli sekmeler halinde sunun." },
  "scroll-to-top": { name: "Üst Düğmeye Kaydır", description: "Uzun sayfalarda tek tıkla en üste çıkma butonu ekleyin." },
  "visitor-replays": { name: "Ziyaretçi Kayıtları", description: "Müşterilerinizin mağazanızdaki hareketlerini izleyin." },
  "popups": { name: "Açılır Pencereler", description: "E-posta toplamak veya kampanya duyurmak için popup'lar kullanın." },
  "announcement-bar": { name: "Duyuru Çubukları", description: "Sitenin en üstünde dikkat çekici duyuru barları gösterin." },
  "email-marketing": { name: "E-posta Pazarlama", description: "Otomatik e-posta kampanyaları oluşturun." },
  "facebook-pixel": { name: "Facebook Pikselleri", description: "Meta reklamları için gelişmiş izleme pikselleri entegre edin." },
  "push-marketing": { name: "Pazarlamayı İtin", description: "Tarayıcı bildirimleri ile müşterilerinize doğrudan ulaşın." },
  "seo-alt-tags": { name: "SEO ALT Etiketleri", description: "Görsellerinize otomatik SEO uyumlu alt etiketler ekleyin." },
  "cart-notification": { name: "Sepet Bildirimi", description: "Ürün eklendiğinde şık bir onay bildirimi gösterin." },
  "social-buttons": { name: "Sosyal Medya Düğmeleri", description: "Ürünlerinizin sosyal ağlarda paylaşılmasını kolaylaştırın." },
  "spin-wheel": { name: "Tekerleği Döndür", description: "E-posta toplamak için oyunlaştırılmış çarkıfelek popup'ı ekleyin." },
  "cookie-banner": { name: "Çerez Afişi", description: "GDPR uyumlu çerez onay bildirimleri gösterin." },
  "bestseller-protection": { name: "En Çok Satanlar Koruması", description: "Rakiplerin en çok satan ürünlerinizi kopyalamasını önleyin." },
  "content-protection": { name: "İçerik Koruması", description: "Sağ tık ve metin seçimini engelleyerek içerik hırsızlığını durdurun." },
  "terms-checkbox": { name: "Şartları Kabul Et Onay", description: "Sepet sayfasında hizmet şartları kabul kutucuğu zorunluluğu ekleyin." },
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const widgetId = params.id as string;
  const shop = session.shop;

  const meta = WIDGET_META[widgetId] || { name: widgetId, description: "Widget ayarları" };

  let config = await db.widgetConfig.findUnique({
    where: { shop_widgetId: { shop, widgetId } },
  });

  if (!config) {
    config = await db.widgetConfig.create({
      data: {
        shop,
        widgetId,
        isActive: false,
        settings: JSON.stringify({ primaryColor: "#000000", customText: "" })
      }
    });
  }

  return json({ widgetId, meta, config, shop });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const widgetId = params.id as string;
  
  const formData = await request.formData();
  const actionType = formData.get("_action");
  
  if (actionType === "toggle") {
    const isActive = formData.get("isActive") === "true";
    await db.widgetConfig.update({
      where: { shop_widgetId: { shop, widgetId } },
      data: { isActive }
    });
    
    // Sync to Shopify Metafields
    await syncWidgetConfigToMetafield(admin, shop);
    
    return json({ success: true, message: `Widget ${isActive ? 'enabled' : 'disabled'}.` });
  }

  if (actionType === "saveSettings") {
    const primaryColor = formData.get("primaryColor");
    const customText = formData.get("customText");
    const isAbTestActive = formData.get("isAbTestActive") === "true";
    const customTextA = formData.get("customTextA");
    const customTextB = formData.get("customTextB");
    const settings = JSON.stringify({ primaryColor, customText, isAbTestActive, customTextA, customTextB });
    
    await db.widgetConfig.update({
      where: { shop_widgetId: { shop, widgetId } },
      data: { settings }
    });

    // Sync to Shopify Metafields
    await syncWidgetConfigToMetafield(admin, shop);

    return json({ success: true, message: "Settings saved successfully." });
  }

  return json({ success: false }, { status: 400 });
};

export default function WidgetConfig() {
  const { widgetId, meta, config } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const nav = useNavigation();
  const isSaving = nav.state === "submitting";

  const [isActive, setIsActive] = useState(config.isActive);
  const settingsParsed = config.settings ? JSON.parse(config.settings) : { primaryColor: "#000000", customText: "", isAbTestActive: false, customTextA: "", customTextB: "" };
  
  const [primaryColor, setPrimaryColor] = useState(settingsParsed.primaryColor || "#000000");
  const [customText, setCustomText] = useState(settingsParsed.customText || "");
  const [isAbTestActive, setIsAbTestActive] = useState(settingsParsed.isAbTestActive || false);
  const [customTextA, setCustomTextA] = useState(settingsParsed.customTextA || "");
  const [customTextB, setCustomTextB] = useState(settingsParsed.customTextB || "");

  // Sync state if action updates it
  useEffect(() => {
    setIsActive(config.isActive);
  }, [config.isActive]);

  const handleToggle = useCallback(() => {
    const newState = !isActive;
    setIsActive(newState);
    submit({ _action: "toggle", isActive: newState.toString() }, { method: "POST" });
  }, [isActive, submit]);

  const handleSaveSettings = useCallback(() => {
    submit({ 
      _action: "saveSettings", 
      primaryColor, 
      customText, 
      isAbTestActive: isAbTestActive.toString(),
      customTextA,
      customTextB
    }, { method: "POST" });
  }, [primaryColor, customText, isAbTestActive, customTextA, customTextB, submit]);

  return (
    <Page 
      backAction={{ content: 'Dashboard', url: '/app' }}
      title={meta.name}
      subtitle={meta.description}
      primaryAction={
        <Button variant="primary" onClick={handleSaveSettings} loading={isSaving}>
          Save Settings
        </Button>
      }
    >
      <TitleBar title={meta.name} />
      <BlockStack gap="500">
        
        {actionData?.message && (
          <Banner tone="success">
            {actionData.message}
          </Banner>
        )}

        {/* Hero Visual Preview */}
        <Card padding="0">
          <WidgetPreview widgetId={widgetId} metaName={meta.name} />
          <Box padding="400">
            <Text as="p" variant="bodyMd">{meta.description}</Text>
          </Box>
        </Card>

        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingMd">Status: {isActive ? "Active" : "Disabled"}</Text>
                    <Text as="p" tone="subdued">Determine if this widget should be visible on your store.</Text>
                  </BlockStack>
                  <Button 
                    variant={isActive ? "primary" : "secondary"} 
                    tone={isActive ? "critical" : "success"}
                    onClick={handleToggle}
                    loading={isSaving && nav.formData?.get("_action") === "toggle"}
                  >
                    {isActive ? "Disable" : "Enable"}
                  </Button>
                </InlineStack>
                {isActive && (
                  <Box paddingBlockStart="200">
                    <Badge tone="success">Live</Badge>
                  </Box>
                )}
              </BlockStack>
            </Card>

            {isActive && (
              <>
                <Box paddingBlockStart="500">
                  <Text as="h3" variant="headingMd">Customization</Text>
                </Box>

                <Box paddingBlockStart="300">
                  <Card>
                    <BlockStack gap="400">
                      <TextField
                        label="Primary Color"
                        value={primaryColor}
                        onChange={setPrimaryColor}
                        autoComplete="off"
                        helpText="Enter the primary color in HEX format (e.g. #FF0000)"
                      />
                      <Divider />

                      <Box paddingBlockStart="200" paddingBlockEnd="200">
                        <InlineStack align="space-between">
                          <Text as="h3" variant="headingSm">Enable A/B Testing</Text>
                          <Button 
                            variant={isAbTestActive ? "primary" : "secondary"}
                            tone={isAbTestActive ? "success" : undefined}
                            onClick={() => setIsAbTestActive(!isAbTestActive)}
                          >
                            {isAbTestActive ? "On" : "Off"}
                          </Button>
                        </InlineStack>
                        <Text as="p" tone="subdued">Test different texts to see which one converts better.</Text>
                      </Box>

                      {isAbTestActive ? (
                        <BlockStack gap="300">
                          <TextField
                            label="Variant A Text"
                            value={customTextA}
                            onChange={setCustomTextA}
                            autoComplete="off"
                            helpText="50% of visitors will see this text."
                          />
                          <TextField
                            label="Variant B Text"
                            value={customTextB}
                            onChange={setCustomTextB}
                            autoComplete="off"
                            helpText="The other 50% will see this text."
                          />
                        </BlockStack>
                      ) : (
                        <TextField
                          label="Custom Text / Title"
                          value={customText}
                          onChange={setCustomText}
                          autoComplete="off"
                          helpText="Enter a custom title or text for this widget."
                        />
                      )}
                    </BlockStack>
                  </Card>
                </Box>
              </>
            )}
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">Integration</Text>
                <Text as="p" tone="subdued">
                  After enabling the widget, you may need to activate the App Embed in your Theme Settings.
                </Text>
                <Button 
                  url="shopify://admin/themes/current/editor?context=apps" 
                  target="_blank"
                  fullWidth
                >
                  Open Theme Editor
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
