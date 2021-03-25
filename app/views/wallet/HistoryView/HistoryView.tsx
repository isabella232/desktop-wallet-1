import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

import { Redirect } from 'react-router-dom';

import { LoadingScreen } from '../../../components';
import useFullService from '../../../hooks/useFullService';
import type TransactionLog from '../../../types/TransactionLog';
import * as localStore from '../../../utils/LocalStore';
import TransactionDetailsView from '../TransactionDetailsView';
import HistoryList from './HistoryList';

const HistoryView: FC = () => {
  const HISTORY = 'history';
  const DETAILS = 'details';

  const [currentTransactionLog, setCurrentTransaction] = useState({} as TransactionLog);
  const [showing, setShowing] = useState(HISTORY);

  const {
    addresses,
    selectedAccount,
    transactionLogs,
    txos,
    fetchAllTransactionLogsForAccount,
    fetchAllTxosForAccount,
  } = useFullService();

  const listOfContacts = localStore.getContacts();

  useEffect(() => {
    fetchAllTransactionLogsForAccount(selectedAccount.account.accountId);
    fetchAllTxosForAccount(selectedAccount.account.accountId);
  }, [selectedAccount?.account?.accountId]); /* eslint-disable-line react-hooks/exhaustive-deps */

  // TODO -- this error state is fine, we should reintroduce
  // useEffect(() => {
  //   try {
  //   } catch (err) {
  //     setShowing(ERROR);
  //   }
  // }, []);

  if (transactionLogs === null) {
    return <LoadingScreen />;
  }

  if (transactionLogs.transactionLogIds.length === 0) {
    return <span>show empty state</span>;
  }

  const buildList = (): TransactionLog[] =>
    transactionLogs.transactionLogIds
      .map((id) => transactionLogs.transactionLogMap[id])
      .filter((txo) => txo.assignedAddressId !== addresses.addressIds[1])
      .map((txo) => {
        const contact = listOfContacts.find((x) => x.assignedAddress === txo.assignedAddressId);
        if (contact) {
          txo.contactName = contact.alias; /* eslint-disable-line no-param-reassign */
        }
        return txo;
      })
      .sort((a, b) => b.offsetCount - a.offsetCount);

  switch (showing) {
    case HISTORY:
      return (
        <HistoryList
          transactionLogsList={buildList()}
          onTransactionClick={(transactionLog) => {
            setCurrentTransaction(transactionLog);
            setShowing(DETAILS);
          }}
        />
      );

    case DETAILS:
      /*
            We should get the TXOs for the transaction
          */

      return (
        <TransactionDetailsView
          comment="this should come from metadata"
          onClickBack={() => setShowing(HISTORY)}
          onChangedComment={(t: string, c: string) => console.log(`t: ${t}, c: ${c}`)}
          transactionLog={currentTransactionLog}
          txos={txos}
        />
      );

    default:
      return <Redirect to="-" />;
  }
};

export default HistoryView;
