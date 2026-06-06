 
import { useEffect } from "react";
import { useRouter } from "next/navigation";


const PaymentPage = () => {
  const navigate = useRouter();
  useEffect(() => {
    router.push("/CheckoutPage", { replace: true });
  }, [navigate]);

  return null;
};

export default PaymentPage;
