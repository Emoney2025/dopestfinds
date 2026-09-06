#!/usr/bin/env node
// Validates products.json and regression-checks the site's own filter/search
// logic (mirrored from app.js) after using the add-product skill.
// Usage: node .claude/skills/add-product/verify.mjs "New Product Name"

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const productsPath = path.join(repoRoot, "products.json");
const newName = process.argv[2];

let failed = false;
const fail = (msg) => {
  failed = true;
  console.error(`FAIL: ${msg}`);
};
const ok = (msg) => console.log(`OK: ${msg}`);

let raw;
try {
  raw = readFileSync(productsPath, "utf8");
} catch (e) {
  fail(`could not read products.json: ${e.message}`);
  process.exit(1);
}

let products;
try {
  products = JSON.parse(raw);
} catch (e) {
  fail(`products.json is not valid JSON: ${e.message}`);
  process.exit(1);
}
ok("products.json is valid JSON");

if (!Array.isArray(products) || products.length === 0) {
  fail("products.json must be a non-empty array");
  process.exit(1);
}

const required = ["name", "category", "badge", "url"];
products.forEach((p, i) => {
  for (const field of required) {
    if (!p[field] || typeof p[field] !== "string") {
      fail(`entry #${i} ("${p.name || "?"}") is missing required field "${field}"`);
    }
  }
  if (!p.image && !p.emoji) {
    fail(`entry #${i} ("${p.name || "?"}") has neither "image" nor "emoji"`);
  }
});
if (!failed) ok(`all ${products.length} entries have the required fields`);

// Duplicate check: same name (case-insensitive), or same non-placeholder url.
const namesSeen = new Map();
const urlsSeen = new Map();
for (const p of products) {
  const nameKey = String(p.name).trim().toLowerCase();
  if (namesSeen.has(nameKey)) {
    fail(`duplicate product name: "${p.name}"`);
  }
  namesSeen.set(nameKey, true);

  if (p.url && p.url !== "#") {
    if (urlsSeen.has(p.url)) {
      fail(`duplicate affiliate url used by multiple products: "${p.url}"`);
    }
    urlsSeen.set(p.url, true);
  }
}
if (!failed) ok("no duplicate product names or affiliate URLs found");

// Mirror app.js's draw()/drawFilters() logic exactly.
function categoryFilter(list, cat) {
  return list.filter((x) => cat === "All" || x.category === cat);
}
function searchFilter(list, cat, query) {
  const q = query.toLowerCase();
  return list.filter(
    (x) =>
      (cat === "All" || x.category === cat) &&
      (!q || `${x.name} ${x.category}`.toLowerCase().includes(q))
  );
}

const categories = ["All", ...new Set(products.map((x) => x.category))];
ok(`categories present: ${categories.filter((c) => c !== "All").join(", ")}`);

for (const cat of categories) {
  const count = categoryFilter(products, cat).length;
  if (cat !== "All" && count === 0) {
    fail(`category "${cat}" filters to zero products (should be unreachable)`);
  }
}
if (!failed) ok("every category filters to at least one product");

if (newName) {
  const nameKey = newName.trim().toLowerCase();
  const match = products.find((p) => p.name.trim().toLowerCase() === nameKey);
  if (!match) {
    fail(`could not find newly-added product "${newName}" in products.json`);
  } else {
    ok(`found new product "${match.name}" (category: ${match.category})`);

    const catResults = categoryFilter(products, match.category);
    if (!catResults.some((p) => p.name === match.name)) {
      fail(`category filter for "${match.category}" does not include the new product`);
    } else {
      ok(`category filter "${match.category}" includes the new product (${catResults.length} results)`);
    }

    const searchTerm = match.name.split(" ")[0];
    const searchResults = searchFilter(products, "All", searchTerm);
    if (!searchResults.some((p) => p.name === match.name)) {
      fail(`search for "${searchTerm}" does not surface the new product`);
    } else {
      ok(`search for "${searchTerm}" surfaces the new product (${searchResults.length} results)`);
    }
  }
} else {
  console.log("NOTE: no product name argument given, skipping new-product-specific checks.");
}

if (failed) {
  console.error("\nverify.mjs: FAILED — fix the issues above before committing.");
  process.exit(1);
} else {
  console.log("\nverify.mjs: all checks passed.");
}
