import db from "../db.server";

export async function syncWidgetConfigToMetafield(admin: any, shop: string) {
  try {
    // 1. Get all widget configs for this shop from local DB
    const allConfigs = await db.widgetConfig.findMany({
      where: { shop }
    });

    // 2. Format them into a master JSON object
    const masterConfig: Record<string, any> = {};
    for (const config of allConfigs) {
      masterConfig[config.widgetId] = {
        isActive: config.isActive,
        ...JSON.parse(config.settings || '{}')
      };
    }

    const configJsonString = JSON.stringify(masterConfig);

    // 3. Get the App Installation ID
    const appInstallationResponse = await admin.graphql(`
      query {
        currentAppInstallation {
          id
        }
      }
    `);
    const appInstData = await appInstallationResponse.json();
    const appInstId = appInstData.data.currentAppInstallation.id;

    // 4. Set the metafield on the AppInstallation
    const setMetafieldResponse = await admin.graphql(`
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: {
        metafields: [
          {
            ownerId: appInstId,
            namespace: "trustwidget",
            key: "config",
            type: "json",
            value: configJsonString
          }
        ]
      }
    });

    const setMetafieldData = await setMetafieldResponse.json();
    
    if (setMetafieldData.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error("Metafield Set Errors:", setMetafieldData.data.metafieldsSet.userErrors);
    } else {
      console.log(`Successfully synced config to Metafield for ${shop}`);
    }
  } catch (error) {
    console.error("Error syncing widget config to metafield:", error);
  }
}
