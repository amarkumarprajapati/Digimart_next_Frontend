 
import { useEffect } from "react";
import { useRouter } from "next/navigation";


const PaymentPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/CheckoutPage", { replace: true });
  }, [router]);

  return null;
};

export default PaymentPage;
