import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface LoanFormData {
  loanAmount: number;
  startDate: Date;
  paymentFrequency: string;
  loanPeriod: number;
  interestType: string;
}

export const LoanForm = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    loanAmount: yup.number().required("Enter the loan amount to borrow(ed) to calculate."),
    startDate: yup.date().required("You must enter the date when the loan will begin/begun."),
    paymentFrequency: yup.string().required("You must enter the payment frequency in MONTHS"),
    loanPeriod: yup.number().required("Enter the period to repay the loan in years"),
    interestType: yup.string().required("Choose the interest type"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: yupResolver(schema),
  });

  const loansRef = collection(db, "loans");

  const onNewLoan = async (data: LoanFormData) => {
    await addDoc(loansRef, {
      ...data,
      loanee: user?.displayName,
      userId: user?.uid,
    });

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onNewLoan)}>
      <label>Loan Amount: </label><input placeholder="KES..." {...register("loanAmount")} />
      <p style={{ color: "red" }}> {errors.loanAmount?.message}</p>
      <label>Start Date: </label> <input type="date" placeholder="Date..." {...register("startDate")} />
      <p style={{ color: "red" }}> {errors.startDate?.message}</p>
      <label>Payement Frequency: </label> <select {...register("paymentFrequency")}>
        <option value="">Select...</option>
        <option value="annually">Annually</option>
        <option value="semiannually">Semi-Annually</option>
        <option value="quartery">Quartery</option>
        <option value="monthly">Monthly</option>
      </select>
      <p style={{ color: "red" }}> {errors.paymentFrequency?.message}</p>
      <label>Loan Period: </label><input placeholder="Years..." {...register("loanPeriod")} />
      <p style={{ color: "red" }}> {errors.loanPeriod?.message}</p>
      <label>Preffered Interest Type: </label> <select {...register("interestType")}>
        <option value="">Select...</option>
        <option value="flat-rate">Flat Rate</option>
        <option value="reducing-balance">Reducing Balance</option>
      </select>
      <p style={{ color: "red" }}> {errors.interestType?.message}</p>
      <input type="submit" className="submitForm" />
    </form>
  );
};
