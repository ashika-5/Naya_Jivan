import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Btn } from "../components/UI";
import toast from "react-hot-toast";

const METHODS = [
  {
    id: "esewa",
    name: "eSewa",
    desc: "Pay using eSewa digital wallet",
  },
  {
    id: "cash",
    name: "Pay at Hospital",
    desc: "Pay cash when you visit",
  },
];

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [method, setMethod] = useState("esewa");
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    if (!method) {
      toast.error("Please select a payment method");
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((r) => setTimeout(r, 1400));
      toast.success("Payment successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <div className="bg-white rounded-2xl p-10 border border-[rgba(0,0,0,0.09)] shadow-lg">
        <h1 className="font-bold text-2xl mb-2">Complete Payment</h1>
        <p className="text-sm text-gray-600 mb-7">
          Select your preferred payment method below.
        </p>

        {/* Payment methods */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Select Payment Method
        </p>
        <div className="space-y-3 mb-7">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150
                ${
                  method === m.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-gray-600">{m.desc}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  method === m.id
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              >
                {method === m.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>

        {method === "esewa" && (
          <div className="bg-blue-50 rounded-xl p-4 mb-7">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
              eSewa Test Credentials
            </p>
            <div className="space-y-1.5 text-sm text-blue-700">
              <p>
                📱 Phone: <strong>9806800001</strong>
              </p>
              <p>
                🔑 MPIN: <strong>1122</strong>
              </p>
            </div>
          </div>
        )}

        <Btn
          className="w-full justify-center py-3 text-base mb-3"
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? "Processing…" : "Proceed to Pay"}
        </Btn>

        <Btn
          variant="outline"
          className="w-full justify-center"
          onClick={() => navigate("/doctors")}
        >
          Cancel
        </Btn>
      </div>
    </div>
  );
}
