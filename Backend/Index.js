require("dotenv").config();
const express = require("express");
const cors = require("cors");
const printful = require("./printful");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "OK" }));

app.get("/api/products", async (_, res) => {
  try {
    const { data } = await printful.get("/store/products");
    const products = (data?.result || []).map(p => ({
      id: p.id,
      name: p.name || "Unnamed",
      thumbnail: p.thumbnail_url || "",
      variants: p.variants || []
    }));
    res.json({ success: true, products });
  } catch {
    res.status(200).json({ success: false, products: [] });
  }
});

app.post("/api/order", async (req, res) => {
  try {
    const { items, customer } = req.body;
    if (!items?.length || !customer) return res.status(400).json({ error: "Invalid order data" });

    const orderData = {
      recipient: {
        name: customer.name,
        address1: customer.address,
        city: customer.city,
        country_code: customer.country,
        state_code: customer.state,
        zip: customer.zip
      },
      items: items.map(i => ({
        sync_variant_id: i.sync_variant_id,
        quantity: i.quantity
      })),
      retail_order: true
    };

    const { data } = await printful.post("/orders", orderData);
    res.json({ success: true, order_id: data?.result?.id });
  } catch {
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
