import { useNavigate, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineGrid,
  Banner,
  Icon,
  Button,
  Box,
  Modal,
} from "@shopify/polaris";
import {
  DiscountIcon,
  DeleteIcon,
  DatabaseIcon,
  QuestionCircleIcon,
  ClockIcon,
} from "@shopify/polaris-icons";

export default function HomePage() {
  const navigate = useNavigate();
  const fetcher = useFetcher<any>();

  // ---- STATE ----
  const [isDbCreated, setIsDbCreated] = useState(false);
  const [dbChecked, setDbChecked] = useState(false); // 👈 critical
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ---- CHECK DB ON MOUNT ----
  useEffect(() => {
    fetcher.load("/api/check/db");
  }, []);

  // ---- HANDLE FETCHER RESULTS ----
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    const success = Boolean(fetcher.data?.success);

    setIsDbCreated(success);
    setDbChecked(true);

    // Handle DB creation completion
    if (isSubmitting) {
      setIsSubmitting(false);
      setModalOpen(false);

      if (success) {
        setShowSuccess(true);
      }
    }
  }, [fetcher.state, fetcher.data, isSubmitting]);

  // ---- CREATE DB ----
  const createDatabase = () => {
    setIsSubmitting(true);
    fetcher.submit(
      {},
      {
        method: "post",
        action: "/api/metaCreate/db",
      }
    );
  };

  // ---- MODULES ----
  const modules = [
    {
      title: "Add Tags",
      desc:
        "Quickly append multiple tags to products, customers, blogposts, or orders using a simple CSV identifier list.",
      route: "/app/add-tags",
      icon: DiscountIcon,
      action: "Add Tags",
      tone: "success",
    },
    {
      title: "Remove Tags",
      desc:
        "Search for tags by condition and remove them from your entire store or specific items via CSV upload.",
      route: "/app/remove-tags",
      icon: DeleteIcon,
      action: "Remove Tags",
      tone: "critical",
    },
    {
      title: "Metafield Manager",
      desc:
        "Manage metafield definitions and values. Clear data globally or perform bulk updates using CSV files.",
      route: "/app/metafield-manage",
      icon: DatabaseIcon,
      action: "Manage Metafields",
      tone: "highlight",
    },
  ];

  return (
    <Page
      title="Tag Metafield Manager"
      subtitle="The all-in-one toolkit for bulk store data manipulation."
      secondaryActions={[
        {
          content: "History",
          icon: ClockIcon,
          onAction: () => navigate("/app/history"),
        },
        {
          content: "FAQ",
          icon: QuestionCircleIcon,
          onAction: () => navigate("/app/faq"),
        },
      ]}
    >

      <BlockStack gap="500">
        {dbChecked && !isDbCreated && (
          <Layout>
            <Layout.Section>
              <Banner
                title="Database Setup Required"
                tone="warning"
                icon={DatabaseIcon}
                action={{
                  content: "Create Database",
                  onAction: () => setModalOpen(true),
                }}
              >
                <p>
                  Please initialize your database to enable activity history tracking
                  and the data restore feature.
                </p>
              </Banner>
            </Layout.Section>
          </Layout>
        )}

        {/* MODULE GRID */}
        <Layout>
          <Layout.Section>
            <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
              {modules.map((module, index) => (
                <Card key={index} roundedAbove="sm">
                  <BlockStack gap="400">
                    <Box
                      background="bg-surface-secondary"
                      padding="300"
                      borderRadius="200"
                      width="40px"
                    >
                      <Icon source={module.icon} tone={module.tone as any} />
                    </Box>

                    <BlockStack gap="200">
                      <Text as="h2" variant="headingMd">
                        {module.title}
                      </Text>
                      <Box minHeight="64px">
                        <Text as="p" variant="bodyMd" tone="subdued">
                          {module.desc}
                        </Text>
                      </Box>
                    </BlockStack>

                    <Button
                      fullWidth
                      variant="primary"
                      onClick={() => navigate(module.route)}
                    >
                      {module.action}
                    </Button>
                  </BlockStack>
                </Card>
              ))}
            </InlineGrid>
          </Layout.Section>

          <Layout.Section>
            <Banner
              title="Export your store data"
              tone="info"
              action={{
                content: "Export Data",
                onAction: () => navigate("/app/export-data"),
              }}
            >
              <p>
                Export your store data as CSV to review and prepare changes
                before running any operation.
              </p>
            </Banner>
          </Layout.Section>
        </Layout>
      </BlockStack>

      {/* CREATE DB MODAL */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Database"
        primaryAction={{
          content: "Yes, Create",
          onAction: createDatabase,
          loading: isSubmitting,
        }}
        secondaryActions={[
          {
            content: "Maybe Later",
            onAction: () => setModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Creating a metaobject named{" "}
            <Text as="span" fontWeight="bold">
              “Tag Metafield App Database”
            </Text>{" "}
            to store your app activity history. Would you like to continue?
          </Text>
        </Modal.Section>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Database Created Successfully"
        primaryAction={{
          content: "Close",
          onAction: () => setShowSuccess(false),
        }}
      >
        <Modal.Section>
          <Text as="p">
            Your database has been created successfully. You can now track and
            view all history.
          </Text>
        </Modal.Section>
      </Modal>
    </Page >
  );
}
