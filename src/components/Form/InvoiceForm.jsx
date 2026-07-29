import { Button, Form, Card, Row, Col } from "react-bootstrap";

export default function InvoiceForm({ data, setData }) {
  const updateItem = (index, field, value) => {
    const updated = [...data.items];
    updated[index][field] = value;
    setData({ ...data, items: updated });
  };

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { name: "", qty: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const updated = data.items.filter((_, i) => i !== index);
    setData({ ...data, items: updated });
  };

  return (
    <div className="container my-3 my-md-4">
      <h4 className="mb-3 mb-md-4">Document Input</h4>

      {/* Form Header Section - Responsive Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <Form.Group>
            <Form.Label>Document Type</Form.Label>
            <Form.Select
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            >
              <option value="quotation">Quotation</option>
              <option value="invoice">Invoice</option>
              <option value="device-received">Device Received Acknowledgement Slip</option>
            </Form.Select>
          </Form.Group>
        </div>

        <div className="col-12 col-md-6">
          <Form.Group>
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              placeholder="Customer Name"
              value={data.customer}
              onChange={(e) => setData({ ...data, customer: e.target.value })}
            />
          </Form.Group>
        </div>

        <div className="col-12">
          <Form.Group>
            <Form.Label>
              {data.type === "invoice"
                ? "Invoice Serial Number"
                : data.type === "quotation"
                ? "Quotation Serial Number"
                : "Acknowledgement Serial Number"}
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter serial/reference (e.g. 001)"
              value={data.serial}
              onChange={(e) => setData({ ...data, serial: e.target.value })}
            />
          </Form.Group>
        </div>
      </div>

      {/* Items Section Header */}
      <h5 className="mb-3">Items</h5>

      {/* Item Cards - Fully Responsive */}
      {data.items.map((item, i) => (
        <div key={i} className="card mb-3 shadow-sm border-0 bg-light">
          <div className="card-body p-3">
            <div className="row g-2 align-items-end">
              {/* Item Description - Full width on mobile */}
              <div className="col-12 col-md-5">
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase" style={{ fontSize: '0.75rem' }}>Item Description</Form.Label>
                  <Form.Control
                    placeholder="Item name or description"
                    value={item.name}
                    onChange={(e) => updateItem(i, "name", e.target.value)}
                  />
                </Form.Group>
              </div>

              {/* Quantity */}
              <div className="col-4 col-md-2">
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase" style={{ fontSize: '0.75rem' }}>Qty</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
                  />
                </Form.Group>
              </div>

              {/* Price */}
              <div className="col-5 col-md-3">
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase" style={{ fontSize: '0.75rem' }}>Price</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(i, "price", Number(e.target.value))}
                  />
                </Form.Group>
              </div>

              {/* Remove Button */}
              <div className="col-12 mt-2">
                <Button
                  variant="link"
                  className="text-danger p-0 text-decoration-none small"
                  onClick={() => removeItem(i)}
                >
                  <i className="bi bi-trash"></i> Remove Item
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Item Button - Full width on mobile */}
      <div className="d-grid d-sm-block mb-4">
        <Button variant="success" onClick={addItem}>
          + Add Item
        </Button>
      </div>

      {/* Total Summary Card */}
      <div className="card bg-light border-primary">
        <div className="card-body">
          <div className="row">
            <div className="col-6 text-end">
              <h5 className="mb-0">Grand Total:</h5>
            </div>
            <div className="col-6">
              <h5 className="mb-0 text-primary">
                {data.items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}