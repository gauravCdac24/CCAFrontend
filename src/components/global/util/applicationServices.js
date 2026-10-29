const DEFAULT_PARENT_ID = "1";

export const collectServiceNodes = (data = []) => {
  const nodes = [];
  data.forEach((parent) => {
    nodes.push({ id: parent.id, label: parent.label, parentId: null });
    (parent.children || []).forEach((child) => {
      nodes.push({ id: child.id, label: child.label, parentId: parent.id });
    });
  });
  return nodes;
};

export const defaultSelectedIds = (data = [], preSelectedParentId = DEFAULT_PARENT_ID) => {
  const parent = data.find((item) => item.id === preSelectedParentId);
  const mandatoryChildren = (parent?.children || [])
    .filter((child) => child.mandatory === "Yes")
    .map((child) => child.id);
  return [preSelectedParentId, ...mandatoryChildren];
};

export const selectedServiceLabels = (ids = [], data = []) => {
  const selected = new Set(ids);
  const labels = [];

  data.forEach((parent) => {
    const children = parent.children || [];
    const chosenChildren = children.filter((child) => selected.has(child.id));
    if (chosenChildren.length > 0) {
      chosenChildren.forEach((child) => labels.push(child.label));
      return;
    }
    if (selected.has(parent.id)) {
      labels.push(parent.label);
    }
  });

  return labels;
};

export const idsFromServiceLabels = (services, data = []) => {
  const wanted = new Set(
    (Array.isArray(services) ? services : String(services || "").split(","))
      .map((label) => label.trim().toLowerCase())
      .filter(Boolean)
  );
  if (wanted.size === 0) return [];

  const ids = [];
  data.forEach((parent) => {
    const children = parent.children || [];
    const childIds = children
      .filter((child) => wanted.has(child.label.trim().toLowerCase()))
      .map((child) => child.id);
    const parentSelected = wanted.has(parent.label.trim().toLowerCase());
    if (parentSelected || childIds.length > 0) {
      ids.push(parent.id, ...childIds);
    }
  });

  return [...new Set(ids)];
};

export const serviceFlagsFromLabels = (labels = []) => {
  const normalized = labels.map((label) => label.trim().toLowerCase());
  return {
    DSC: normalized.some(
      (label) =>
        label === "dsc" ||
        label.includes("timestamp") ||
        label === "crl" ||
        label === "ocsp" ||
        label.includes("ssl") ||
        label.includes("esign(internal)")
    ),
    eSign: normalized.some((label) => label.includes("esign")),
    TimeStamp: normalized.some((label) => label.includes("timestamp")),
    SSL: normalized.some((label) => label.includes("ssl")),
  };
};

export const parseStoredServices = (data) => {
  if (!data || typeof data !== "object") return [];

  const raw = data.services || data.bankDetails?.services || data.selectedServices || "";
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((item) => item.trim()).filter(Boolean);
  }

  const flags = [];
  if (data.DSC === true || data.dsc === true) flags.push("DSC");
  if (data.eSign === true) flags.push("eSign");
  if (data.TimeStamp === true || data.timeStamp === true) flags.push("TimeStamp");
  if (data.SSL === true || data.ssl === true) flags.push("SSL");
  return flags;
};
