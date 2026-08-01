import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function PrivacyPage() {
  return (
    <Page backAction={{ content: "Dashboard", url: "/app" }}>
      <TitleBar title="Privacy & GDPR Compliance" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">
                Data Processing Agreement (DPA)
              </Text>
              <Text as="p" variant="bodyMd">
                TrustWidget is fully compliant with GDPR/DSGVO. We do not store personally identifiable information (PII) of your customers. 
              </Text>
              <Text as="h3" variant="headingMd">
                What data do we collect?
              </Text>
              <Text as="p" variant="bodyMd">
                - **Orders**: We only store the customer's first name, city, and purchased item name/URL. We do NOT store emails, full addresses, or phone numbers.
                <br/>
                - **Inventory**: We monitor stock levels to display low-stock alerts.
              </Text>
              <Text as="h3" variant="headingMd">
                Shopify Customer Privacy API
              </Text>
              <Text as="p" variant="bodyMd">
                Our widgets automatically respect the consent given by visitors through Shopify's Customer Privacy API. If a user declines tracking, our widgets will adjust their behavior accordingly.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
