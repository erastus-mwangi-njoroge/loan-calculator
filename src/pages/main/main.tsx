import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { Loan } from "./loan";

export interface Loan {
  id: string;
  userId: string;
  loanee: string;
  loanAmount: number;
  startDate: Date;
  paymentFrequency: string;
  loanPeriod: number;
  interestType: string;
}

export const Main = () => {
  const [loansList, setLoansList] = useState<Loan[] | null>(null);
  const loansRef = collection(db, "loans");

  const getLoans = async () => {
    const data = await getDocs(loansRef);
    setLoansList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Loan[]
    );
  };

  useEffect(() => {
    getLoans();
  }, []);

  return (
    <div>
      {loansList?.map((loan) => (
        <Loan loan={loan} />
      ))}
    </div>
  );
};
