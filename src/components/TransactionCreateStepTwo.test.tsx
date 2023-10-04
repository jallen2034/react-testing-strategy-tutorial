import {fireEvent, render, screen} from "@testing-library/react"
import TransactionCreateStepTwo, {TransactionCreateStepTwoProps} from "./TransactionCreateStepTwo";
import {DefaultPrivacyLevel, User} from "../models";
import {act} from "react-dom/test-utils";

// Mock a date to be the current date
const mockDate: Date = new Date();

// Create a mock user object that adheres to the User interface
const mockUser: User = {
  id: '5',
  uuid: 'some-uuid',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  password: 'password',
  email: 'john@example.com',
  phoneNumber: '1234567890',
  balance: 100,
  avatar: 'avatar.jpg',
  defaultPrivacyLevel: DefaultPrivacyLevel.public, // Match the enum type
  createdAt: mockDate,
  modifiedAt: mockDate,
};

// Mock the props that we want to pass into our rendered TransactionCreateStepTwo component in our test
const mockedTransactionCreateStepTwoProps: TransactionCreateStepTwoProps = {
  sender: mockUser,
  receiver: mockUser,
  createTransaction: () => {}, // Empty function
  showSnackbar: () => {}, // Empty function
};

test("on initial render, the pay button is disabled", async () => {
  render(<TransactionCreateStepTwo {...mockedTransactionCreateStepTwoProps} />);
  expect(await screen.findByRole("button", { name: /pay/i })).toBeDisabled();
});

test("clicking the pay button changes transactionType to 'payment'", async () => {
  render(<TransactionCreateStepTwo {...mockedTransactionCreateStepTwoProps} />);

  const payButton: HTMLElement = screen.getByRole("button", { name: /pay/i });

  // Simulate a click on the "Pay" button
  act(() => {
    fireEvent.click(payButton);
  });

  // Now, check if the transactionType state has changed to "payment"
  const transactionTypeText: HTMLElement = screen.getByText(/payment/i);
  expect(transactionTypeText).toBeInTheDocument();
});