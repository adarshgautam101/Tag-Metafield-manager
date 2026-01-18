import { useEffect, useState, type ReactNode } from "react";
import { useFetcher, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { LogsTable, type Log } from "app/component/HistoryForm";
import {
  Page,
  Layout,
  Text,
  BlockStack,
  InlineStack,
  Icon,
  Box,
  Modal,
  ProgressBar,
} from "@shopify/polaris";
import { AlertTriangleIcon, HomeIcon } from "@shopify/polaris-icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

interface ModalState {
  isOpen?: boolean;
  title?: string;
  message?: ReactNode;
  logToRestore?: Log | null;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

interface FetchParams {
  cursor: string | null;
  direction: string;
}

export default function LogsPage() {
  const fetcher = useFetcher<any>();
  const navigate = useNavigate();
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restoreTotal, setRestoreTotal] = useState(0);
  const [restoreCompleted, setRestoreCompleted] = useState(0);
  const [globalId, setGlobalId] = useState<string | null>(null);
  const [restore, setRestore] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [iscreateDB, setIscreateDB] = useState(true);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  });

  const [lastFetchParams, setLastFetchParams] = useState<FetchParams>({
    cursor: null,
    direction: "next",
  });

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    logToRestore: null,
  });

  //  Run fetch only when restore is triggered manually
  function createDatabase() {
    fetcher.submit(
      {}, // no body needed
      {
        method: "post",
        action: "/api/metaCreate/db",
      }
    );
  }

  const handleCreateDatabaseClick = () => {
    setModalState({
      isOpen: true,
      title: "Create Database",
      message: (
        <span>
          Creating a metaobject named{" "}
          <span className="font-bold">"Tag Metafield App Database"</span> to
          store your app activity history. Would you like to continue?
        </span>
      ),
      logToRestore: null, // Not a restore action
    });
  };

  //  Run fetch only when restore is triggered manually
  useEffect(() => {
    if (!restore) return;

    const run = async () => {
      try {
        // 1️⃣ Always call timeout API first
        await fetch("/api/timeout/db", { method: "POST" });

        // 2️⃣ Call check API only after timeout succeeds
        const { cursor, direction } = lastFetchParams;
        const url = cursor
          ? `/api/check/db?cursor=${cursor}&direction=${direction}`
          : "/api/check/db";

        fetcher.load(url);
      } catch (error) {
        console.error("Restore flow failed:", error);
      }
    };

    run();
  }, [restore, lastFetchParams]);

  // Prevent reload/close while running
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRestoring) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRestoring]);

  useEffect(() => {
    const runRestore = async () => {
      const shouldRunRestore = restoreCompleted >= restoreTotal && isRestoring;
      if (!shouldRunRestore) return;

      const formData = new FormData();
      formData.append("rowId", globalId || "");

      const response = await fetch("/api/update-restore/db", {
        method: "POST",
        body: formData,
      });

      const res = await response.json();
      if (res.success) {
        setRestore(true); // triggers fetcher.load
      } else {
        console.error("Restore failed:", res.errors);
      }
    };

    runRestore();
  }, [restoreCompleted, restoreTotal]);

  // Handle fetch results safely
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (!fetcher?.data?.successdb) {
      setIscreateDB(false);
    } else {
      setIscreateDB(true);
    }
    setRestore(false);
    setLogs(fetcher?.data?.database);
    if (fetcher?.data?.pageInfo) {
      setPageInfo(fetcher.data.pageInfo);
    }
    setIsLoading(false);
    // Reset busy state and close modal if it was open for Create Database
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setIsSubmitting(false);
  }, [fetcher.state, fetcher.data]);

  // Pagination Handlers
  const handleNextPage = () => {
    if (pageInfo.hasNextPage) {
      setOpenRow(null);
      setIsLoading(true);
      const params = { cursor: pageInfo.endCursor, direction: "next" };
      setLastFetchParams(params);
      fetcher.load(
        `/api/check/db?cursor=${params.cursor}&direction=${params.direction}`
      );
    }
  };

  const handlePrevPage = () => {
    if (pageInfo.hasPreviousPage) {
      setOpenRow(null);
      setIsLoading(true);
      const params = { cursor: pageInfo.startCursor, direction: "prev" };
      setLastFetchParams(params);
      fetcher.load(
        `/api/check/db?cursor=${params.cursor}&direction=${params.direction}`
      );
    }
  };

  //  User clicks restore
  const handleRestoreClick = (log: Log) => {
    let message = "Are you sure you want to restore the removed data?";
    if (log.operation === "Tags-removed") {
      message = "Are you sure you want to restore the removed tags?";
    } else if (log.operation === "Tags-Added") {
      message = "Are you sure you want to remove the added tags?";
    } else if (log.operation === "Metafield-removed") {
      message = "Are you sure you want to restore the removed metafields?";
    } else if (log.operation === "Metafield-updated") {
      message = "Are you sure you want to revert the metafield updates?";
    }

    // Delay popup by 2 seconds
    setModalState({
      isOpen: true,
      title: "Confirm Restore",
      message,
      logToRestore: log,
    });
    setGlobalId(log.id);
  };

  //  Confirm restore or create DB
  const handleConfirmAction = async () => {
    setIsSubmitting(true);

    const { title } = modalState;

    // For Create Database, show busy state
    if (title === "Create Database") {
      createDatabase();
      return;
    }

    // For Restore, switch to restoring mode without closing modal
    const log = modalState.logToRestore;
    if (!log) {
      setIsSubmitting(false);
      setModalState({ ...modalState, isOpen: false });
      return;
    }

    // ... (existing restore logic)
    const operation = log.operation;
    const objectType = log.objectType;

    const rows =
      operation === "Tags-removed"
        ? log.value.filter((v) => v.removedTags?.length > 0)
        : log.value || [];

    if (!rows.length) {
      setIsSubmitting(false);
      return;
    }

    // Start restoring popup
    setRestoreCompleted(0);
    setRestoreTotal(rows.length);
    setIsRestoring(true);
    setIsSubmitting(false);
    // Perform restore sequentially
    for (let i = 0; i < rows.length; i++) {
      const v = rows[i];

      let payload: any = { id: v.id, objectType, operation };

      if (operation === "Tags-removed") {
        payload.tags = v.removedTags;
      } else if (operation === "Tags-Added") {
        payload.tags = v.tagList
          ? v.tagList.split(",").map((t: string) => t.trim())
          : [];
      } else if (operation === "Metafield-removed") {
        payload.namespace = v.namespace || v.data?.namespace;
        payload.key = v.key || v.data?.key;
        payload.type = v.type || v.data?.type;
        payload.value = v.value || v.data?.value;
      } else if (operation === "Metafield-updated") {
        payload.namespace = v.namespace || v.data?.namespace;
        payload.key = v.key || v.data?.key;
        payload.type = v.type || v.data?.type;
        payload.value = v.value || v.data?.value;
      }
      const formData = new FormData();
      formData.append("rows", JSON.stringify([payload]));

      const res = await fetch("/api/revert/db", {
        method: "POST",
        body: formData,
      }).then((r) => r.json());

      if (res.success) {
        setRestoreCompleted((prev) => prev + 1);
      }
    }
  };

  return (
    <Page>
      <div className="flex flex-col space-y-0.5 mb-3 rounded-sm">
        {/* Header Row */}
        <div className="flex items-center space-x-2">
          {/* Home Icon Button - Placed just before the title */}
          <button
            onClick={() => navigate("/app")}
            className="flex items-center cursor-pointer justify-center text-[#303030] hover:opacity-70 transition-opacity focus:outline-none"
            aria-label="Go to Home"
          >
            <Icon source={HomeIcon} />
          </button>
          <div className="text-xl font-bold leading-tight">
            Activity History
          </div>
          <div className="ml-auto" >
            <Box
              padding="100"
              background="bg-surface-warning"
              borderRadius="200"
              width="fit-content"
            >
              <InlineStack gap="200" align="start" blockAlign="center">
                <Icon source={AlertTriangleIcon} tone="warning" />
                <Text
                  as="span"
                  variant="bodySm"
                  tone="caution"
                  fontWeight="bold"
                >
                  History expires in 2 Days
                </Text>
              </InlineStack>
            </Box>
          </div>
        </div>

        {/* Subtitle - Aligned to start under the Title text (Icon 20px + Space 8px = 28px) */}
        <p className="text-[14px] text-[#616161] ml-[24px]">
          Review past changes and perform a one-time undo to revert recent actions.</p>
      </div>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* <Box
              padding="200"
              background="bg-surface-warning"
              borderRadius="200"
              width="fit-content"
            >
              <InlineStack gap="200" align="start" blockAlign="center">
                <Icon source={AlertTriangleIcon} tone="warning" />
                <Text
                  as="span"
                  variant="bodySm"
                  tone="caution"
                  fontWeight="bold"
                >
                  History expires in 2 Days
                </Text>
              </InlineStack>
            </Box> */}

            <LogsTable
              logs={logs}
              openRow={openRow}
              setOpenRow={setOpenRow}
              handleRestore={handleRestoreClick}
              isLoading={isLoading}
              onNext={handleNextPage}
              onPrev={handlePrevPage}
              hasNext={pageInfo.hasNextPage}
              hasPrev={pageInfo.hasPreviousPage}
              isDbCreated={iscreateDB}
              onCreateDb={handleCreateDatabaseClick}
            />
          </BlockStack>
        </Layout.Section>
      </Layout>

      <Modal
        open={modalState.isOpen || isRestoring}
        onClose={() => {
          if (isRestoring && restoreCompleted < restoreTotal) return; // Prevent closing while restoring
          if (isRestoring && restoreCompleted >= restoreTotal) {
            setIsRestoring(false);
            setModalState({ ...modalState, isOpen: false });
            return;
          }
          setModalState({ ...modalState, isOpen: false });
        }}
        title={
          isRestoring
            ? restoreCompleted < restoreTotal
              ? "Restoring Data..."
              : "Restore Complete"
            : modalState.title || "Confirm Action"
        }
        primaryAction={
          isRestoring
            ? restoreCompleted >= restoreTotal
              ? {
                content: "Done",
                onAction: () => {
                  setIsRestoring(false);
                  setModalState({ ...modalState, isOpen: false });
                },
              }
              : undefined
            : {
              content:
                modalState.title === "Create Database"
                  ? "Yes, Create"
                  : "Restore",
              onAction: handleConfirmAction,
              destructive: true,
              loading: isSubmitting,
            }
        }
        secondaryActions={
          isRestoring
            ? []
            : [
              {
                content:
                  modalState.title === "Create Database"
                    ? "Maybe Later"
                    : "Cancel",
                onAction: () =>
                  setModalState({ ...modalState, isOpen: false }),
              },
            ]
        }
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p">{modalState.message}</Text>
            {isRestoring && (
              <BlockStack gap="200">
                <ProgressBar
                  progress={
                    restoreTotal > 0
                      ? (restoreCompleted / restoreTotal) * 100
                      : 0
                  }
                  tone="highlight"
                />
                <Text as="p" tone="subdued">
                  {restoreCompleted < restoreTotal
                    ? `Restoring item ${restoreCompleted} of ${restoreTotal}`
                    : `Successfully restored ${restoreTotal} items.`}
                </Text>
              </BlockStack>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
