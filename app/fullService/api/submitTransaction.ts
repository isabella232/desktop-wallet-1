import { StringHex } from '../../types/SpecialStrings';
import type TransactionLog from '../../types/TransactionLog';
import type TxProposal from '../../types/TxProposal';
import axiosFullService from '../axiosFullService';

const SUBMIT_TRANSACTION_METHOD = 'submit_transaction';

type SubmitTransactionParams = {
  accountId?: StringHex;
  txProposal: TxProposal;
};

type SubmitTransactionResult = {
  transaction: TransactionLog;
};

const submitTransaction = async ({
  accountId,
  txProposal,
}: SubmitTransactionParams): Promise<SubmitTransactionResult> => {
  const { result, error } = await axiosFullService(SUBMIT_TRANSACTION_METHOD, {
    accountId,
    txProposal,
  });

  if (error) {
    // TODO - I'll write up a better error handler
    throw new Error(error);
  } else {
    return result;
  }
};

export default submitTransaction;
