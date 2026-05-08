import { useState, useCallback } from "react";
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
  AppProvider,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export default function TestUI() {
  // Mock data for the dashboard (Same as index)
  const cityData = [
    { id: "1", city: "Karachi", bestCourier: "Leopards", successRate: "96%", avgTime: "1.1 Days", risk: "Low" },
    { id: "2", city: "Lahore", bestCourier: "Trax", successRate: "93%", avgTime: "1.4 Days", risk: "Low" },
    { id: "3", city: "Islamabad", bestCourier: "M&P", successRate: "97%", avgTime: "1.0 Days", risk: "Very Low" },
    { id: "4", city: "Multan", bestCourier: "BlueEx", successRate: "91%", avgTime: "1.6 Days", risk: "Medium" },
    { id: "5", city: "Faisalabad", bestCourier: "TCS", successRate: "94%", avgTime: "1.3 Days", risk: "Low" },
    { id: "6", city: "Quetta", bestCourier: "Leopards", successRate: "88%", avgTime: "2.1 Days", risk: "Medium" },
    { id: "7", city: "Peshawar", bestCourier: "M&P", successRate: "92%", avgTime: "1.5 Days", risk: "Low" },
    { id: "8", city: "Sialkot", bestCourier: "Trax", successRate: "95%", avgTime: "1.2 Days", risk: "Low" },
  ];

  const stats = {
    deliveryRate: "94%",
    totalOrders: "12,450",
    activeCouriers: "5",
    trend: "+3.35%",
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = useCallback((value: string) => setSearchValue(value), []);

  const filteredCityData = cityData.filter((item) =>
    item.city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const resourceName = {
    singular: "city performance",
    plural: "city performances",
  };

  const rowMarkup = filteredCityData.map(
    ({ id, city, bestCourier, successRate, avgTime, risk }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {city}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone="info">{bestCourier}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{successRate}</IndexTable.Cell>
        <IndexTable.Cell>{avgTime}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={risk === "Very Low" || risk === "Low" ? "success" : "attention"}>
            {risk}
          </Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <AppProvider i18n={{}}>
      <Page fullWidth title="Courier Rank Preview (Local)">
        <BlockStack gap="500">
          <Layout>
            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">Overall Delivery Rate</Text>
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="heading2xl" tone="success">{stats.deliveryRate}</Text>
                    <Box background="bg-surface-success" padding="100" borderRadius="100">
                      <Text as="span" variant="bodyXs" tone="success">Stable</Text>
                    </Box>
                  </InlineStack>
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">Total Orders Processed</Text>
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="heading2xl">{stats.totalOrders}</Text>
                    <Text as="span" variant="bodySm" tone="success">{stats.trend}</Text>
                  </InlineStack>
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">Active Courier Partners</Text>
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="heading2xl">{stats.activeCouriers}</Text>
                    <InlineStack gap="100">
                      <Badge tone="info">Live</Badge>
                    </InlineStack>
                  </InlineStack>
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
                      <Text as="h2" variant="headingMd">Courier Performance by City</Text>
                      <div style={{ width: "300px" }}>
                        <TextField
                          label="Search city"
                          labelHidden
                          value={searchValue}
                          onChange={handleSearchChange}
                          prefix={<Icon source={SearchIcon} />}
                          placeholder="Search city (e.g., Karachi, Lahore...)"
                          autoComplete="off"
                        />
                      </div>
                    </InlineStack>
                    <IndexTable
                      resourceName={resourceName}
                      itemCount={filteredCityData.length}
                      selectable={false}
                      headings={[
                        { title: "City" },
                        { title: "Best Courier" },
                        { title: "Success Rate" },
                        { title: "Avg. Delivery Time" },
                        { title: "Return Risk" },
                      ]}
                    >
                      {filteredCityData.length > 0 ? (
                        rowMarkup
                      ) : (
                        <EmptySearchResult title="No cities found" description="Try a different search term" withIllustration />
                      )}
                    </IndexTable>
                  </BlockStack>
                </Box>
              </Card>
            </Layout.Section>

            <Layout.Section variant="oneThird">
              <BlockStack gap="500">
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">Intelligence Center</Text>
                    <Box
                      minHeight="200px"
                      background="bg-surface-secondary"
                      borderRadius="200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderWidth="025"
                      borderColor="border"
                      borderStyle="dashed"
                    >
                      <Text as="p" variant="bodyMd" tone="subdued">Logistics Heatmap Placeholder</Text>
                    </Box>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">Recent High-Risk Alerts</Text>
                    <BlockStack gap="300">
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">Peshawar RTO Spike</Text>
                        <Badge tone="critical">High Risk</Badge>
                      </InlineStack>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </Page>
    </AppProvider>
  );
}
