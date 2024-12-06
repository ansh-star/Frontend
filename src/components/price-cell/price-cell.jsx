import { useRef, useState } from "react";
import "./price-cell.css";
import EditPen from "../widget/Edit-pen";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export default function PriceCell({ params }) {
  const [price, setPrice] = useState(parseFloat(params.row?.mrp) || 100);
  const [editing, setEditing] = useState(false);
  const pCell = useRef(null);
  const changePrice = async (e) => {
    console.log("Editing price", e.target.value);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/product`,
        {
          id: params.row?._id,
          mrp: parseFloat(e.target.value),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      if (response.data?.success) {
        setPrice(parseFloat(e.target.value));
      } else {
        pCell.current.focus();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        type="number"
        value={price}
        className="priceCell"
        disabled={!editing}
        ref={pCell}
        onChange={(e) => {
          if (parseFloat(e.target.value) < 0) {
            pCell.current.focus();
            return;
          }
          setPrice(parseFloat(e.target.value));
        }}
        onFocus={() => setEditing(true)}
        onBlur={(e) => {
          setEditing(false);
          changePrice(e);
        }}
      />
      {!editing && (
        <EditPen
          onClick={() => {
            setEditing(true);
            setTimeout(() => pCell.current.focus(), 0);
          }}
        />
      )}
    </div>
  );
}
