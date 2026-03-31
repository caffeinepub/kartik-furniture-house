import { useCallback, useEffect, useState } from "react";
import type { Enquiry } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// Local DesignRequest type (bridges backend.d.ts until backend.ts is regenerated)
interface DesignRequest {
  name: string;
  phone: string;
  city: string;
  furnitureType: string;
  dimensionLength: string;
  dimensionWidth: string;
  dimensionHeight: string;
  material: string;
  color: string;
  budget: string;
  description: string;
  imageURLs: string[];
  timestamp: bigint;
  status: string;
}

interface DesignActorBridge {
  getDesignRequests(): Promise<DesignRequest[]>;
  updateDesignRequestStatus(id: bigint, status: string): Promise<void>;
  deleteDesignRequest(id: bigint): Promise<void>;
}

const FURNITURE_TYPE_FILTERS = [
  "All",
  "Bed",
  "Chair",
  "Table",
  "Cupboard",
  "Door",
];

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Admin() {
  const { identity, login, clear, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  // Design requests state
  const [designRequests, setDesignRequests] = useState<DesignRequest[]>([]);
  const [loadingDesignRequests, setLoadingDesignRequests] = useState(false);
  const [deletingDesignId, setDeletingDesignId] = useState<bigint | null>(null);
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);
  const [filterType, setFilterType] = useState("All");

  // Tab state
  const [activeTab, setActiveTab] = useState<"enquiries" | "design-requests">(
    "enquiries",
  );

  const goHome = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const fetchEnquiries = useCallback(async () => {
    if (!actor || !identity) return;
    setLoadingEnquiries(true);
    try {
      const data = await actor.getAllEnquiries();
      const sorted = [...data].sort((a, b) =>
        b.timestamp > a.timestamp ? 1 : -1,
      );
      setEnquiries(sorted);
    } catch {
      // not admin or fetch error
    } finally {
      setLoadingEnquiries(false);
    }
  }, [actor, identity]);

  const fetchDesignRequests = useCallback(async () => {
    if (!actor || !identity) return;
    setLoadingDesignRequests(true);
    try {
      const data = await (
        actor as unknown as DesignActorBridge
      ).getDesignRequests();
      const sorted = [...data].sort((a, b) =>
        b.timestamp > a.timestamp ? 1 : -1,
      );
      setDesignRequests(sorted);
    } catch {
      // not admin or fetch error
    } finally {
      setLoadingDesignRequests(false);
    }
  }, [actor, identity]);

  useEffect(() => {
    if (!actor || !identity) {
      setIsAdmin(null);
      return;
    }
    actor
      .isCallerAdmin()
      .then((admin) => {
        setIsAdmin(admin);
        if (admin) {
          // Fetch both concurrently
          Promise.all([fetchEnquiries(), fetchDesignRequests()]);
        }
      })
      .catch(() => setIsAdmin(false));
  }, [actor, identity, fetchEnquiries, fetchDesignRequests]);

  const handleRefresh = () => {
    if (activeTab === "enquiries") {
      fetchEnquiries();
    } else {
      fetchDesignRequests();
    }
  };

  const handleDeleteEnquiry = async (id: bigint) => {
    if (!actor) return;
    setDeletingId(id);
    try {
      await actor.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.timestamp !== id));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkComplete = async (id: bigint) => {
    if (!actor) return;
    setUpdatingId(id);
    try {
      await (actor as unknown as DesignActorBridge).updateDesignRequestStatus(
        id,
        "Completed",
      );
      setDesignRequests((prev) =>
        prev.map((r) =>
          r.timestamp === id ? { ...r, status: "Completed" } : r,
        ),
      );
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteDesignRequest = async (id: bigint) => {
    if (!actor) return;
    setDeletingDesignId(id);
    try {
      await (actor as unknown as DesignActorBridge).deleteDesignRequest(id);
      setDesignRequests((prev) => prev.filter((r) => r.timestamp !== id));
    } catch {
      // ignore
    } finally {
      setDeletingDesignId(null);
    }
  };

  const filteredDesignRequests =
    filterType === "All"
      ? designRequests
      : designRequests.filter((r) => r.furnitureType === filterType);

  // ── Loading / auth screens ───────────────────────────────────────────────

  if (isInitializing || isFetching) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brown-mid">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4" aria-hidden="true">
            🔐
          </div>
          <h1 className="font-heading text-3xl font-bold text-brown-deep mb-3">
            Admin Login
          </h1>
          <p className="text-brown-mid mb-8">
            Login with Internet Identity to access the admin panel.
          </p>
          <button
            type="button"
            onClick={login}
            className="bg-brown-deep text-cream font-bold px-8 py-3 rounded-full hover:bg-brown-mid transition-colors w-full mb-4"
            data-ocid="admin.login.button"
          >
            Login with Internet Identity
          </button>
          <button
            type="button"
            onClick={goHome}
            className="text-brown-mid hover:text-brown-deep transition-colors text-sm"
          >
            ← Back to Website
          </button>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brown-mid">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4" aria-hidden="true">
            🚫
          </div>
          <h1 className="font-heading text-3xl font-bold text-brown-deep mb-3">
            Access Denied
          </h1>
          <p className="text-brown-mid mb-8">
            You don&apos;t have admin privileges to view this page.
          </p>
          <button
            type="button"
            onClick={clear}
            className="bg-brown-deep text-cream font-bold px-8 py-3 rounded-full hover:bg-brown-mid transition-colors mr-3"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={goHome}
            className="border-2 border-brown-deep text-brown-deep font-bold px-8 py-3 rounded-full hover:bg-brown-deep hover:text-cream transition-colors"
          >
            ← Home
          </button>
        </div>
      </div>
    );
  }

  // ── Admin panel ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-brown-deep text-cream shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              🪑
            </span>
            <div>
              <span className="font-heading font-bold text-gold">
                Kartik Furniture House
              </span>
              <span className="text-cream/60 text-sm ml-2">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="text-cream/70 hover:text-gold transition-colors text-sm"
            >
              ↻ Refresh
            </button>
            <button
              type="button"
              onClick={clear}
              className="bg-white/10 hover:bg-white/20 text-cream px-4 py-1.5 rounded-full text-sm transition-colors"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={goHome}
              className="bg-gold text-brown-deep font-bold px-4 py-1.5 rounded-full text-sm transition-colors hover:bg-gold-dark"
            >
              ← Website
            </button>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            <button
              type="button"
              onClick={() => setActiveTab("enquiries")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "enquiries"
                  ? "bg-gold text-brown-deep shadow-sm"
                  : "bg-beige text-brown-mid hover:bg-gold/20 hover:text-brown-deep"
              }`}
              data-ocid="admin.enquiries.tab"
            >
              Enquiries
              <span className="ml-2 bg-brown-deep/10 text-brown-deep text-xs px-1.5 py-0.5 rounded-full">
                {enquiries.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("design-requests")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "design-requests"
                  ? "bg-gold text-brown-deep shadow-sm"
                  : "bg-beige text-brown-mid hover:bg-gold/20 hover:text-brown-deep"
              }`}
              data-ocid="admin.design_requests.tab"
            >
              Design Requests
              <span className="ml-2 bg-brown-deep/10 text-brown-deep text-xs px-1.5 py-0.5 rounded-full">
                {designRequests.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Enquiries tab ──────────────────────────────────────────── */}
        {activeTab === "enquiries" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brown-deep">
                  Enquiry Submissions
                </h1>
                <p className="text-brown-mid text-sm mt-1">
                  {enquiries.length} enquir
                  {enquiries.length !== 1 ? "ies" : "y"} received
                </p>
              </div>
            </div>

            {loadingEnquiries ? (
              <div
                className="text-center py-20"
                data-ocid="admin.enquiries.loading_state"
              >
                <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-brown-mid">Loading enquiries...</p>
              </div>
            ) : enquiries.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="admin.enquiries.empty_state"
              >
                <div className="text-5xl mb-4" aria-hidden="true">
                  📭
                </div>
                <p className="font-heading text-xl text-brown-deep mb-2">
                  No enquiries yet
                </p>
                <p className="text-brown-mid">
                  Customer enquiries will appear here once submitted.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl shadow-sm border border-beige">
                <table className="w-full bg-white">
                  <thead className="bg-beige">
                    <tr>
                      <th className="text-left px-4 py-3 text-brown-deep font-semibold text-sm">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-brown-deep font-semibold text-sm">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-brown-deep font-semibold text-sm">
                        Phone
                      </th>
                      <th className="text-left px-4 py-3 text-brown-deep font-semibold text-sm">
                        City
                      </th>
                      <th className="text-left px-4 py-3 text-brown-deep font-semibold text-sm">
                        Service
                      </th>
                      <th className="text-left px-4 py-3 text-brown-deep font-semibold text-sm hidden md:table-cell">
                        Message
                      </th>
                      <th className="text-left px-4 py-3 text-brown-deep font-semibold text-sm">
                        Date
                      </th>
                      <th className="text-left px-4 py-3 text-brown-deep font-semibold text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq, idx) => (
                      <tr
                        key={enq.timestamp.toString()}
                        className="border-t border-beige hover:bg-cream/60 transition-colors"
                        data-ocid={`admin.enquiries.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-brown-mid text-sm">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-brown-deep text-sm">
                          {enq.name}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`tel:${enq.phone}`}
                            className="text-gold hover:underline text-sm font-medium"
                          >
                            {enq.phone}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-brown-mid text-sm">
                          {enq.city}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-gold/20 text-brown-deep text-xs font-medium px-2.5 py-1 rounded-full">
                            {enq.service}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-brown-mid text-sm hidden md:table-cell max-w-xs">
                          <span title={enq.message}>
                            {enq.message.length > 60
                              ? `${enq.message.slice(0, 60)}\u2026`
                              : enq.message || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-brown-mid text-sm whitespace-nowrap">
                          {formatTimestamp(enq.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${enq.phone}`}
                              className="bg-brown-deep text-cream text-xs px-2.5 py-1 rounded-full hover:bg-brown-mid transition-colors"
                            >
                              📞
                            </a>
                            <a
                              href={`https://wa.me/91${enq.phone}?text=Hi ${encodeURIComponent(enq.name)}, regarding your enquiry for ${encodeURIComponent(enq.service)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-whatsapp text-white text-xs px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                            >
                              WA
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteEnquiry(enq.timestamp)}
                              disabled={deletingId === enq.timestamp}
                              className="bg-red-100 text-red-600 text-xs px-2.5 py-1 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
                              data-ocid={`admin.enquiries.delete_button.${idx + 1}`}
                            >
                              {deletingId === enq.timestamp ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Design Requests tab ────────────────────────────────────── */}
        {activeTab === "design-requests" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brown-deep">
                  Design Requests
                </h1>
                <p className="text-brown-mid text-sm mt-1">
                  {filteredDesignRequests.length} of {designRequests.length}{" "}
                  request{designRequests.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 mb-6">
              {FURNITURE_TYPE_FILTERS.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    filterType === type
                      ? "bg-gold text-brown-deep shadow-sm"
                      : "bg-beige text-brown-mid hover:bg-gold/20 hover:text-brown-deep"
                  }`}
                  data-ocid="admin.filter.tab"
                >
                  {type}
                </button>
              ))}
            </div>

            {loadingDesignRequests ? (
              <div
                className="text-center py-20"
                data-ocid="admin.design_requests.loading_state"
              >
                <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-brown-mid">Loading design requests...</p>
              </div>
            ) : filteredDesignRequests.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="admin.design_requests.empty_state"
              >
                <div className="text-5xl mb-4" aria-hidden="true">
                  ✏️
                </div>
                <p className="font-heading text-xl text-brown-deep mb-2">
                  No design requests
                  {filterType !== "All" ? ` for ${filterType}` : ""}
                </p>
                <p className="text-brown-mid">
                  Custom design requests will appear here once submitted.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {filteredDesignRequests.map((req, idx) => (
                  <div
                    key={req.timestamp.toString()}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-beige hover:shadow-md transition-shadow"
                    data-ocid={`admin.design_requests.item.${idx + 1}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-brown-deep text-base">
                          {req.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                          <a
                            href={`tel:${req.phone}`}
                            className="text-gold text-sm hover:underline font-medium"
                          >
                            {req.phone}
                          </a>
                          <span
                            className="text-brown-mid/40 text-xs"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <span className="text-sm text-brown-mid">
                            {req.city}
                          </span>
                          <span
                            className="text-brown-mid/40 text-xs"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <span className="text-xs text-brown-mid">
                            {formatTimestamp(req.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="bg-gold/20 text-brown-deep text-xs font-semibold px-2.5 py-1 rounded-full">
                          {req.furnitureType}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            req.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <div className="bg-beige rounded-lg p-2">
                        <p className="text-brown-mid text-xs mb-0.5">
                          Dimensions
                        </p>
                        <p className="font-semibold text-brown-deep text-xs">
                          {req.dimensionLength || "—"}&times;
                          {req.dimensionWidth || "—"}&times;
                          {req.dimensionHeight || "—"} cm
                        </p>
                      </div>
                      <div className="bg-beige rounded-lg p-2">
                        <p className="text-brown-mid text-xs mb-0.5">
                          Material
                        </p>
                        <p className="font-semibold text-brown-deep text-xs">
                          {req.material}
                        </p>
                      </div>
                      <div className="bg-beige rounded-lg p-2">
                        <p className="text-brown-mid text-xs mb-0.5">Color</p>
                        <p className="font-semibold text-brown-deep text-xs">
                          {req.color || "—"}
                        </p>
                      </div>
                      <div className="bg-beige rounded-lg p-2">
                        <p className="text-brown-mid text-xs mb-0.5">Budget</p>
                        <p className="font-semibold text-brown-deep text-xs">
                          {req.budget}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {req.description && (
                      <p
                        className="text-brown-mid text-sm line-clamp-2 mb-3"
                        title={req.description}
                      >
                        {req.description}
                      </p>
                    )}

                    {/* Image thumbnails */}
                    {req.imageURLs.length > 0 && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {req.imageURLs.slice(0, 4).map((url, imgIdx) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={url}
                              alt={`Reference ${imgIdx + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border border-beige hover:opacity-80 transition-opacity"
                            />
                          </a>
                        ))}
                        {req.imageURLs.length > 4 && (
                          <div className="w-16 h-16 bg-beige rounded-lg flex items-center justify-center text-brown-mid text-sm font-semibold">
                            +{req.imageURLs.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-beige">
                      <a
                        href={`tel:${req.phone}`}
                        className="bg-brown-deep text-cream text-xs px-3 py-1.5 rounded-full hover:bg-brown-mid transition-colors"
                      >
                        📞 Call
                      </a>
                      <a
                        href={`https://wa.me/91${req.phone}?text=${encodeURIComponent(`Hi ${req.name}, regarding your custom ${req.furnitureType} design request from Kartik Furniture House.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-whatsapp text-white text-xs px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
                      >
                        💬 WhatsApp
                      </a>
                      {req.status !== "Completed" && (
                        <button
                          type="button"
                          onClick={() => handleMarkComplete(req.timestamp)}
                          disabled={updatingId === req.timestamp}
                          className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50"
                          data-ocid={`admin.design_requests.toggle.${idx + 1}`}
                        >
                          {updatingId === req.timestamp
                            ? "..."
                            : "✓ Mark Complete"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteDesignRequest(req.timestamp)}
                        disabled={deletingDesignId === req.timestamp}
                        className="bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
                        data-ocid={`admin.design_requests.delete_button.${idx + 1}`}
                      >
                        {deletingDesignId === req.timestamp ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-cream/40 text-xs bg-brown-deep mt-10">
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gold transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
