import {
  Page,
  Layout,
  Card,
  IndexTable,
  useIndexResourceState,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  EmptyState
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const reviews = await db.review.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: "desc" },
  });
  return json({ reviews });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const actionType = formData.get("actionType");
  const reviewId = Number(formData.get("reviewId"));

  if (actionType === "delete") {
    await db.review.delete({ where: { id: reviewId, shop: session.shop } });
  } else if (actionType === "togglePublish") {
    const isPublished = formData.get("isPublished") === "true";
    await db.review.update({
      where: { id: reviewId, shop: session.shop },
      data: { isPublished: !isPublished }
    });
  }

  return json({ success: true });
};

export default function ReviewsPage() {
  const { reviews } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(reviews);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      fetcher.submit({ actionType: "delete", reviewId: id.toString() }, { method: "POST" });
    }
  };

  const handleToggle = (id: number, currentStatus: boolean) => {
    fetcher.submit({ 
      actionType: "togglePublish", 
      reviewId: id.toString(), 
      isPublished: currentStatus.toString() 
    }, { method: "POST" });
  };

  const rowMarkup = reviews.map(
    ({ id, productId, author, rating, body, isPublished, createdAt }, index) => (
      <IndexTable.Row
        id={id.toString()}
        key={id}
        selected={selectedResources.includes(id.toString())}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">{author}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {Array(rating).fill('★').join('')}{Array(5 - rating).fill('☆').join('')}
        </IndexTable.Cell>
        <IndexTable.Cell>{body}</IndexTable.Cell>
        <IndexTable.Cell>
          {isPublished ? <Badge tone="success">Published</Badge> : <Badge tone="critical">Hidden</Badge>}
        </IndexTable.Cell>
        <IndexTable.Cell>{new Date(createdAt).toLocaleDateString()}</IndexTable.Cell>
        <IndexTable.Cell>
          <InlineStack gap="200">
            <Button size="micro" onClick={() => handleToggle(id, isPublished)}>
              {isPublished ? "Hide" : "Publish"}
            </Button>
            <Button size="micro" tone="critical" onClick={() => handleDelete(id)}>Delete</Button>
          </InlineStack>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page>
      <TitleBar title="Product Reviews Management" />
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {reviews.length === 0 ? (
              <EmptyState
                heading="No reviews yet"
                action={{ content: 'View Store', url: `https://${reviews.length ? '' : ''}`, target: '_blank' }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>When customers leave reviews using the Product Reviews widget, they will appear here.</p>
              </EmptyState>
            ) : (
              <IndexTable
                resourceName={{ singular: 'review', plural: 'reviews' }}
                itemCount={reviews.length}
                selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: 'Author' },
                  { title: 'Rating' },
                  { title: 'Review' },
                  { title: 'Status' },
                  { title: 'Date' },
                  { title: 'Actions' },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
