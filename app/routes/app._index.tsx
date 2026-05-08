import { useState, useCallback } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Box,
  InlineStack,
  IndexTable,
  TextField,
  Badge,
  Icon,
  EmptySearchResult,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getCourierRankings } from "../utils/courierLogic.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // Fetch real data from Firebase
  const rankings = await getCourierRankings();
  
  // Aggregate stats
  const totalOrders = rankings.reduce((acc, curr: any) => acc + (curr.totalOrders || 0), 0);
  const avgSuccess = rankings.length > 0 
    ? (rankings.reduce((acc, curr: any) => acc + parseFloat(curr.successRate || 0), 0) / rankings.length).toFixed(1) + "%"
    : "0%";
    
  // Find top city
  const cityPerformance: any = {};
  rankings.forEach((r: any) => {
    if (!cityPerformance[r.city]) cityPerformance[r.city] = 0;
    cityPerformance[r.city] += parseFloat(r.successRate);
  });
  
  let topCity = "N/A";
  let maxScore = -1;
  Object.keys(cityPerformance).forEach(city => {
    if (cityPerformance[city] > maxScore) {
      maxScore = cityPerformance[city];
      topCity = city;
    }
  });

  return { 
    rankings, 
    stats: { 
      totalOrdersAnalysed: totalOrders.toLocaleString(), 
      avgDeliverySuccess: avgSuccess, 
      topPerformingCity: topCity 
    } 
  };
};

export default function Index() {
  const { rankings, stats } = useLoaderData<typeof loader>();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = useCallback((value: string) => setSearchValue(value), []);

  const filteredRankings = rankings.filter((item: any) =>
    item.city.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.courierName?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const resourceName = {
    singular: "ranking",
    plural: "rankings",
  };

  const getStatusTone = (rate: string) => {
    const val = parseFloat(rate);
    if (val >= 95) return "success";
    if (val >= 90) return "attention";
    return "critical";
  };

  const rowMarkup = filteredRankings.map(
    ({ id, city, courierName, successRate, avgDeliveryTime, returnRisk }: any, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">{city}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone="info">{courierName}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={getStatusTone(successRate)}>{successRate}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{avgDeliveryTime}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={returnRisk === "Low" ? "success" : returnRisk === "Medium" ? "attention" : "critical"}>
            {returnRisk}
          </Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page fullWidth>
      <TitleBar title="Courier Rank - Pakistan's Logistics Intelligence" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">Total Orders Analysed</Text>
                <Text as="p" variant="heading2xl" tone="brand">{stats.totalOrdersAnalysed}</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">Avg. Delivery Success</Text>
                <Text as="p" variant="heading2xl" tone="success">{stats.avgDeliverySuccess}</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">Top Performing City</Text>
                <Text as="p" variant="heading2xl">{stats.topPerformingCity}</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <Layout>
          <Layout.Section>
            <Card padding="0">
              <Box padding="400">
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingMd">Detailed Performance Rankings</Text>
                    <div style={{ width: "300px" }}>
                      <TextField
                        label="Search"
                        labelHidden
                        value={searchValue}
                        onChange={handleSearchChange}
                        prefix={<Icon source={SearchIcon} />}
                        placeholder="Search city or courier..."
                        autoComplete="off"
                      />
                    </div>
                  </InlineStack>
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={filteredRankings.length}
                    selectable={false}
                    headings={[
                      { title: "City" },
                      { title: "Courier" },
                      { title: "Success Score" },
                      { title: "Avg. Time" },
                      { title: "RTO Risk" },
                    ]}
                  >
                    {filteredRankings.length > 0 ? (
                      rowMarkup
                    ) : (
                      <EmptySearchResult title="No data found" description="Connect your courier accounts to see rankings" withIllustration />
                    )}
                  </IndexTable>
                </BlockStack>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
