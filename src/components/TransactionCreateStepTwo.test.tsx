import {render, screen} from "@testing-library/react"
import TransactionCreateStepTwo from "./TransactionCreateStepTwo";
import {DefaultPrivacyLevel, User} from "../models";
import userEvent from "@testing-library/user-event"

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

const mockShowSnackbar: any = jest.fn();

// Mock the props that we want to pass into our rendered TransactionCreateStepTwo component in our test
const mockedTransactionCreateStepTwoProps: any = {
  sender: mockUser,
  receiver: mockUser,
  createTransaction: () => {}, // Empty function
  mockShowSnackbar
};

test("on initial render, the pay button is disabled", async () => {
  render(<TransactionCreateStepTwo {...mockedTransactionCreateStepTwoProps} />);
  expect(await screen.findByRole("button", { name: /pay/i })).toBeDisabled();
});

test("Button enables when user enters their information to submit a transaction", async () => {
  const user: any = userEvent.setup();

  render(<TransactionCreateStepTwo {...mockedTransactionCreateStepTwoProps} />);

  // Get fields user will interact with
  const amountInput: HTMLElement = screen.getByPlaceholderText("Amount");
  const descriptionInput: HTMLElement = screen.getByPlaceholderText("Add a note");
  const payButton: HTMLElement = screen.getByText("Pay");

  await user.click(amountInput)
  await user.keyboard("$34,534")

  await user.click(descriptionInput)
  await user.keyboard("Spaghetti money")

  // Expect the button to not be disabled and clickable
  expect(payButton).not.toBeDisabled();
});
