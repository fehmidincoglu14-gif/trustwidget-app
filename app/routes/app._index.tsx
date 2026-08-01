import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Badge,
  CalloutCard,
  Grid,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const totalViews = await db.abTestEvent.count({ where: { shop, eventType: "view" } });
  const totalClicks = await db.abTestEvent.count({ where: { shop, eventType: "click" } });
  
  // Very simple metrics for the dashboard MVP
  return json({ totalViews, totalClicks });
};

export default function Index() {
  const { totalViews, totalClicks } = useLoaderData<typeof loader>();
  
  return (
    <Page>
      <TitleBar title="TrustWidget: Social Proof Dashboard" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <CalloutCard
              title="Welcome to TrustWidget!"
              illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10cb55609b11adece9b6bb000.svg"
              primaryAction={{
                content: "Customize Widgets",
                url: "shopify://admin/themes/current/editor?context=apps",
              }}
            >
              <p>
                Your all-in-one social proof solution. Enable, disable, and customize your widgets directly from your Theme Editor without injecting any code.
              </p>
            </CalloutCard>
          </Layout.Section>

          <Layout.Section>
            <Text as="h2" variant="headingLg">Performance Analytics (Phase 3)</Text>
            <Box paddingBlockStart="300">
              <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                  <Card>
                    <BlockStack gap="200" align="center">
                      <Text as="p" variant="bodyMd" tone="subdued">Total Widget Views</Text>
                      <Text as="p" variant="heading3xl">{totalViews}</Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                  <Card>
                    <BlockStack gap="200" align="center">
                      <Text as="p" variant="bodyMd" tone="subdued">Total Interactions (Clicks)</Text>
                      <Text as="p" variant="heading3xl" tone="success">{totalClicks}</Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
              </Grid>
            </Box>
          </Layout.Section>

          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Active Widgets (App Blocks)
                </Text>
                <List type="bullet">
                  <List.Item>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">Recent Sales Pop</Text>
                      <Badge tone="success">Ready</Badge>
                    </InlineStack>
                  </List.Item>
                  <List.Item>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">Live Visitor Counter</Text>
                      <Badge tone="success">Ready</Badge>
                    </InlineStack>
                  </List.Item>
                  <List.Item>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">Low Stock Alert</Text>
                      <Badge tone="success">Ready</Badge>
                    </InlineStack>
                  </List.Item>
                  <List.Item>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">Sticky Announcement Bar</Text>
                      <Badge tone="success">Ready</Badge>
                    </InlineStack>
                  </List.Item>
                </List>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  GDPR & Privacy Compliance
                </Text>
                <Text as="p" variant="bodyMd">
                  TrustWidget is built with EU data privacy in mind. We only process anonymous data and fully integrate with Shopify's Customer Privacy API.
                </Text>
                <Box paddingBlockStart="200">
                  <Button url="/app/privacy" variant="plain">
                    View Data Processing Agreement
                  </Button>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
