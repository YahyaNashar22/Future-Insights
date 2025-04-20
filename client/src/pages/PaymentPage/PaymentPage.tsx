// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const PaymentPage = () => {
  const backend = import.meta.env.VITE_BACKEND;

  const handlePayment = async (e) => {
    e.preventDefault();

    const paymentData = {
        merchant_id: import.meta.env.VITE_MERCHANT_ID,
        order_id: `ORD_${Date.now()}`,
        currency: "AED",
        amount: "500.00",
        redirect_url: `${backend}/payment-response`,
        cancel_url: `${backend}/payment-cancel`,
        language: "en",
        billing_name: "John Doe",
        billing_email: "john@example.com",
        billing_tel: "9999999999",
        billing_address: "123 Street",
        billing_city: "Dubai",
        billing_state: "Dubai",
        billing_zip: "00000",
        billing_country: "United Arab Emirates",
    };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${backend}/ccavRequestHandler`;

    for (const key in paymentData) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = paymentData[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="payment-page">
      <h2>CCAvenue Payment</h2>
      <button onClick={handlePayment}>Pay 500 AED</button>
    </div>
  );
};

export default PaymentPage;
