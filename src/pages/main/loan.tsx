import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../config/firebase";
import { Loan as ILoan } from "./main";
import { PDFDownloadLink, PDFViewer, Document, View, Page, Text, StyleSheet } from '@react-pdf/renderer';

interface Props {
  loan: ILoan;
}
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#000',
    color: '#fff',
    padding: 8,
  },
  listItem: {
    fontSize: 14,
    padding: 8,
  },
});
export const Loan = ({ loan }: Props) => {
  const [user] = useAuthState(auth);

  const calculateLoan = (loan: ILoan) => {
    let rate = loan.interestType === "reducing-balance" ? 0.25 : 0.18;
    let time = loan.loanPeriod;
    let emi = 0;
    let totalLoanPayable = 0;
    let totalInterest = 0;
    let totalPayment = 0;
    let processingFee = 0.03 * loan.loanAmount;
    let exciseDuty = 0.2 * processingFee;
    let legalFee = 10000;
    let charges = processingFee + exciseDuty + legalFee;

    if (loan.paymentFrequency === "monthly") {
      time *= 12;
    } else if (loan.paymentFrequency === "quarterly") {
      time *= 4;
    } else if (loan.paymentFrequency === "semiannually") {
      time *= 2;
    } else {
      time *= 1;
    }

    if (rate === 0.25) {
      let installments = time;
      let balance = loan.loanAmount;
      let payment = balance / installments;
      let principalPayment = loan.loanAmount / time;
      const loanInstallments = [];

      for (let i = 0; i < installments; i++) {
        let interestPayment = balance * rate;
        let principalPayment = payment - interestPayment;
        balance -= interestPayment;
        totalInterest += interestPayment;
        totalPayment += payment;
        const installmentNumber = i + 1;
        loanInstallments.push({
          installmentNumber,
          loanBorrowed: loan.loanAmount,
          interests: interestPayment,
          rate,
          emi: totalPayment,
          balance,
        });
      }

      totalLoanPayable = totalPayment + charges;
      emi = totalLoanPayable / time;

      return { emi, totalLoanPayable, loanInstallments };
    } else {
      let interestPerInstallment = (loan.loanAmount * loan.loanPeriod * rate) / time;
      let installments = time;
      let balance = 0;
      let totalPayment = 0;
      let payment = loan.loanAmount / installments;
      let emi = interestPerInstallment + payment;
      const loanInstallments = [];

      for (let i = 0; i < installments; i++) {
        balance = loan.loanAmount - interestPerInstallment;
        let interestPayment = balance * rate;
        let principalPayment = payment - interestPayment;
        balance -= interestPayment;
        totalInterest += interestPayment;
        totalPayment += emi;
        const installmentNumber = i + 1;
        loanInstallments.push({
          installmentNumber,
          loanBorrowed: loan.loanAmount,
          interests: interestPayment,
          rate,
          emi,
          balance,
        });
      }
      totalLoanPayable = (interestPerInstallment * installments) + loan.loanAmount + processingFee + exciseDuty + legalFee;
      emi = totalLoanPayable / time;

      return { emi, totalLoanPayable, loanInstallments };
    }
  };
  const { emi, totalLoanPayable, loanInstallments } = calculateLoan(loan);
  const LoanDocument = () => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Loan Statement</Text>
                <Text style={styles.heading}>Period  Loan Borrowed          EMI                 Interest           Outstanding Balance  </Text>
                {loanInstallments.map((loanInstallment, index) => (
                    <Text key={index} style={styles.listItem}>
                        {`         ${loanInstallment.installmentNumber}            ${loanInstallment.loanBorrowed.toFixed(2)}         ${loanInstallment.emi.toFixed(2)}           ${loanInstallment.interests.toFixed(2)}          ${loanInstallment.balance.toFixed(2)}  `}
                    </Text>
                ))}
            </View>
        </Page>
    </Document>
);
  const loanDocument = <LoanDocument />;
  console.log(loanDocument);
  const subject = "Loan Report";
  return (
    <div>
      <h2>Dear <i>{loan.loanee}</i>, Here is the Loan Summary for KES {loan.loanAmount} Loan </h2>
      <h3><i>(Calculations were done using {loan.interestType} method)</i></h3>

      <p>Payment Frequency: {loan.paymentFrequency} </p>
      <h4>Other Charges</h4>

      <p>Total Loan Payable: {totalLoanPayable}</p>
      <PDFViewer width="100%" height="100%">
        {loanDocument}
      </PDFViewer>
      <PDFDownloadLink fileName={`loan-statement.pdf`} document={loanDocument}>
        Save PDF
      </PDFDownloadLink>
      <h3> Send with <a href="mailto:`{user?.email}`?subject={subject} &body={loanDocument}">email</a></h3>
    </div>
  );
};